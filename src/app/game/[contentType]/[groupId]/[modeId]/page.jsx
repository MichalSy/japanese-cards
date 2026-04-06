'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader } from '@/components/Layout'

const SwipeGame = dynamic(() => import('@/modes/swipe/SwipeGamePro'), { ssr: false })

const GAME_MODES = {
  swipe: SwipeGame,
  multiChoice: null,
  flashcard: null,
  typing: null,
}

const modeNames = {
  swipe: 'Swipe Game',
  multiChoice: 'Multiple Choice',
  flashcard: 'Flashcard',
  typing: 'Typing Challenge',
}

export default function GameScreen({ params }) {
  const { contentType, groupId, modeId } = params
  const searchParams = useSearchParams()
  const cardCount = searchParams.get('cards') || 20

  const GameComponent = GAME_MODES[modeId]

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={modeNames[modeId] || modeId} />
      </AppHeader>

      {!GameComponent ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Dieser Modus ist noch nicht verfügbar.
          </div>
        </div>
      ) : (
        <Suspense fallback={
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px' }}>{modeNames[modeId]} wird geladen...</p>
            </div>
          </div>
        }>
          <GameComponent contentType={contentType} groupId={groupId} cardCount={cardCount} />
        </Suspense>
      )}
    </AppLayout>
  )
}
