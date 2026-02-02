import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig, fetchGameModes } from '../config/api'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [gameModeConfig, setGameModeConfig] = useState(null)
  const [cardCount, setCardCount] = useState(20)

  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const [categoryData, gameModeData] = await Promise.all([
          fetchCategoryConfig(contentType),
          fetchGameModes()
        ])
        setCategoryConfig(categoryData)
        setGameModeConfig(gameModeData)
      } catch (err) {
        console.error('Failed to load configs:', err)
      }
    }

    loadConfigs()
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

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={groupName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6">
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
