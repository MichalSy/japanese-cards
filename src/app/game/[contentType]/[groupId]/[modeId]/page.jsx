'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent } from '@/components/Layout'

const SwipeGame = dynamic(() => import('@/modes/swipe/SwipeGamePro'), { ssr: false })

const GAME_MODES = {
  swipe: SwipeGame,
  multiChoice: null,
  flashcard: null,
  typing: null,
}

const FULLSCREEN_MODES = ['swipe']

const modeNames = {
  swipe: 'Swipe Game',
  multiChoice: 'Multiple Choice',
  flashcard: 'Flashcard',
  typing: 'Typing Challenge',
}

const modeEmojis = {
  swipe: '🃏',
  multiChoice: '🎯',
  flashcard: '🃏',
  typing: '⌨️',
}

export default function GameScreen({ params }) {
  const { contentType, groupId, modeId } = params
  const searchParams = useSearchParams()
  const cardCount = searchParams.get('cards') || 20

  const GameComponent = GAME_MODES[modeId]
  const isFullscreen = FULLSCREEN_MODES.includes(modeId)

  if (!GameComponent) {
    return (
      <AppLayout>
        <AppHeader>
          <AppHeaderBar title={modeNames[modeId] || 'Unbekannter Modus'} />
        </AppHeader>
        <AppContent>
          <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Dieser Modus ist noch nicht verfügbar.
          </div>
        </AppContent>
      </AppLayout>
    )
  }

  if (isFullscreen) {
    return (
      <Suspense fallback={
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh',
          background: 'radial-gradient(circle at 15% 10%, rgba(236,72,153,0.4) 0%, transparent 50%), radial-gradient(circle at 85% 95%, rgba(236,72,153,0.3) 0%, transparent 50%), linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 25%, #0f172a 50%, #0d1e3f 100%)',
          color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', system-ui, sans-serif",
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{modeEmojis[modeId]}</div>
            <p style={{ fontSize: '16px' }}>{modeNames[modeId]} wird geladen...</p>
          </div>
        </div>
      }>
        <GameComponent contentType={contentType} groupId={groupId} cardCount={cardCount} />
      </Suspense>
    )
  }

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={modeNames[modeId]} />
      </AppHeader>
      <Suspense fallback={
        <AppContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{modeEmojis[modeId]}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>{modeNames[modeId]} wird geladen...</p>
            </div>
          </div>
        </AppContent>
      }>
        <GameComponent contentType={contentType} groupId={groupId} cardCount={cardCount} />
      </Suspense>
    </AppLayout>
  )
}
