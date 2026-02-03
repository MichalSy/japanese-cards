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
    const rotation = (diff / 200) * 10
    setPosition({ x: diff, rotation: Math.max(-12, Math.min(12, rotation)) })
  }

  const handleDragEnd = () => {
    if (!isActive || !isDragging) return
    setIsDragging(false)

    const threshold = 80
    const isSwipedLeft = position.x < -threshold
    const isSwipedRight = position.x > threshold

    if (isSwipedLeft || isSwipedRight) {
      triggerSwipe(isSwipedRight)
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
      x: direction === 'right' ? 350 : -350,
      rotation: direction === 'right' ? 15 : -15
    })
    
    setTimeout(() => {
      onSwipe(isCorrect, direction, card.correctRomaji, character)
    }, 280)
  }

  const getTransitionStyle = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') {
      return 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease-out'
    }
    return 'transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)'
  }

  const getFlashColor = () => {
    if (swipeState !== 'exit') return 'transparent'
    const isCorrect = (exitDirection === 'right') === correctAnswer
    return isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'
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
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        height: 'calc(100% - 24px)',
        maxHeight: '600px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: '20px',
        border: '1px solid var(--color-surface-light)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransitionStyle(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        opacity: swipeState === 'exit' ? 0 : 1,
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: isDragging 
          ? '0 20px 50px rgba(0,0,0,0.4)' 
          : '0 12px 40px rgba(0,0,0,0.25)',
        touchAction: 'none',
      }}
    >
      {/* Flash overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: getFlashColor(),
        opacity: swipeState === 'exit' ? 1 : 0,
        transition: 'opacity 0.15s ease',
        pointerEvents: 'none',
        zIndex: 10,
        borderRadius: '20px',
      }} />

      {/* Swipe Indicators */}
      {isDragging && (
        <>
          <div style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '56px',
            opacity: Math.min(1, Math.max(0, -position.x / 80)),
            color: '#ef4444',
            pointerEvents: 'none',
          }}>✗</div>
          <div style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '56px',
            opacity: Math.min(1, Math.max(0, position.x / 80)),
            color: '#10b981',
            pointerEvents: 'none',
          }}>✓</div>
        </>
      )}

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        height: '100%',
        width: '100%',
      }}>
        {/* Question */}
        <div style={{ 
          fontSize: '15px', 
          color: 'var(--color-text-tertiary)', 
          textAlign: 'center',
          fontWeight: '500',
        }}>
          Ist das Zeichen richtig zugeordnet?
        </div>

        {/* Character + Romaji */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px',
          flex: 1,
        }}>
          <div style={{ 
            fontSize: 'clamp(80px, 20vw, 140px)', 
            fontWeight: '300', 
            lineHeight: 1,
            color: 'var(--color-text-primary)',
          }}>
            {character}
          </div>

          {(card.shownRomaji || card.romaji) && (
            <div style={{ 
              fontSize: '28px', 
              color: 'var(--color-primary)',
              fontWeight: '600',
              fontStyle: 'italic',
            }}>
              {card.shownRomaji || card.romaji}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          width: '100%',
          gap: '12px',
          opacity: swipeState === 'exit' ? 0 : 1,
        }}>
          <button
            onClick={() => handleButtonClick(false)}
            disabled={swipeState === 'exit'}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <span style={{ fontSize: '20px' }}>←</span>
            Falsch
          </button>

          <button
            onClick={() => handleButtonClick(true)}
            disabled={swipeState === 'exit'}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Richtig
            <span style={{ fontSize: '20px' }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
