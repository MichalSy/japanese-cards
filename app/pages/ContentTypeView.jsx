import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig } from '../config/api'
import { useLanguage } from '../context/LanguageContext'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export function meta() {
  return [{ title: "Japanese Cards" }];
}

export default function ContentTypeView() {
  const { contentType } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const config = await fetchCategoryConfig(contentType)
        setCategoryConfig(config)
      } catch (err) {
        setError(err.message)
        console.error(`Failed to load category config for ${contentType}:`, err)
      } finally {
        setLoading(false)
      }
    })()
  }, [contentType])

  const getLabel = (obj, key) => {
    if (!obj) return ''
    const fieldKey = language === 'de' ? `${key}De` : `${key}En`
    return obj[fieldKey] || obj[key] || ''
  }

  const categoryName = categoryConfig ? (getLabel(categoryConfig, 'name') || categoryConfig.name) : ''

  if (loading) {
    return (
      <AppLayout>
        <AppHeader>
          <AppHeaderBar title="Laden..." />
        </AppHeader>
        <AppContent>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>Laden...</div>
        </AppContent>
      </AppLayout>
    )
  }

  if (error || !categoryConfig) {
    return (
      <AppLayout>
        <AppHeader>
          <AppHeaderBar title="Fehler" />
        </AppHeader>
        <AppContent>
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
            Fehler: {error || 'Konfiguration nicht geladen'}
          </div>
        </AppContent>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={categoryName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6 fade-in">
          {/* Statistics Card */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h3 className="text-sm font-medium text-primary">Deine Statistik</h3>
              <div className="grid-2">
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Korrekt</p>
                  <p className="text-2xl font-bold" style={{ color: '#10b981', margin: 0 }}>—</p>
                </div>
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Genauigkeit</p>
                  <p className="text-2xl font-bold" style={{ color: '#3b82f6', margin: 0 }}>—</p>
                </div>
              </div>
            </div>
          </Card>

          {categoryConfig.showAllOption && (
            <Card interactive onClick={() => navigate(`/content/${contentType}/all`)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                      {language === 'de' ? 'Alle kombiniert' : 'All Combined'}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-1) 0 0 0' }}>
                      {categoryConfig.groups.length} {language === 'de' ? 'Gruppen' : 'groups'}
                    </p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>0%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
                  <div style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, height: '8px', borderRadius: '9999px', width: '0%' }}></div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid-1">
            {categoryConfig.groups.map((group) => (
              <Card key={group.id} interactive onClick={() => navigate(`/content/${contentType}/${group.id}`)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                        {group.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>0%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
                    <div style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, height: '8px', borderRadius: '9999px', width: '0%' }}></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <button
          onClick={() => navigate(`/content/${contentType}/${categoryConfig.groups[0].id}`)}
          style={{
            flex: 1,
            padding: 'var(--spacing-3) var(--spacing-4)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)'
          }}
        >
          {language === 'de' ? 'Spielen' : 'Play'} →
        </button>
      </AppFooter>
    </AppLayout>
  )
}
