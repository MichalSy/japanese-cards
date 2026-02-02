import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchCategories } from '../config/api'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')
  const [contentTypes, setContentTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        // Filter enabled categories
        const enabledCategories = data.categories.filter(cat => cat.enabled !== false)
        setContentTypes(enabledCategories)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Fortschritt', icon: '📊' },
    { id: 'stats', label: 'Statistiken', icon: '🏆' },
  ]

  // Get display name based on category type
  const getDisplayName = (category) => {
    if (category.type === 'characters') {
      // For characters, only show Japanese name
      return category.name
    }
    // For others, show German name with English subtitle
    return category.nameDe || category.name
  }

  return (
    <AppLayout>
      <AppHeader>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>Japanese Cards</h1>
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">Kategorien</h2>
            
            {loading && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                Lade Kategorien...
              </div>
            )}

            {error && (
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
                Fehler beim Laden: {error}
              </div>
            )}

            {!loading && !error && contentTypes.length > 0 && (
              <div className="grid-1">
                {contentTypes.map((type) => (
                  <Card key={type.id} interactive onClick={() => navigate(`/content/${type.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                      <div 
                        style={{ 
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'var(--color-surface-light)', 
                          borderRadius: '50%',
                          flexShrink: 0,
                          fontSize: '32px'
                        }}
                      >
                        {type.emoji}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                          {getDisplayName(type)}
                        </h3>
                      </div>
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: '20px' }}>→</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">Dein Fortschritt</h2>
            <div className="grid-1">
              {contentTypes.map((type) => (
                <Card key={type.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-sm font-medium text-primary">{getDisplayName(type)}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>42%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
                      <div style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, height: '8px', borderRadius: '9999px', width: '42%' }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">Statistiken</h2>
            <div className="grid-2">
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>Tage aktiv</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)', margin: 0 }}>12</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>Punkte</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)', margin: 0 }}>1.2K</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>Genauigkeit</p>
                  <p className="text-3xl font-bold" style={{ color: '#3b82f6', margin: 0 }}>89%</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>Streak</p>
                  <p className="text-3xl font-bold" style={{ color: '#10b981', margin: 0 }}>7</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div style={{ width: '100%', display: 'flex', gap: 0, height: '100%', alignItems: 'stretch' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-1)',
                padding: '0',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` : 'transparent',
                background: activeTab === tab.id ? `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--color-text-tertiary)'
              }}
            >
              <span style={{ fontSize: '24px' }}>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
