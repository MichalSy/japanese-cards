import { useNavigate, useLoaderData } from 'react-router'
import { useState } from 'react'
import { fetchCategories } from '../config/api'
import { useLanguage } from '../context/LanguageContext'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export async function loader() {
  const data = await fetchCategories()
  return {
    categories: data.categories.filter(cat => cat.enabled !== false)
  }
}

export function meta() {
  return [
    { title: "Japanese Cards" },
    { name: "description", content: "Learn Japanese scripts playfully." },
  ];
}

export default function MainMenu() {
  const navigate = useNavigate()
  const { categories } = useLoaderData()
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('start')

  const tabs = [
    { id: 'start', labelDe: 'Start', labelEn: 'Start', icon: '🎮' },
    { id: 'progress', labelDe: 'Fortschritt', labelEn: 'Progress', icon: '📊' },
    { id: 'stats', labelDe: 'Statistiken', labelEn: 'Stats', icon: '🏆' },
  ]

  const getLabel = (obj, key) => {
    const fieldKey = language === 'de' ? `${key}De` : `${key}En`
    return obj[fieldKey] || obj[key]
  }

  const getCategoryName = (category) => {
    return getLabel(category, 'name') || category.name
  }

  const getCategoryDescription = (category) => {
    return getLabel(category, 'description')
  }

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar />
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">
              {language === 'de' ? 'Kategorien' : 'Categories'}
            </h2>
            
            <div className="grid-1 fade-in">
              {categories.map((type) => (
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
                        {getCategoryName(type)}
                      </h3>
                      {getCategoryDescription(type) && (
                        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)', margin: 'var(--spacing-1) 0 0 0' }}>
                          {getCategoryDescription(type)}
                        </p>
                      )}
                    </div>
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: '20px' }}>→</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">
              {language === 'de' ? 'Dein Fortschritt' : 'Your Progress'}
            </h2>
            <div className="grid-1">
              {categories.map((type) => (
                <Card key={type.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-sm font-medium text-primary">{getCategoryName(type)}</span>
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
            <h2 className="text-base font-medium text-primary">
              {language === 'de' ? 'Statistiken' : 'Statistics'}
            </h2>
            <div className="grid-2">
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>
                    {language === 'de' ? 'Tage aktiv' : 'Days active'}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)', margin: 0 }}>12</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>
                    {language === 'de' ? 'Punkte' : 'Points'}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)', margin: 0 }}>1.2K</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>
                    {language === 'de' ? 'Genauigkeit' : 'Accuracy'}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#3b82f6', margin: 0 }}>89%</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-sm text-tertiary" style={{ margin: '0 0 var(--spacing-2) 0' }}>
                    {language === 'de' ? 'Streak' : 'Streak'}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#10b981', margin: 0 }}>7</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div style={{ width: '100%', display: 'flex', gap: 0, height: '100%', alignItems: 'stretch' }}>
          {tabs.map((tab) => {
            const label = language === 'de' ? tab.labelDe : tab.labelEn
            return (
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
                <span className="text-sm font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
