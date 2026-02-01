import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout, AppHeader, AppContent, AppFooter, Card, Button } from '../components/Layout'

export default function GameScreen() {
  const { contentType, groupId, modeId } = useParams()
  const navigate = useNavigate()

  const modeNames = {
    swipe: 'Swipe Game',
    multiChoice: 'Multiple Choice',
    flashcard: 'Flashcard',
    typing: 'Typing Challenge',
  }

  const modeEmojis = {
    swipe: '👆',
    multiChoice: '🎯',
    flashcard: '🃏',
    typing: '⌨️',
  }

  return (
    <AppLayout>
      <AppHeader onBack={() => navigate(-1)}>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{modeNames[modeId]}</h1>
          <p className="text-xs text-slate-300">Score: 0 / 15</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-all text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </AppHeader>

      <AppContent>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-[var(--spacing-5)]">{modeEmojis[modeId]}</div>
            <h2 className="text-2xl font-bold text-[var(--md-on-surface)] mb-[var(--spacing-2)]">Wird geladen...</h2>
            <p className="text-base text-[var(--md-on-surface-variant)]">
              {modeNames[modeId]} wird vorbereitet
            </p>
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <div className="w-full flex items-center gap-[var(--spacing-3)]">
          <button className="flex-1 py-[var(--spacing-3)] bg-[var(--md-surface-variant)] text-[var(--md-on-surface)] font-medium rounded-[var(--radius-lg)] hover:bg-slate-200 transition-all active:scale-95 text-base">
            Info
          </button>
          <Button
            variant="filled"
            className="flex-1"
          >
            Start Game
          </Button>
        </div>
      </AppFooter>
    </AppLayout>
  )
}
