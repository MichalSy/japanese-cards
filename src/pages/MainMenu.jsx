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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Japanese Cards</h1>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>Learn Japanese</p>
        </div>
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: 0 }}>Kategorien</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card
                    key={type.id}
                    interactive
                    onClick={() => navigate(`/content/${type.id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '50%', flexShrink: 0 }}>
                        <Icon size={24} style={{ color: '#374151', strokeWidth: '2px' }} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 style={{ fontWeight: '500', color: '#1f2937', fontSize: '16px', margin: 0 }}>{type.name}</h3>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{type.desc}</p>
                      </div>
                      <span style={{ color: '#9ca3af' }}>→</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: 0 }}>Dein Fortschritt</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {contentTypes.map((type) => (
                <Card key={type.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{type.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#ec4899' }}>42%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                      <div style={{ background: 'linear-gradient(to right, #ec4899, #a855f7)', height: '8px', borderRadius: '9999px', width: '42%' }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: 0 }}>Statistiken</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Tage aktiv</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#ec4899', margin: 0 }}>12</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Punkte</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>1.2K</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Genauigkeit</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>89%</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 8px 0' }}>Streak</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>7</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'transparent',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280'
              }}
            >
              <span style={{ fontSize: '24px' }}>{tab.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
