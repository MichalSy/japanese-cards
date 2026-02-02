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

      {/* Top Section: Character */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {card.character && (
          <div style={{ fontSize: '140px', fontWeight: '700', lineHeight: 1 }}>
            {card.character}
          </div>
        )}
        {card.word && (
          <div style={{ fontSize: '48px', fontWeight: '700', textAlign: 'center', lineHeight: 1 }}>
            {card.word}
          </div>
        )}
      </div>

      {/* Middle Section: Question */}
      <div style={{ 
        fontSize: '16px', 
        color: 'var(--color-text-secondary)', 
        textAlign: 'center',
        marginBottom: 'var(--spacing-4)',
        fontWeight: '500',
        opacity: 0.8
      }}>
        Ist das Zeichen richtig zugeordnet?
      </div>

      {/* Bottom Section: Romaji + Arrows */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        {/* Romaji only */}
        {card.romaji && (
          <div style={{ 
            fontSize: '20px', 
            color: '#ec4899',
            fontWeight: '600',
            letterSpacing: '1px',
            fontStyle: 'italic',
          }}>
            {card.romaji}
          </div>
        )}

        {/* Arrow Buttons */}
        {!swipeState && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '280px',
            gap: 'var(--spacing-6)',
            marginTop: 'var(--spacing-2)',
          }}>
            {/* Left Arrow - Falsch */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-3)',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontSize: '28px',
              fontWeight: 'bold',
              opacity: 0.7,
            }}>
              ←
              <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>Falsch</span>
            </div>

            {/* Right Arrow - Richtig */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-3)',
              borderRadius: '16px',
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              color: '#ec4899',
              fontSize: '28px',
              fontWeight: 'bold',
              opacity: 0.8,
            }}>
              →
              <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>Richtig</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
