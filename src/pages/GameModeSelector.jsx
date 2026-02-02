import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig } from '../config/api'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()
  const [categoryConfig, setCategoryConfig] = useState(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchCategoryConfig(contentType)
        setCategoryConfig(config)
      } catch (err) {
        console.error('Failed to load category config:', err)
      }
    }

    loadConfig()
  }, [contentType])

  const allGameModes = {
    swipe: { name: 'Swipe Game', emoji: '👆', desc: 'Wische links/rechts' },
    multiChoice: { name: 'Multiple Choice', emoji: '🎯', desc: 'Wähle die richtige Antwort' },
    flashcard: { name: 'Flashcard', emoji: '🃏', desc: 'Karte umdrehen' },
    typing: { name: 'Typing Challenge', emoji: '⌨️', desc: 'Tippe Romaji' },
  }

  // Filter game modes based on category config
  const availableGameModes = categoryConfig?.gameModes || []
  const gameModes = availableGameModes.map(modeId => ({
    id: modeId,
    ...allGameModes[modeId]
  })).filter(mode => mode.name) // Filter out invalid modes

  const groupName = categoryConfig?.groups?.find(g => g.id === groupId)?.name || 'Gruppe'

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={groupName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6">
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h3 className="text-sm font-medium text-primary">Deine Statistik</h3>
              <div className="grid-2">
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Korrekt</p>
                  <p className="text-2xl font-bold" style={{ color: '#10b981', margin: 0 }}>14/15</p>
                </div>
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Genauigkeit</p>
                  <p className="text-2xl font-bold" style={{ color: '#3b82f6', margin: 0 }}>93%</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid-1">
            {gameModes.map((mode) => (
              <Card key={mode.id} interactive onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                  <span style={{ fontSize: '32px', flexShrink: 0 }}>{mode.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{mode.name}</h3>
                    <p className="text-sm text-tertiary" style={{ margin: 'var(--spacing-1) 0 0 0' }}>{mode.desc}</p>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <p className="text-sm text-tertiary" style={{ width: '100%', textAlign: 'center', margin: 0 }}>
          Wähle einen Modus zum Spielen
        </p>
      </AppFooter>
    </AppLayout>
  )
}
