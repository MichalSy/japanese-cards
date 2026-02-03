import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { fetchGroupData, fetchAllItemsFromCategory } from '../../config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCard from './SwipeCard'
import { AppContent, AppFooter, Card } from '../../components/Layout'

export default function SwipeGame({ contentType, groupId, cardCount }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimeoutRef = useRef(null)

  const game = useSwipeGame(items, cardCount)
  
  // Wrap handleSwipe to show toast
  const handleSwipeWithToast = (isCorrect, direction, correctRomaji, character) => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
    
    // Set toast content and show it immediately
    const toastData = { isCorrect, correctRomaji, character, id: Date.now() }
    setToast(toastData)
    setToastVisible(true)
    
    // Hide after delay (fade out, then remove)
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false)
      toastTimeoutRef.current = setTimeout(() => setToast(null), 300)
    }, 1200)
    
    game.handleSwipe(isCorrect, direction)
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  // Load game data
  useEffect(() => {
    const loadData = async () => {
      try {
        let data
        if (groupId === 'all') {
          // Load all items from all groups in category
          data = await fetchAllItemsFromCategory(contentType)
        } else {
          // Load single group
          data = await fetchGroupData(contentType, groupId)
        }
        setItems(data.items || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to load game data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [contentType, groupId])

  if (loading) {
    return (
      <AppContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p style={{ color: 'var(--color-text-tertiary)' }}>Spiel wird vorbereitet...</p>
        </div>
      </AppContent>
    )
  }

  if (error) {
    return (
      <AppContent>
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
          Fehler: {error}
        </div>
      </AppContent>
    )
  }

  if (game.gameState === 'finished') {
    const total = game.stats.correct + game.stats.incorrect
    const percentage = total > 0 ? Math.round((game.stats.correct / total) * 100) : 0

    return (
      <AppContent>
        <div className="space-y-6">
          {/* Result Summary */}
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', margin: '0 0 var(--spacing-4) 0' }}>
                Spiel beendet! 🎉
              </h2>
              <div className="grid-2">
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Richtig</p>
                  <p className="text-3xl font-bold" style={{ color: '#10b981', margin: '0' }}>
                    {game.stats.correct}/{total}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-tertiary" style={{ margin: 0 }}>Prozentsatz</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)', margin: '0' }}>
                    {percentage}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Mistakes List */}
          {game.stats.mistakes.length > 0 && (
            <div>
              <h3 className="text-base font-medium text-primary" style={{ marginBottom: 'var(--spacing-3)' }}>
                Fehler ({game.stats.mistakes.length})
              </h3>
              <div className="space-y-3">
                {game.stats.mistakes.map((mistake, idx) => (
                  <Card key={idx}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      {/* Character */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                          {mistake.realCard?.character || mistake.realCard?.word || '?'}
                        </p>
                        <span style={{ fontSize: '24px' }}>❌</span>
                      </div>

                      {/* What was shown */}
                      <div style={{ padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-xs text-tertiary" style={{ margin: '0 0 var(--spacing-1) 0' }}>Gezeigt:</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                          {mistake.displayedCard?.romaji || '?'}
                        </p>
                      </div>

                      {/* Correct answer */}
                      <div style={{ padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid #10b981' }}>
                        <p className="text-xs text-tertiary" style={{ margin: '0 0 var(--spacing-1) 0' }}>Korrekt:</p>
                        <p className="text-sm font-medium" style={{ color: '#10b981', margin: 0 }}>
                          {mistake.realCard?.romaji || '?'}
                        </p>
                      </div>

                      {/* User action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        <span>Du: {mistake.userAction === 'right' ? '➡️ Richtig' : '⬅️ Falsch'}</span>
                        <span>•</span>
                        <span>{mistake.wasCorrectPairing ? 'War korrekt' : 'War falsch'}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppContent>
    )
  }

  return (
    <AppContent>
      {/* Toast Notification - Compact, under header */}
      {toast && (
        <div 
          key={toast.id}
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            opacity: toastVisible ? 1 : 0,
            transition: 'opacity 0.25s ease-out',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: '6px 12px',
            backgroundColor: toast.isCorrect ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            {/* Icon */}
            <span style={{ fontSize: '14px', color: 'white' }}>
              {toast.isCorrect ? '✓' : '✗'}
            </span>
            
            {/* Text - show character for wrong answers */}
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
              {toast.isCorrect 
                ? 'Richtig!' 
                : `${toast.character || ''} = ${toast.correctRomaji}`
              }
            </span>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div style={{ position: 'relative', height: '480px', marginBottom: 'var(--spacing-4)', overflow: 'hidden' }}>
        {game.cardStack.map((card, idx) => (
          <SwipeCard
            key={`${game.currentIndex + idx}`}
            card={card}
            index={idx}
            isActive={idx === 0}
            onSwipe={handleSwipeWithToast}
            correctAnswer={idx === 0 ? game.correctAnswer : undefined}
          />
        ))}
      </div>

      {/* Progress */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm font-medium text-primary">
              Karte {game.currentIndex + 1} / {game.totalCards}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>
              {Math.round(((game.currentIndex + 1) / game.totalCards) * 100)}%
            </span>
          </div>
          <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
            <div style={{
              background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
              height: '8px',
              borderRadius: '9999px',
              transition: 'width 0.3s ease',
              width: `${((game.currentIndex + 1) / game.totalCards) * 100}%`
            }} />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <div className="grid-2">
          <div>
            <p className="text-sm text-tertiary" style={{ margin: 0 }}>Richtig</p>
            <p className="text-2xl font-bold" style={{ color: '#10b981', margin: 0 }}>{game.stats.correct}</p>
          </div>
          <div>
            <p className="text-sm text-tertiary" style={{ margin: 0 }}>Falsch</p>
            <p className="text-2xl font-bold" style={{ color: '#ef4444', margin: 0 }}>{game.stats.incorrect}</p>
          </div>
        </div>
      </Card>

      <AppFooter>
        <p className="text-sm text-tertiary" style={{ width: '100%', textAlign: 'center', margin: 0 }}>
          Wische ➡️ richtig | Wische ⬅️ falsch
        </p>
      </AppFooter>
    </AppContent>
  )
}
