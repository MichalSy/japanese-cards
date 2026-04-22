'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { fetchCategoryWithItems } from '@/config/api'
import { useT } from '@/components/I18nContext'
import { fetchProgressFromServer, computeGroupProgress } from '@/utils/progressStorage'
import { useSetBackHandler } from '@/components/BackHandlerContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

function ProgressBar({ value }) {
  return (
    <div style={{ height: '4px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', height: '4px', borderRadius: '9999px', width: `${value}%`, transition: 'width 0.3s ease' }} />
    </div>
  )
}

export default function ContentTypeView({ params }) {
  const { contentType } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useT()
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') === 'practice' ? 'practice' : 'learn')
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupData, setGroupData] = useState({})
  const [progress, setProgress] = useState({})

  const tabContainerRef = useRef(null)
  const [indicatorLeft, setIndicatorLeft] = useState(0)
  const [indicatorWidth, setIndicatorWidth] = useState(0)
  const [indicatorDuration, setIndicatorDuration] = useState(0)
  const [indicatorReady, setIndicatorReady] = useState(false)

  const tabs = [
    { id: 'learn', label: t('category.tab.learn') },
    { id: 'practice', label: t('category.tab.practice') },
  ]

  useSetBackHandler(() => router.push('/'))

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [config, serverProgress, coursesRes] = await Promise.all([
          fetchCategoryWithItems(contentType),
          fetchProgressFromServer(contentType),
          fetch('/api/learn/courses').then(r => r.ok ? r.json() : { courses: [] }),
        ])
        setCategoryConfig(config)
        setProgress(serverProgress)
        const groups = {}
        for (const group of config.groups) groups[group.id] = group.items || []
        setGroupData(groups)
        setCourses(coursesRes.courses ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [contentType])

  useEffect(() => {
    if (!tabContainerRef.current) return
    const buttons = tabContainerRef.current.querySelectorAll('[data-tab-btn]')
    const idx = tabs.findIndex(tab => tab.id === activeTab)
    const btn = buttons[idx]
    if (btn) {
      setIndicatorLeft(btn.offsetLeft)
      setIndicatorWidth(btn.offsetWidth)
      setIndicatorReady(true)
    }
  }, [activeTab, loading])

  const handleTabChange = (newTabId) => {
    if (newTabId === activeTab) return
    setIndicatorDuration(220)
    setActiveTab(newTabId)
    router.replace(`/content/${contentType}?tab=${newTabId}`, { scroll: false })
  }

  // Map lesson IDs from courses → flat lookup
  const lessonMap = {}
  for (const course of courses) {
    for (const lesson of course.lessons ?? []) {
      lessonMap[lesson.id] = lesson
    }
  }

  // Build ordered lesson list from group lessonIds
  const lessons = (categoryConfig?.groups ?? [])
    .filter(g => g.lessonId && lessonMap[g.lessonId])
    .map(g => ({
      ...lessonMap[g.lessonId],
      groupName: g.name,
      groupChars: (groupData[g.id] || []).map(item => item.native).filter(Boolean).join(''),
    }))

  const categoryName = categoryConfig?.name || categoryConfig?.native_name || ''

  if (loading) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={t('loading')} /></AppHeader>
      <AppContent><div className="card" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('loading')}</div></AppContent>
    </AppLayout>
  )

  if (error || !categoryConfig) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={t('error')} /></AppHeader>
      <AppContent><div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{t('error')}: {error}</div></AppContent>
    </AppLayout>
  )

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={categoryName} /></AppHeader>

      <AppContent>
        {activeTab === 'learn' && (
          <div className="space-y-4 fade-in">
            {lessons.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
                {t('category.noLessons')}
              </div>
            ) : lessons.map((lesson, i) => (
              <Card key={lesson.id} interactive onClick={() => router.push(`/learn/${lesson.slug}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '50%', background: 'linear-gradient(135deg,#ec4899,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', boxShadow: '0 3px 10px rgba(236,72,153,0.35)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{lesson.title}</div>
                    {lesson.description && (
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '2px', letterSpacing: '0.1em' }}>
                        {lesson.description}
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', flexShrink: 0 }}>›</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-4 fade-in">
            {categoryConfig.showAllOption && (() => {
              const allItems = Object.values(groupData).flat()
              const allProgress = computeGroupProgress(allItems, progress)
              return (
                <Card interactive onClick={() => router.push(`/content/${contentType}/all`)}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{t('groups.all')}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                          {allItems.length} {t('groups.all.sub')}
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}>{allProgress}%</span>
                    </div>
                    <ProgressBar value={allProgress} />
                  </div>
                </Card>
              )
            })()}

            {categoryConfig.groups.map(group => {
              const items = groupData[group.id] || []
              const groupProgress = computeGroupProgress(items, progress)
              return (
                <Card key={group.id} interactive onClick={() => router.push(`/content/${contentType}/${group.id}`)}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{group.name || group.id}</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                          {items.length} {t('groups.chars.short')}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}>{groupProgress}%</span>
                    </div>
                    <ProgressBar value={groupProgress} />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div ref={tabContainerRef} style={{ position: 'relative', display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
          {indicatorReady && (
            <div style={{ position: 'absolute', top: '4px', bottom: '4px', left: `${indicatorLeft}px`, width: `${indicatorWidth}px`, background: 'linear-gradient(135deg, #ec4899, #a855f7)', borderRadius: '100px', boxShadow: '0 4px 12px rgba(236,72,153,0.35)', transition: `left ${indicatorDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, pointerEvents: 'none', zIndex: 0 }} />
          )}
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} data-tab-btn onClick={() => handleTabChange(tab.id)}
                style={{ position: 'relative', zIndex: 1, flex: 1, padding: '10px 4px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: 'transparent', color: isActive ? 'white' : 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s ease' }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
