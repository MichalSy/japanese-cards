import { useState } from 'react'

export default function SwipeCard({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null)
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, rotation: 0 })
  const [exitDirection, setExitDirection] = useState(null)

  if (!card) return null

  const character = card.character || card.word || ''

  const handleDragStart = (e) => {
    if (!isActive || swipeState) return
    e.preventDefault()
    setIsDragging(true)
    setSwipeState('swiping')
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setDragStart(clientX)
  }

  const handleDragMove = (e) => {
    if (!isActive || !isDragging) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStart
    const rotation = (diff / 250) * 8
    setPosition({ x: diff, rotation: Math.max(-10, Math.min(10, rotation)) })
  }

  const handleDragEnd = () => {
    if (!isActive || !isDragging) return
    setIsDragging(false)

    const threshold = 80
    if (position.x < -threshold) {
      triggerSwipe(false)
    } else if (position.x > threshold) {
      triggerSwipe(true)
    } else {
      setSwipeState(null)
      setPosition({ x: 0, rotation: 0 })
    }
  }

  const handleButtonClick = (isCorrect) => {
    if (!isActive || swipeState === 'exit') return
    triggerSwipe(isCorrect)
  }

  const triggerSwipe = (userThinkCorrect) => {
    const isCorrect = userThinkCorrect === correctAnswer
    const direction = userThinkCorrect ? 'right' : 'left'
    
    setExitDirection(direction)
    setSwipeState('exit')
    setPosition({
      x: direction === 'right' ? 320 : -320,
      rotation: direction === 'right' ? 12 : -12
    })
    
    setTimeout(() => {
      onSwipe(isCorrect, direction, card.correctRomaji, character)
    }, 250)
  }

  const getTransition = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') return 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    return 'all 0.3s cubic-bezier(0.34, 1.3, 0.64, 1)'
  }

  // Calculate swipe progress for visual feedback
  const swipeProgress = Math.min(1, Math.abs(position.x) / 100)
  const isSwipingRight = position.x > 0
  const isSwipingLeft = position.x < 0

  return (
    <div
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={isDragging ? handleDragEnd : undefined}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `
          translateX(calc(-50% + ${position.x}px))
          translateY(-50%)
          rotate(${position.rotation}deg)
        `,
        width: 'calc(100% - 40px)',
        maxWidth: '360px',
        height: 'calc(100% - 32px)',
        maxHeight: '560px',
        background: `linear-gradient(
          180deg,
          var(--color-surface) 0%,
          rgba(30, 41, 59, 0.95) 100%
        )`,
        borderRadius: '12px',
        border: `1px solid ${
          isDragging 
            ? isSwipingRight 
              ? `rgba(16, 185, 129, ${0.3 + swipeProgress * 0.4})` 
              : isSwipingLeft 
                ? `rgba(239, 68, 68, ${0.3 + swipeProgress * 0.4})`
                : 'var(--color-surface-light)'
            : 'var(--color-surface-light)'
        }`,
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        opacity: swipeState === 'exit' ? 0 : 1,
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        touchAction: 'none',
      }}
    >
      {/* Swipe feedback overlay */}
      {isDragging && swipeProgress > 0.1 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isSwipingRight 
            ? `rgba(16, 185, 129, ${swipeProgress * 0.15})`
            : `rgba(239, 68, 68, ${swipeProgress * 0.15})`,
          pointerEvents: 'none',
          borderRadius: '12px',
        }} />
      )}

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '32px 24px',
        gap: '24px',
      }}>
        {/* Character */}
        <div style={{ 
          fontSize: 'clamp(100px, 25vw, 160px)', 
          fontWeight: '200', 
          lineHeight: 1,
          color: 'var(--color-text-primary)',
          textAlign: 'center',
        }}>
          {character}
        </div>

        {/* Romaji */}
        {(card.shownRomaji || card.romaji) && (
          <div style={{ 
            fontSize: '32px', 
            color: 'var(--color-primary)',
            fontWeight: '500',
            letterSpacing: '2px',
          }}>
            {card.shownRomaji || card.romaji}
          </div>
        )}

        {/* Swipe indicator - shows when dragging */}
        {isDragging && swipeProgress > 0.3 && (
          <div style={{
            fontSize: '48px',
            opacity: swipeProgress,
            transition: 'opacity 0.1s',
          }}>
            {isSwipingRight ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* Action Buttons - minimal design */}
      <div style={{ 
        display: 'flex', 
        padding: '0 20px 24px',
        gap: '12px',
        opacity: swipeState === 'exit' ? 0 : 1,
      }}>
        <button
          onClick={() => handleButtonClick(false)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <span>←</span> Falsch
        </button>

        <button
          onClick={() => handleButtonClick(true)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Richtig <span>→</span>
        </button>
      </div>
    </div>
  )
}
