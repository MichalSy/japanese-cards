import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { fetchGroupData, fetchAllItemsFromCategory } from '../../config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCard from './SwipeCard'
import { AppContent, Card } from '../../components/Layout'

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
    
    // Set toast content - always show character = romaji
    const toastData = { isCorrect, correctRomaji, character, id: Date.now() }
    setToast(toastData)
    setToastVisible(true)
    
    // Longer display time (2.5s)
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false)
      toastTimeoutRef.current = setTimeout(() => setToast(null), 300)
    }, 2500)
    
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
          data = await fetchAllItemsFromCategory(contentType)
        } else {
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: 'var(--color-text-tertiary)'
      }}>
        Spiel wird vorbereitet...
      </div>
    )
  }

  if (error) {
    return (
      <AppContent>
        <div style={{ 
          padding: 'var(--spacing-4)', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: 'var(--radius-md)', 
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
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

          {game.stats.mistakes.length > 0 && (
            <div>
              <h3 className="text-base font-medium" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                Fehler ({game.stats.mistakes.length})
              </h3>
              <div className="space-y-3">
                {game.stats.mistakes.map((mistake, idx) => {
                  const character = mistake.realCard?.character || mistake.realCard?.word || '?'
                  const shownRomaji = mistake.displayedCard?.shownRomaji || mistake.displayedCard?.romaji
                  const correctRomaji = mistake.realCard?.romaji
                  const wasCorrectPairing = mistake.wasCorrectPairing
                  const userSaidCorrect = mistake.userAction === 'right'
                  
                  return (
                    <Card key={idx}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Header: Character + what was shown */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid var(--color-surface-light)'
                        }}>
                          <div style={{ 
                            fontSize: '40px', 
                            fontWeight: '300',
                            color: 'var(--color-text-primary)',
                          }}>
                            {character}
                          </div>
                          <div style={{ 
                            fontSize: '20px', 
                            color: 'var(--color-primary)',
                            fontWeight: '500',
                            fontStyle: 'italic',
                          }}>
                            {shownRomaji}
                          </div>
                          <div style={{
                            marginLeft: 'auto',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: wasCorrectPairing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: wasCorrectPairing ? '#10b981' : '#ef4444',
                          }}>
                            {wasCorrectPairing ? 'War richtig' : 'War falsch'}
                          </div>
                        </div>
                        
                        {/* Explanation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                          <div style={{ color: 'var(--color-text-tertiary)' }}>
                            <span>Deine Antwort: </span>
                            <span style={{ 
                              color: '#ef4444',
                              fontWeight: '600'
                            }}>
                              „{userSaidCorrect ? 'Richtig' : 'Falsch'}"
                            </span>
                          </div>
                          
                          <div style={{ color: 'var(--color-text-tertiary)' }}>
                            <span>Korrekte Antwort: </span>
                            <span style={{ 
                              color: '#10b981',
                              fontWeight: '600'
                            }}>
                              „{wasCorrectPairing ? 'Richtig' : 'Falsch'}"
                            </span>
                          </div>
                          
                          {!wasCorrectPairing && (
                            <div style={{ 
                              marginTop: '4px',
                              color: 'var(--color-text-secondary)',
                              fontStyle: 'italic'
                            }}>
                              {character} = {correctRomaji}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </AppContent>
    )
  }

  // Calculate progress
  const progress = ((game.currentIndex) / game.totalCards) * 100

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Instruction Bar */}
      <div style={{
        padding: '12px 16px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-surface-light)',
        backgroundColor: 'var(--color-bg-secondary)',
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.3px',
        }}>
          Ist die Kombination richtig?
        </span>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div 
          key={toast.id}
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            opacity: toastVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            backgroundColor: toast.isCorrect ? '#10b981' : '#ef4444',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: 'white' 
            }}>
              {toast.isCorrect ? '✓' : '✗'}
            </span>
            <span style={{ 
              fontSize: '17px', 
              fontWeight: '600', 
              color: 'white',
              letterSpacing: '0.5px',
            }}>
              {toast.character} = {toast.correctRomaji}
            </span>
          </div>
        </div>
      )}

      {/* Card Area - fills available space */}
      <div style={{ 
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        minHeight: 0,
      }}>
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

      {/* Bottom Bar - Progress + Stats */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-surface-light)',
      }}>
        {/* Progress Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{ 
            flex: 1,
            height: '6px',
            backgroundColor: 'var(--color-surface-light)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            minWidth: '60px',
            textAlign: 'right'
          }}>
            {game.currentIndex + 1} / {game.totalCards}
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Richtig:</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>{game.stats.correct}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Falsch:</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>{game.stats.incorrect}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
