import { useState } from 'react'

export default function SwipeCard({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null) // null, 'swiping', 'exit'
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, rotation: 0 })
  const [exitDirection, setExitDirection] = useState(null) // 'left' or 'right'

  if (!card) return null

  // Handle Touch + Mouse drag
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
    
    // Smooth rotation based on drag distance
    const rotation = (diff / 200) * 12
    setPosition({ x: diff, rotation: Math.max(-15, Math.min(15, rotation)) })
  }

  const handleDragEnd = () => {
    if (!isActive || !isDragging) return
    setIsDragging(false)

    const threshold = 100
    const isSwipedLeft = position.x < -threshold
    const isSwipedRight = position.x > threshold

    if (isSwipedLeft || isSwipedRight) {
      triggerSwipe(isSwipedRight)
    } else {
      // Snap back with spring animation
      setSwipeState(null)
      setPosition({ x: 0, rotation: 0 })
    }
  }

  // Handle Button Click
  const handleButtonClick = (isCorrect) => {
    if (!isActive || swipeState === 'exit') return
    triggerSwipe(isCorrect)
  }

  const triggerSwipe = (userThinkCorrect) => {
    const isCorrect = userThinkCorrect === correctAnswer
    const direction = userThinkCorrect ? 'right' : 'left'
    
    // Set exit state for smooth fly-out
    setExitDirection(direction)
    setSwipeState('exit')
    
    // Animate to exit position
    setPosition({
      x: direction === 'right' ? 400 : -400,
      rotation: direction === 'right' ? 20 : -20
    })
    
    // Callback after animation completes
    setTimeout(() => {
      onSwipe(isCorrect, direction, card.correctRomaji)
    }, 350)
  }

  const getTransitionStyle = () => {
    if (isDragging) {
      return 'none' // No transition while dragging for instant response
    }
    if (swipeState === 'exit') {
      return 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease-out'
    }
    // Snap back animation
    return 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring effect
  }

  const getFlashColor = () => {
    if (swipeState !== 'exit') return 'transparent'
    const isCorrect = (exitDirection === 'right') === correctAnswer
    return isCorrect ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
  }

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
        transformOrigin: 'center center',
        width: '90%',
        maxWidth: '420px',
        height: '580px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-surface-light)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransitionStyle(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        opacity: swipeState === 'exit' ? 0 : 1,
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: isDragging 
          ? '0 32px 64px rgba(0,0,0,0.35)' 
          : '0 24px 48px rgba(0,0,0,0.2)',
        touchAction: 'none',
      }}
    >
      {/* Flash overlay on exit */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: getFlashColor(),
          opacity: swipeState === 'exit' ? 1 : 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 'var(--radius-xl)',
        }}
      />

      {/* Swipe Direction Indicators */}
      {isDragging && (
        <>
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            opacity: Math.min(1, Math.max(0, -position.x / 100)),
            transition: 'opacity 0.1s',
            pointerEvents: 'none',
          }}>
            ✗
          </div>
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '48px',
            opacity: Math.min(1, Math.max(0, position.x / 100)),
            transition: 'opacity 0.1s',
            pointerEvents: 'none',
          }}>
            ✓
          </div>
        </>
      )}

      {/* Content Wrapper */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-8)',
        height: '100%',
        width: '100%',
      }}>
        {/* Top Section: Question */}
        <div style={{ 
          fontSize: '16px', 
          color: 'var(--color-text-secondary)', 
          textAlign: 'center',
          fontWeight: '600',
          letterSpacing: '0.5px',
          lineHeight: 1.4,
        }}>
          Ist das Zeichen richtig zugeordnet?
        </div>

        {/* Middle Section: Character + Romaji */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 'var(--spacing-6)',
          flex: 1,
        }}>
          {/* Character - LARGE */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {card.character && (
              <div style={{ 
                fontSize: '140px', 
                fontWeight: '700', 
                lineHeight: 0.95,
                color: 'var(--color-text-primary)',
              }}>
                {card.character}
              </div>
            )}
            {card.word && (
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                textAlign: 'center', 
                lineHeight: 1.1,
                color: 'var(--color-text-primary)',
              }}>
                {card.word}
              </div>
            )}
          </div>

          {/* Romaji - What user sees */}
          {(card.shownRomaji || card.romaji) && (
            <div style={{ 
              fontSize: '28px', 
              color: '#ec4899',
              fontWeight: '700',
              letterSpacing: '0.5px',
              fontStyle: 'italic',
              padding: '0 var(--spacing-4)',
              textAlign: 'center',
            }}>
              {card.shownRomaji || card.romaji}
            </div>
          )}
        </div>

        {/* Bottom Section: Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: '100%',
          gap: 'var(--spacing-4)',
          minHeight: '90px',
          opacity: swipeState === 'exit' ? 0 : 1,
          transition: 'opacity 0.15s',
        }}>
          {/* Left Button - Falsch */}
          <button
            onClick={() => handleButtonClick(false)}
            disabled={swipeState === 'exit'}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-4) var(--spacing-3)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: swipeState === 'exit' ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              if (swipeState !== 'exit') {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ←
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>Falsch</span>
          </button>

          {/* Right Button - Richtig */}
          <button
            onClick={() => handleButtonClick(true)}
            disabled={swipeState === 'exit'}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-4) var(--spacing-3)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(236, 72, 153, 0.2)',
              border: '2px solid rgba(236, 72, 153, 0.4)',
              color: '#ec4899',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: swipeState === 'exit' ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              if (swipeState !== 'exit') {
                e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.3)'
                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            →
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>Richtig</span>
          </button>
        </div>
      </div>
    </div>
  )
}
