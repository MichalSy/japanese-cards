import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { fetchGroupData, fetchAllItemsFromCategory } from '../../config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCardPro from './SwipeCardPro'
import { AppContent, Card } from '../../components/Layout'

export default function SwipeGamePro({ contentType, groupId, cardCount }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimeoutRef = useRef(null)

  const game = useSwipeGame(items, cardCount, contentType)
  
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
        color: 'rgba(255,255,255,0.6)',
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px',
        overflowY: 'auto',
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'white', 
            margin: '0 0 24px 0' 
          }}>
            Spiel beendet! 🎉
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Richtig</p>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#10b981', margin: '8px 0 0 0' }}>
                {game.stats.correct}/{total}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Prozentsatz</p>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#ec4899', margin: '8px 0 0 0' }}>
                {percentage}%
              </p>
            </div>
          </div>
        </div>

        {game.stats.mistakes.length > 0 && (() => {
          // Deduplicate by character
          const uniqueMistakes = []
          const seen = new Set()
          game.stats.mistakes.forEach(mistake => {
            const char = mistake.realCard?.character || mistake.realCard?.word
            if (char && !seen.has(char)) {
              seen.add(char)
              uniqueMistakes.push(mistake)
            }
          })
          
          return (
            <div>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'rgba(255,255,255,0.7)', 
                marginBottom: '16px' 
              }}>
                📚 Nochmal üben
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px' 
              }}>
                {uniqueMistakes.map((mistake, idx) => {
                  const character = mistake.realCard?.character || mistake.realCard?.word || '?'
                  const correctRomaji = mistake.realCard?.romaji
                  
                  return (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 16px',
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(236, 72, 153, 0.2)',
                      }}
                    >
                      <span style={{ 
                        fontSize: '48px', 
                        fontWeight: '300',
                        color: 'white',
                        lineHeight: 1,
                        marginBottom: '8px',
                      }}>
                        {character}
                      </span>
                      <span style={{ 
                        fontSize: '16px', 
                        color: '#ec4899',
                        fontWeight: '600',
                      }}>
                        {correctRomaji}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>
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
      backgroundImage: 'url(/japanese-cards/images/swipe-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Dark overlay for better readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        zIndex: 0,
      }} />

      {/* Instruction Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 20px',
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: '500',
          color: 'white',
          letterSpacing: '0.5px',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
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
            top: '70px',
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
            padding: '12px 24px',
            backgroundColor: toast.isCorrect 
              ? 'rgba(16, 185, 129, 0.9)' 
              : 'rgba(239, 68, 68, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
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
        zIndex: 1,
      }}>
        {game.cardStack.map((card, idx) => (
          <SwipeCardPro
            key={`${game.currentIndex + idx}`}
            card={card}
            index={idx}
            isActive={idx === 0}
            onSwipe={handleSwipeWithToast}
            correctAnswer={idx === 0 ? game.correctAnswer : undefined}
          />
        ))}
      </div>

      {/* Bottom Bar - Progress */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 24px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
      }}>
        {/* Progress Counter */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '12px',
        }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
          }}>
            {game.currentIndex + 1}/{game.totalCards}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          height: '6px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
          }} />
        </div>
      </div>
    </div>
  )
}
