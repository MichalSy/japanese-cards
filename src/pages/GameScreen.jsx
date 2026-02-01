import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout, AppHeader, AppContent, AppFooter, Button } from '../components/Layout'

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
        <div style={{ flex: 1 }}>
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{modeNames[modeId]}</h1>
          <p className="text-sm text-tertiary">Score: 0 / 15</p>
        </div>
        <button style={{ padding: 'var(--spacing-2)', backgroundColor: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </AppHeader>

      <AppContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: 'var(--spacing-5)' }}>{modeEmojis[modeId]}</div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', margin: '0 0 var(--spacing-2) 0' }}>Wird geladen...</h2>
            <p className="text-base text-secondary" style={{ margin: 0 }}>
              {modeNames[modeId]} wird vorbereitet
            </p>
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <div className="space-x-3" style={{ width: '100%' }}>
          <button style={{ flex: 1, padding: 'var(--spacing-3) var(--spacing-6)', borderRadius: 'var(--radius-lg)', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s ease', border: 'none', cursor: 'pointer', backgroundColor: 'var(--color-surface-light)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
            Info
          </button>
          <Button>Start Game</Button>
        </div>
      </AppFooter>
    </AppLayout>
  )
}
