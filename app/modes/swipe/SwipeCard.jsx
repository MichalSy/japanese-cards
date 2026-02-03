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
    const rotation = (diff / 300) * 6
    setPosition({ x: diff, rotation: Math.max(-8, Math.min(8, rotation)) })
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
      x: direction === 'right' ? 300 : -300,
      rotation: direction === 'right' ? 10 : -10
    })
    
    setTimeout(() => {
      onSwipe(isCorrect, direction, card.correctRomaji, character)
    }, 220)
  }

  const getTransition = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') return 'all 0.22s ease-out'
    return 'all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1)'
  }

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
        width: 'calc(100% - 64px)',
        maxWidth: '340px',
        height: 'calc(100% - 48px)',
        maxHeight: '500px',
        background: 'var(--color-surface)',
        borderRadius: '16px',
        border: '1px solid var(--color-surface-light)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        opacity: swipeState === 'exit' ? 0 : 1,
        userSelect: 'none',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Swipe feedback - left edge */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        background: `linear-gradient(90deg, rgba(239, 68, 68, ${isSwipingLeft ? swipeProgress * 0.3 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '16px',
      }}>
        <span style={{
          fontSize: '32px',
          opacity: isSwipingLeft ? swipeProgress : 0,
          transform: `scale(${0.5 + swipeProgress * 0.5})`,
          transition: isDragging ? 'none' : 'all 0.2s',
        }}>✗</span>
      </div>

      {/* Swipe feedback - right edge */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        background: `linear-gradient(-90deg, rgba(16, 185, 129, ${isSwipingRight ? swipeProgress * 0.3 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '16px',
      }}>
        <span style={{
          fontSize: '32px',
          opacity: isSwipingRight ? swipeProgress : 0,
          transform: `scale(${0.5 + swipeProgress * 0.5})`,
          transition: isDragging ? 'none' : 'all 0.2s',
        }}>✓</span>
      </div>

      {/* Main Content - centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '40px 24px',
        gap: '20px',
      }}>
        {/* Character */}
        <div style={{ 
          fontSize: 'clamp(100px, 28vw, 180px)', 
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
            fontSize: '28px', 
            color: 'var(--color-primary)',
            fontWeight: '500',
            letterSpacing: '3px',
            textTransform: 'lowercase',
          }}>
            {card.shownRomaji || card.romaji}
          </div>
        )}
      </div>

      {/* Bottom action area */}
      <div style={{ 
        display: 'flex', 
        padding: '20px 24px',
        paddingBottom: '28px',
        gap: '16px',
        opacity: swipeState === 'exit' ? 0 : 1,
      }}>
        <button
          onClick={() => handleButtonClick(false)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: '100px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: 'none',
            color: '#f87171',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'
          }}
        >
          Falsch
        </button>

        <button
          onClick={() => handleButtonClick(true)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: '100px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: 'none',
            color: '#34d399',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.08)'
          }}
        >
          Richtig
        </button>
      </div>
    </div>
  )
}
