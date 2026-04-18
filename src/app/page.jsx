'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategories } from '@/config/api'
import { useLanguage } from '@/context/LanguageContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

export default function MainMenu() {
  const router = useRouter()
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('start')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        setCategories(data.categories.filter(cat => cat.enabled !== false))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const tabs = [
    { id: 'start',    labelDe: 'Start',      labelEn: 'Start',    icon: '🎮' },
    { id: 'progress', labelDe: 'Fortschritt', labelEn: 'Progress', icon: '📊' },
    { id: 'stats',    labelDe: 'Statistiken', labelEn: 'Stats',    icon: '🏆' },
  ]

  const t = (obj, key) =>
    obj?.translations?.[language]?.[key] ?? obj?.translations?.en?.[key] ?? obj?.native_name ?? ''

  const getCategoryName = (category) => t(category, 'name') || category.native_name || category.id
  const getCategoryDescription = (category) => t(category, 'description')

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar />
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6 fade-in">
            <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language === 'de' ? 'Kategorien' : 'Categories'}
            </h2>

            {loading && (
              <div className="card" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Laden...</div>
            )}

            {error && (
              <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                Fehler: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid-1">
                {categories.map((type) => (
                  <Card key={type.id} interactive onClick={() => router.push(`/content/${type.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px', height: '56px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(236,72,153,0.15)',
                        border: '1px solid rgba(236,72,153,0.25)',
                        borderRadius: '16px', fontSize: '28px',
                      }}>
                        {type.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                          {getCategoryName(type)}
                        </div>
                        {getCategoryDescription(type) && (
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            {getCategoryDescription(type)}
                          </div>
                        )}
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
            <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language === 'de' ? 'Dein Fortschritt' : 'Your Progress'}
            </h2>
            <div className="grid-1">
              {categories.map((type) => (
                <Card key={type.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{getCategoryName(type)}</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}>42%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', height: '6px', borderRadius: '9999px', width: '42%' }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 fade-in">
            <h2 style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language === 'de' ? 'Statistiken' : 'Statistics'}
            </h2>
            <div className="grid-2">
              {[
                { labelDe: 'Tage aktiv', labelEn: 'Days active', value: '12', color: '#ec4899' },
                { labelDe: 'Punkte',     labelEn: 'Points',      value: '1.2K', color: '#a855f7' },
                { labelDe: 'Genauigkeit',labelEn: 'Accuracy',    value: '89%', color: '#3b82f6' },
                { labelDe: 'Streak',     labelEn: 'Streak',      value: '7',   color: '#10b981' },
              ].map(({ labelDe, labelEn, value, color }) => (
                <Card key={labelDe}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 8px 0', fontWeight: '500' }}>
                      {language === 'de' ? labelDe : labelEn}
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0 }}>{value}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {tabs.map((tab) => {
            const label = language === 'de' ? tab.labelDe : tab.labelEn
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '2px', padding: '8px 4px', borderRadius: '100px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: isActive
                    ? 'linear-gradient(135deg, #ec4899, #a855f7)'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(236,72,153,0.35)' : 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: '600' }}>{label}</span>
              </button>
            )
          })}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
