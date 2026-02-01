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
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>{modeNames[modeId]}</h1>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>Score: 0 / 15</p>
        </div>
        <button
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>{modeEmojis[modeId]}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>Wird geladen...</h2>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              {modeNames[modeId]} wird vorbereitet
            </p>
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#f3f4f6',
              color: '#1f2937'
            }}
          >
            Info
          </button>
          <Button>Start Game</Button>
        </div>
      </AppFooter>
    </AppLayout>
  )
}
