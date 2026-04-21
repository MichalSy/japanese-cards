'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategoryConfig, fetchGameModes } from '@/config/api'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

function ModeIcon({ id }) {
  const s = { width: 28, height: 28, strokeWidth: 1.8, fill: 'none', stroke: '#ec4899', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (id === 'learn') return <svg viewBox="0 0 24 24" {...s}><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M2 16l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  if (id === 'swipe') return <svg viewBox="0 0 24 24" {...s}><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M2 12 L5 9M2 12 L5 15" stroke="rgba(168,85,247,0.9)"/><path d="M22 12 L19 9M22 12 L19 15" stroke="rgba(168,85,247,0.9)"/></svg>
  if (id === 'multiChoice') return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
  if (id === 'flashcard') return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 19h8"/><path d="M12 17v2"/></svg>
  if (id === 'typing') return <svg viewBox="0 0 24 24" {...s}><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>
  return <span style={{ fontSize: '26px' }}>{id}</span>
}

export default function GameModeSelector({ params }) {
  const { contentType, groupId } = params
  const router = useRouter()
  const t = useT()
  const [cardCount, setCardCount] = useState('all')
  const [categoryConfig, setCategoryConfig] = useState(null)
  const [gameModeConfig, setGameModeConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [catConfig, gameModes] = await Promise.all([fetchCategoryConfig(contentType), fetchGameModes()])
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
  if (gameModeConfig?.gameModes) gameModeConfig.gameModes.forEach(mode => { gameModeMap[mode.id] = mode })

  // Per-group game_modes override, else fall back to category-level
  const group = categoryConfig?.groups?.find(g => g.id === groupId)
  const availableModeIds = group?.gameModes ?? categoryConfig?.gameModes ?? []

  // For "learn" mode: collect lessonIds — for "all" group, gather from all groups that have one
  const lessonIds = groupId === 'all'
    ? (categoryConfig?.groups ?? []).filter(g => g.lessonId).map(g => g.lessonId)
    : group?.lessonId ? [group.lessonId] : []

  // Inject "learn" mode if there are lessons available, even if not in gameModes list
  const modeIds = lessonIds.length > 0 && !availableModeIds.includes('learn')
    ? ['learn', ...availableModeIds]
    : availableModeIds

  const gameModes = modeIds.map(id => gameModeMap[id]).filter(m => m?.enabled)

  const groupName = t(`groups.${groupId}`, group?.name ?? groupId)

  const handleModeClick = (modeId) => {
    if (modeId === 'learn') {
      if (lessonIds.length === 1) {
        router.push(`/learn/${lessonIds[0]}`)
      } else if (lessonIds.length > 1) {
        router.push(`/learn/chain?lessons=${lessonIds.join(',')}`)
      }
      return
    }
    router.push(`/game/${contentType}/${groupId}/${modeId}?cards=${cardCount}`)
  }

  if (loading) return <AppLayout><AppHeader><AppHeaderBar title={t('loading')} /></AppHeader><AppContent><div className="card" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('loading')}</div></AppContent></AppLayout>
  if (error || !categoryConfig || !gameModeConfig) return <AppLayout><AppHeader><AppHeaderBar title={t('error')} /></AppHeader><AppContent><div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{t('error')}: {error}</div></AppContent></AppLayout>

  const countOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 'all', label: t('game.all') },
  ]

  const hasNonLearnModes = gameModes.some(m => m.id !== 'learn')

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={groupName} /></AppHeader>
      <AppContent>
        <div className="space-y-6 fade-in">
          {hasNonLearnModes && (
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('game.cardCount')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {countOptions.map(({ value, label }) => (
                    <button key={value} onClick={() => setCardCount(value)}
                      style={{ flex: 1, padding: '10px 4px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s', background: cardCount === value ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(255,255,255,0.06)', color: cardCount === value ? 'white' : 'rgba(255,255,255,0.5)', boxShadow: cardCount === value ? '0 4px 12px rgba(236,72,153,0.35)' : 'none' }}
                    >{label}</button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              {t('game.selectMode')}
            </div>
            <div className="grid-1">
              {gameModes.map(mode => (
                <Card key={mode.id} interactive onClick={() => handleModeClick(mode.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mode.id === 'learn' ? 'rgba(168,85,247,0.12)' : 'rgba(236,72,153,0.12)', border: `1px solid ${mode.id === 'learn' ? 'rgba(168,85,247,0.2)' : 'rgba(236,72,153,0.2)'}`, borderRadius: '14px' }}>
                      <ModeIcon id={mode.id} />
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
          {t('game.chooseMode')}
        </p>
      </AppFooter>
    </AppLayout>
  )
}
