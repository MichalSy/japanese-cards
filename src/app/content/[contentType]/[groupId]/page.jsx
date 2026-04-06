'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig, fetchGameModes } from '@/config/api'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

export default function GameModeSelector({ params }) {
  const { contentType, groupId } = params
  const router = useRouter()
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
      } finally {
        setLoading(false)
      }
    })()
  }, [contentType])

  const gameModeMap = {}
  if (gameModeConfig?.gameModes) {
    gameModeConfig.gameModes.forEach(mode => { gameModeMap[mode.id] = mode })
  }

  const availableGameModes = categoryConfig?.gameModes || []
  const gameModes = availableGameModes.map(modeId => gameModeMap[modeId]).filter(mode => mode && mode.enabled)
  const groupName = categoryConfig?.groups?.find(g => g.id === groupId)?.name || 'Gruppe'

  if (loading) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title="Laden..." /></AppHeader>
      <AppContent><div className="card" style={{ color: 'rgba(255,255,255,0.5)' }}>Laden...</div></AppContent>
    </AppLayout>
  )

  if (error || !categoryConfig || !gameModeConfig) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title="Fehler" /></AppHeader>
      <AppContent><div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Fehler: {error || 'Konfiguration nicht geladen'}</div></AppContent>
    </AppLayout>
  )

  const countOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 'all', label: 'Alle' },
  ]

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={groupName} />
      </AppHeader>

      <AppContent>
        <div className="space-y-6 fade-in">
          {/* Card count selector */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Kartenanzahl
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {countOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setCardCount(value)}
                    style={{
                      flex: 1, padding: '10px 4px',
                      borderRadius: '12px', border: 'none', cursor: 'pointer',
                      fontSize: '14px', fontWeight: '700',
                      transition: 'all 0.2s',
                      background: cardCount === value
                        ? 'linear-gradient(135deg, #ec4899, #a855f7)'
                        : 'rgba(255,255,255,0.06)',
                      color: cardCount === value ? 'white' : 'rgba(255,255,255,0.5)',
                      boxShadow: cardCount === value ? '0 4px 12px rgba(236,72,153,0.35)' : 'none',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>
          </Card>

          {/* Game modes */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Spielmodus wählen
            </div>
            <div className="grid-1">
              {gameModes.map((mode) => (
                <Card key={mode.id} interactive onClick={() => router.push(`/game/${contentType}/${groupId}/${mode.id}?cards=${cardCount}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '52px', height: '52px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(236,72,153,0.12)',
                      border: '1px solid rgba(236,72,153,0.2)',
                      borderRadius: '14px', fontSize: '26px',
                    }}>
                      {mode.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '3px' }}>{mode.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{mode.description}</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <p style={{ width: '100%', textAlign: 'center', margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          Wähle einen Modus zum Spielen
        </p>
      </AppFooter>
    </AppLayout>
  )
}
