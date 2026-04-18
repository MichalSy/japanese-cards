'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig, fetchGroupData } from '@/config/api'
import { useLanguage } from '@/context/LanguageContext'
import { getCategoryStats, getGroupProgress } from '@/utils/progressStorage'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

export default function ContentTypeView({ params }) {
  const { contentType } = params
  const router = useRouter()
  const { language } = useLanguage()
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [groupData, setGroupData] = useState({})

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const config = await fetchCategoryConfig(contentType)
        setCategoryConfig(config)
        const categoryStats = getCategoryStats(contentType)
        setStats(categoryStats)
        const groups = {}
        for (const group of config.groups) {
          try {
            const data = await fetchGroupData(contentType, group.id)
            groups[group.id] = data.items || []
          } catch (e) { groups[group.id] = [] }
        }
        setGroupData(groups)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [contentType])

  const t = (obj, key) =>
    obj?.translations?.[language]?.[key] ?? obj?.translations?.en?.[key] ?? obj?.native_name ?? ''

  const categoryName = categoryConfig ? (t(categoryConfig, 'name') || categoryConfig.native_name || '') : ''

  if (loading) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title="Laden..." /></AppHeader>
      <AppContent><div className="card" style={{ color: 'rgba(255,255,255,0.5)' }}>Laden...</div></AppContent>
    </AppLayout>
  )

  if (error || !categoryConfig) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title="Fehler" /></AppHeader>
      <AppContent><div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Fehler: {error || 'Konfiguration nicht geladen'}</div></AppContent>
    </AppLayout>
  )

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={categoryName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6 fade-in">
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {language === 'de' ? 'Deine Statistik' : 'Your Stats'}
              </div>
              <div className="grid-2">
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 4px' }}>
                    {language === 'de' ? 'Gelernt' : 'Learned'}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', margin: 0 }}>{stats?.totalLearned || 0}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 4px' }}>
                    {language === 'de' ? 'Beherrscht' : 'Mastered'}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', margin: 0 }}>{stats?.mastered || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          {categoryConfig.showAllOption && (() => {
            const allItems = Object.values(groupData).flat()
            const allProgress = getGroupProgress(allItems, contentType)
            return (
              <Card interactive onClick={() => router.push(`/content/${contentType}/all`)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                        {language === 'de' ? '✨ Alle kombiniert' : '✨ All Combined'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                        {categoryConfig.groups.length} {language === 'de' ? 'Gruppen' : 'groups'}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#ec4899' }}>{allProgress}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', height: '6px', borderRadius: '9999px', width: `${allProgress}%`, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              </Card>
            )
          })()}

          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              {language === 'de' ? 'Gruppen' : 'Groups'}
            </div>
            <div className="grid-1">
              {categoryConfig.groups.map((group) => {
                const items = groupData[group.id] || []
                const groupProgress = getGroupProgress(items, contentType)
                return (
                  <Card key={group.id} interactive onClick={() => router.push(`/content/${contentType}/${group.id}`)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{t(group, 'name') || group.id}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}>{groupProgress}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', height: '6px', borderRadius: '9999px', width: `${groupProgress}%`, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <button
          onClick={() => router.push(`/content/${contentType}/${categoryConfig.groups[0].id}`)}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            color: 'white', border: 'none', borderRadius: '100px',
            fontWeight: '700', fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(236,72,153,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.35)' }}
        >
          {language === 'de' ? 'Spielen →' : 'Play →'}
        </button>
      </AppFooter>
    </AppLayout>
  )
}
