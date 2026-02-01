import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()

  const groupNames = {
    hiragana: {
      a: 'Hiragana - A-Reihe',
      ka: 'Hiragana - Ka-Reihe',
      sa: 'Hiragana - Sa-Reihe',
      ta: 'Hiragana - Ta-Reihe',
      na: 'Hiragana - Na-Reihe',
    },
  }

  const gameModes = [
    { id: 'swipe', name: 'Swipe Game', emoji: '👆', desc: 'Wische links/rechts' },
    { id: 'multiChoice', name: 'Multiple Choice', emoji: '🎯', desc: 'Wähle die richtige Antwort' },
    { id: 'flashcard', name: 'Flashcard', emoji: '🃏', desc: 'Karte umdrehen' },
    { id: 'typing', name: 'Typing Challenge', emoji: '⌨️', desc: 'Tippe Romaji' },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'

  return (
    <AppLayout>
      <AppHeader onBack={() => navigate(`/content/${contentType}`)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{groupName}</h1>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>Wähle einen Modus</p>
        </div>
      </AppHeader>

      <AppContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>Deine Statistik</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Korrekt</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>14/15</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Genauigkeit</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>93%</p>
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {gameModes.map((mode) => (
              <Card
                key={mode.id}
                interactive
                onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '32px', flexShrink: 0 }}>{mode.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 style={{ fontWeight: '500', color: '#1f2937', fontSize: '16px', margin: 0 }}>{mode.name}</h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{mode.desc}</p>
                  </div>
                  <span style={{ color: '#9ca3af' }}>→</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', width: '100%', margin: 0 }}>
          Wähle einen Modus zum Spielen
        </p>
      </AppFooter>
    </AppLayout>
  )
}
