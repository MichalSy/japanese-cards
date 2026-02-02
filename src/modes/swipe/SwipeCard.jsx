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
    // Stack cards with slight offset
    return index * 8
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
          translateX(calc(-50% + ${translateX}px + ${getOffset()}px))
          translateY(calc(-50% + ${getOffset()}px))
          rotateZ(${rotateZ}deg)
          scale(${1 - index * 0.02})
        `,
        width: '90%',
        maxWidth: '400px',
        height: '500px',
        backgroundColor: getBackgroundColor(),
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-surface-light)',
        zIndex: getZIndex(),
        cursor: isActive ? 'grab' : 'default',
        transition: 'transform 0.05s ease-out',
        padding: 'var(--spacing-6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        opacity: opacity,
        userSelect: 'none',
        overflow: 'hidden',
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
          }}
        />
      )}
      {/* Character (for Hiragana/Katakana) */}
      {card.character && (
        <div style={{ fontSize: '120px', marginBottom: 'var(--spacing-4)', fontWeight: '700' }}>
          {card.character}
        </div>
      )}

      {/* Question/Prompt */}
      {card.word && (
        <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-4)', fontWeight: '700', textAlign: 'center' }}>
          {card.word}
        </div>
      )}

      {/* Meaning/Answer */}
      {card.meaning && (
        <div style={{ fontSize: '24px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          {card.meaning}
        </div>
      )}

      {/* Romaji */}
      {card.romaji && (
        <div style={{ fontSize: '16px', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-4)', fontStyle: 'italic' }}>
          {card.romaji}
        </div>
      )}

      {/* Swipe Indicators - show what's correct this round */}
      {!swipeState && (
        <div style={{ position: 'absolute', bottom: 'var(--spacing-4)', left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '0 var(--spacing-4)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          <span>{correctAnswer ? '❌ Falsch' : '✅ Richtig'}</span>
          <span>{correctAnswer ? '✅ Richtig' : '❌ Falsch'}</span>
        </div>
      )}
    </div>
  )
}
