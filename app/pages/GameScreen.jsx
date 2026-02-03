import { useParams, useSearchParams } from 'react-router'
import { lazy, Suspense } from 'react'
import AppHeaderBar from '../components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent } from '../components/Layout'

// Lazy load game modes
const SwipeGame = lazy(() => import('../modes/swipe/SwipeGame'))
const SwipeGamePro = lazy(() => import('../modes/swipe/SwipeGamePro'))

const GAME_MODES = {
  swipe: SwipeGame,
  swipePro: SwipeGamePro,
  multiChoice: null, // TODO
  flashcard: null, // TODO
  typing: null, // TODO
}

// Modes that handle their own layout (fullscreen)
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

export function meta({ params }) {
  const { modeId } = params;
  return [
    { title: `${modeNames[modeId] || 'Game'} - Japanese Cards` },
  ];
}

export default function GameScreen() {
  const { contentType, groupId, modeId } = useParams()
  const [searchParams] = useSearchParams()
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

  // Fullscreen modes handle their own layout
  if (isFullscreen) {
    return (
      <Suspense
        fallback={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            backgroundColor: '#0f172a',
            color: 'white',
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

  // Standard modes use AppLayout
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
