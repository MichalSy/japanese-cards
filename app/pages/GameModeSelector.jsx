import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig, fetchGameModes } from '../config/api'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export function meta() {
  return [{ title: "Japanese Cards" }];
}

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()
  const [cardCount, setCardCount] = useState(20)
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [gameModeConfig, setGameModeConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [catConfig, gameModes] = await Promise.all([
          fetchCategoryConfig(contentType),
          fetchGameModes()
        ])
        setCategoryConfig(catConfig)
        setGameModeConfig(gameModes)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load configs:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [contentType])

  // Build map of game modes from config
  const gameModeMap = {}
  if (gameModeConfig?.gameModes) {
    gameModeConfig.gameModes.forEach(mode => {
      gameModeMap[mode.id] = mode
    })
  }

  // Filter game modes: available in category config AND enabled in global config
  const availableGameModes = categoryConfig?.gameModes || []
  const gameModes = availableGameModes
    .map(modeId => gameModeMap[modeId])
    .filter(mode => mode && mode.enabled) // Filter out disabled modes

  const groupName = categoryConfig?.groups?.find(g => g.id === groupId)?.name || 'Gruppe'

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

  if (error || !categoryConfig || !gameModeConfig) {
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
        <AppHeaderBar title={groupName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6 fade-in">
          {/* Card Count Selector */}
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-light)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--color-text-primary)', fontWeight: '500' }}>
              <span>Kartenanzahl:</span>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  backgroundColor: 'var(--color-surface-light)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-surface-dark)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="all">Alle</option>
              </select>
            </label>
          </div>

          <div className="grid-1">
            {gameModes.map((mode) => (
              <Card key={mode.id} interactive onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}?cards=${cardCount}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                  <span style={{ fontSize: '32px', flexShrink: 0 }}>{mode.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{mode.name}</h3>
                    <p className="text-sm text-tertiary" style={{ margin: 'var(--spacing-1) 0 0 0' }}>{mode.description}</p>
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
