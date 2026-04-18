'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategories } from '@/config/api'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

export default function MainMenu() {
  const router = useRouter()
  const t = useT()
  const [activeTab, setActiveTab] = useState('start')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [overview, setOverview] = useState([])
  const [chartDays, setChartDays] = useState(5)
  const [daily, setDaily] = useState([])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [catData, ovData, dailyData] = await Promise.all([
          fetchCategories(),
          fetch('/api/progress/overview').then(r => r.ok ? r.json() : { overview: [] }),
          fetch('/api/progress/daily?days=5').then(r => r.ok ? r.json() : { daily: [] }),
        ])
        setCategories(catData.categories.filter(cat => cat.enabled !== false))
        setOverview(ovData.overview ?? [])
        setDaily(dailyData.daily ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const tabs = [
    { id: 'start',    key: 'nav.start',    icon: '🎮' },
    { id: 'progress', key: 'nav.progress', icon: '📊' },
    { id: 'stats',    key: 'nav.stats',    icon: '🏆' },
  ]

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar /></AppHeader>
      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6 fade-in">
            <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('nav.categories')}
            </h2>
            {loading && <div className="card" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>{t('loading')}</div>}
            {error && <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{t('error')}: {error}</div>}
            {!loading && !error && (
              <div className="grid-1">
                {categories.map(type => (
                  <Card key={type.id} interactive onClick={() => router.push(`/content/${type.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '16px', fontSize: '28px' }}>
                        {type.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{type.name || type.native_name}</div>
                        {type.description && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{type.description}</div>}
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>›</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6 fade-in">
            <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('nav.progress')}</h2>
            {overview.length === 0 && !loading && (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>{t('stats.noProgress')}</div>
            )}
            <div className="grid-1">
              {categories.map(cat => {
                const stat = overview.find(o => o.category_slug === cat.id)
                const total = Number(stat?.total ?? 0)
                const mastered = Number(stat?.mastered ?? 0)
                const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
                return (
                  <Card key={cat.id} interactive onClick={() => router.push(`/content/${cat.id}`)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{cat.name || cat.native_name}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '8px' }}>{mastered} {t('progress.of')} {total}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', height: '6px', borderRadius: '9999px', width: `${pct}%`, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (() => {
          const totalMastered = overview.reduce((s, o) => s + Number(o.mastered ?? 0), 0)
          const totalSeen = overview.reduce((s, o) => s + Number(o.seen ?? 0), 0)
          const totalCards = overview.reduce((s, o) => s + Number(o.total ?? 0), 0)
          const accuracy = totalSeen > 0 ? Math.round((totalMastered / totalSeen) * 100) : 0
          const maxCount = Math.max(...daily.map(d => d.mastered ?? 0), 1)
          const fmt = (iso) => {
            const d = new Date(iso)
            return chartDays <= 5
              ? d.toLocaleDateString(undefined, { weekday: 'short' })
              : `${d.getDate()}.${d.getMonth() + 1}.`
          }
          return (
            <div className="space-y-6 fade-in">
              <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('nav.stats')}</h2>

              <div className="grid-2">
                {[
                  { label: t('stats.mastered'), value: totalMastered, color: '#10b981' },
                  { label: t('stats.learned'), value: totalSeen, color: '#3b82f6' },
                  { label: t('stats.totalMastered'), value: `${accuracy}%`, color: '#ec4899' },
                  { label: t('stats.totalSeen'), value: totalCards, color: '#a855f7' },
                ].map(({ label, value, color }) => (
                  <Card key={label}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 8px', fontWeight: '500' }}>{label}</p>
                      <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0 }}>{value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>{t('stats.chartTitle')}</span>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '3px' }}>
                      {[5, 30].map(d => (
                        <button key={d} onClick={() => {
                          setChartDays(d)
                          fetch(`/api/progress/daily?days=${d}`).then(r => r.ok ? r.json() : null).then(data => { if (data) setDaily(data.daily ?? []) })
                        }} style={{ padding: '4px 10px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: chartDays === d ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'transparent', color: chartDays === d ? 'white' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}>
                          {d === 5 ? t('stats.days5') : t('stats.days30')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {daily.every(d => d.mastered === 0 && !d.active) ? (
                    <p style={{ margin: 0, textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', padding: '16px 0' }}>{t('stats.noChart')}</p>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: chartDays <= 5 ? '8px' : '3px', height: '110px' }}>
                      {daily.map(({ date, mastered: m, active: isActive }) => (
                        <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: m > 0 ? 'rgba(255,255,255,0.8)' : 'transparent' }}>{m || ''}</span>
                          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: m > 0 ? 'linear-gradient(180deg,#a855f7,#ec4899)' : isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', height: `${Math.max((m / maxCount) * 72, m > 0 ? 8 : isActive ? 4 : 3)}px`, transition: 'height 0.4s ease' }} />
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#10b981' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                          <span style={{ fontSize: chartDays <= 5 ? '11px' : '9px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{fmt(date)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )
        })()}
      </AppContent>

      <AppFooter>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '8px 4px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: isActive ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'transparent', boxShadow: isActive ? '0 4px 12px rgba(236,72,153,0.35)' : 'none', color: isActive ? 'white' : 'rgba(255,255,255,0.45)' }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: '600' }}>{t(tab.key)}</span>
              </button>
            )
          })}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
