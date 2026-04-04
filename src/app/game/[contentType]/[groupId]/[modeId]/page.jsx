'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent } from '@/components/Layout'

const SwipeGame = dynamic(() => import('@/modes/swipe/SwipeGame'), { ssr: false })
const SwipeGamePro = dynamic(() => import('@/modes/swipe/SwipeGamePro'), { ssr: false })

const GAME_MODES = {
  swipe: SwipeGame,
  swipePro: SwipeGamePro,
  multiChoice: null,
  flashcard: null,
  typing: null,
}

const FULLSCREEN_MODES = ['swipePro']

const modeNames = {
  swipe: 'Swipe Game',
  swipePro: 'Swipe Pro ✨',
  multiChoice: 'Multiple Choice',
  flashcard: 'Flashcard',
  typing: 'Typing Challenge',
}

const modeEmojis = {
  swipe: '👆',
  swipePro: '🌟',
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
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
            Dieser Modus ist noch nicht verfügbar.
          </div>
        </AppContent>
      </AppLayout>
    )
  }

  if (isFullscreen) {
    return (
      <Suspense
        fallback={
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', backgroundColor: '#0f172a', color: 'white',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>{modeEmojis[modeId]}</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Wird geladen...</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                {modeNames[modeId]} wird vorbereitet
              </p>
            </div>
          </div>
        }
      >
        <GameComponent contentType={contentType} groupId={groupId} cardCount={cardCount} />
      </Suspense>
    )
  }

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={modeNames[modeId]} />
      </AppHeader>

      <Suspense
        fallback={
          <AppContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: 'var(--spacing-5)' }}>{modeEmojis[modeId]}</div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', margin: '0 0 var(--spacing-2) 0' }}>Wird geladen...</h2>
                <p className="text-base text-secondary" style={{ margin: '0 0 var(--spacing-3) 0' }}>
                  {modeNames[modeId]} wird vorbereitet
                </p>
                <p className="text-sm text-tertiary" style={{ margin: 0 }}>
                  Karten: {cardCount === 'all' ? 'Alle' : cardCount}
                </p>
              </div>
            </div>
          </AppContent>
        }
      >
        <GameComponent contentType={contentType} groupId={groupId} cardCount={cardCount} />
      </Suspense>
    </AppLayout>
  )
}
