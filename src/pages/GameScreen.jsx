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
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{modeNames[modeId]}</h1>
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
