import { useState, useEffect, useMemo } from 'react'

export default function SwipeCard({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null) // null, swiping, correct, incorrect
  const [touchStart, setTouchStart] = useState(0)
  const [rotateZ, setRotateZ] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [flashOpacity, setFlashOpacity] = useState(0)

  if (!card) return null

  const handleTouchStart = (e) => {
    if (!isActive) return
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isActive || swipeState) return
    const currentX = e.touches[0].clientX
    const diff = currentX - touchStart
    const maxDiff = 150

    if (Math.abs(diff) > 20) {
      const percentage = Math.min(Math.abs(diff) / maxDiff, 1)
      setRotateZ((diff / maxDiff) * 15)
      setTranslateX(diff)
    }
  }

  const handleTouchEnd = async () => {
    if (!isActive) return

    const threshold = 80
    const isSwipedLeft = translateX < -threshold
    const isSwipedRight = translateX > threshold

    if (isSwipedLeft || isSwipedRight) {
      // Determine if correct based on random answer + swipe direction
      // Right swipe = user thinks correct, Left swipe = user thinks incorrect
      const userThinkCorrect = isSwipedRight
      const isCorrect = userThinkCorrect === correctAnswer
      
      // Flash animation
      setSwipeState(isCorrect ? 'correct' : 'incorrect')
      setFlashOpacity(1)
      
      // Fade out flash
      await new Promise(resolve => {
        setTimeout(() => {
          setFlashOpacity(0)
        }, 200)
        setTimeout(resolve, 300)
      })
      
      // Animate out
      setTranslateX(isSwipedLeft ? -500 : 500)
      setRotateZ(isSwipedLeft ? -45 : 45)
      setOpacity(0)
      
      // Wait for animation then call callback
      await new Promise(resolve => setTimeout(resolve, 300))
      
      onSwipe(isCorrect, isSwipedRight ? 'right' : 'left')
    } else {
      // Snap back
      setRotateZ(0)
      setTranslateX(0)
    }
  }

  const getBackgroundColor = () => {
    return 'var(--color-surface)'
  }

  const getFlashColor = () => {
    if (swipeState === 'correct') return 'rgba(16, 185, 129, 0.8)' // Green
    if (swipeState === 'incorrect') return 'rgba(239, 68, 68, 0.8)' // Red
    return 'transparent'
  }

  const getZIndex = () => {
    return 100 - index
  }

  const getOffset = () => {
    // Cards exactly behind each other - no stack visual
    return 0
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `
          translateX(calc(-50% + ${translateX}px))
          translateY(-50%)
          rotateZ(${rotateZ}deg)
        `,
        width: '90%',
        maxWidth: '380px',
        height: '520px',
        backgroundColor: getBackgroundColor(),
        borderRadius: '24px',
        border: '2px solid var(--color-surface-light)',
        zIndex: getZIndex(),
        cursor: isActive ? 'grab' : 'default',
        transition: 'transform 0.05s ease-out',
        padding: 'var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--color-text-primary)',
        opacity: opacity,
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      }}
    >
      {/* Flash overlay */}
      {swipeState && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: getFlashColor(),
            opacity: flashOpacity,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '24px',
          }}
        />
      )}

      {/* Top Section: Question */}
      <div style={{ 
        fontSize: '18px', 
        color: 'var(--color-text-secondary)', 
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: '0.3px',
        marginBottom: 'var(--spacing-6)',
      }}>
        Ist das Zeichen richtig zugeordnet?
      </div>

      {/* Middle Section: Character - LARGE */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
        {card.character && (
          <div style={{ fontSize: '160px', fontWeight: '700', lineHeight: 0.9 }}>
            {card.character}
          </div>
        )}
        {card.word && (
          <div style={{ fontSize: '56px', fontWeight: '700', textAlign: 'center', lineHeight: 1 }}>
            {card.word}
          </div>
        )}
      </div>

      {/* Romaji - CLAIM/ASSERTION */}
      {card.romaji && (
        <div style={{ 
          fontSize: '32px', 
          color: '#ec4899',
          fontWeight: '700',
          letterSpacing: '1px',
          fontStyle: 'italic',
          marginBottom: 'var(--spacing-6)',
          padding: '0 var(--spacing-4)',
          textAlign: 'center',
        }}>
          {card.romaji}
        </div>
      )}

      {/* Arrow Buttons - Always in DOM, hidden when flashing */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '300px',
        gap: 'var(--spacing-6)',
        opacity: swipeState ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        {/* Left Arrow - Falsch */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          padding: 'var(--spacing-4)',
          borderRadius: '18px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          fontSize: '32px',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}>
          ←
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>Falsch</span>
        </div>

        {/* Right Arrow - Richtig */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          padding: 'var(--spacing-4)',
          borderRadius: '18px',
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          color: '#ec4899',
          fontSize: '32px',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}>
          →
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>Richtig</span>
        </div>
      </div>
    </div>
  )
}
