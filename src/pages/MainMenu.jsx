import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Target, Award } from 'lucide-react'
import { useState } from 'react'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', icon: BookOpen, desc: '日本語の基本文字' },
    { id: 'katakana', name: 'Katakana', icon: Target, desc: '外来語の文字' },
    { id: 'words', name: 'Wörter', icon: Zap, desc: 'Vokabeltraining' },
    { id: 'sentences', name: 'Sätze', icon: Award, desc: 'Satzstrukturen' },
  ]

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'stats', label: 'Stats', icon: '🏆' },
  ]

  return (
    <AppLayout>
      <AppHeader>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>Japanese Cards</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)', margin: 'var(--spacing-1) 0 0 0' }}>Learn Japanese</p>
        </div>
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-primary">Kategorien</h2>
            <div className="grid-1">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card key={type.id} interactive onClick={() => navigate(`/content/${type.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                      <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-light)', borderRadius: '50%', flexShrink: 0 }}>
                        <Icon size={24} style={{ color: 'var(--color-text-secondary)', strokeWidth: '2px' }} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{type.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)', margin: 'var(--spacing-1) 0 0 0' }}>{type.desc}</p>
                      </div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
                    </div>
                  </Card>
                )
              })}
            </div>
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
                      <span className="text-sm font-medium text-primary">{type.name}</span>
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
        <div className="space-x-3" style={{ width: '100%' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-lg)',
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
