import { useState, useEffect, useCallback } from 'react'

export default function SwipeCardPro({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null)
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, rotation: 0 })
  const [exitDirection, setExitDirection] = useState(null)

  const character = card?.character || card?.word || ''

  const triggerSwipe = useCallback((userThinkCorrect) => {
    if (!card || swipeState === 'exit') return
    
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
  }, [card, correctAnswer, onSwipe, character, swipeState])

  // Keyboard support for desktop
  useEffect(() => {
    if (!isActive || swipeState || !card) return
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        triggerSwipe(false)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        triggerSwipe(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, swipeState, card, triggerSwipe])

  if (!card) return null

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

  const getTransition = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') return 'all 0.22s ease-out'
    return 'all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1)'
  }

  const swipeProgress = Math.min(1, Math.abs(position.x) / 50)
  const isSwipingRight = position.x > 0
  const isSwipingLeft = position.x < 0

  // Calculate stack offset for background cards
  const stackOffset = index * 4
  const stackScale = 1 - (index * 0.03)
  const stackOpacity = index === 0 ? 1 : 0.6 - (index * 0.15)

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
          translateY(calc(-50% + ${stackOffset}px))
          rotate(${position.rotation}deg)
          scale(${stackScale})
        `,
        width: 'calc(100% - 48px)',
        maxWidth: '320px',
        aspectRatio: '3/4',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        boxShadow: index === 0 
          ? '0 0 40px rgba(236, 72, 153, 0.3), 0 0 80px rgba(236, 72, 153, 0.15), inset 0 0 60px rgba(236, 72, 153, 0.05)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        opacity: swipeState === 'exit' ? 0 : stackOpacity,
        userSelect: 'none',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Pink glow border effect */}
      <div style={{
        position: 'absolute',
        inset: '-2px',
        borderRadius: '22px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.5))',
        zIndex: -1,
        filter: 'blur(2px)',
        opacity: index === 0 ? 1 : 0.3,
      }} />

      {/* Swipe feedback - left edge */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: `linear-gradient(90deg, rgba(239, 68, 68, ${isSwipingLeft ? swipeProgress * 0.5 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '20px',
      }}>
        <span style={{
          fontSize: '36px',
          opacity: isSwipingLeft ? swipeProgress : 0,
          transform: `scale(${0.6 + swipeProgress * 0.4})`,
          transition: isDragging ? 'none' : 'all 0.2s',
          color: '#ef4444',
        }}>✗</span>
      </div>

      {/* Swipe feedback - right edge */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: `linear-gradient(-90deg, rgba(16, 185, 129, ${isSwipingRight ? swipeProgress * 0.5 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '20px',
      }}>
        <span style={{
          fontSize: '36px',
          opacity: isSwipingRight ? swipeProgress : 0,
          transform: `scale(${0.5 + swipeProgress * 0.5})`,
          transition: isDragging ? 'none' : 'all 0.2s',
          color: '#10b981',
        }}>✓</span>
      </div>

      {/* Main Content - centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '32px 24px',
        gap: '16px',
      }}>
        {/* Character */}
        <div style={{ 
          fontSize: 'clamp(80px, 24vw, 140px)', 
          fontWeight: '200', 
          lineHeight: 1,
          color: 'white',
          textAlign: 'center',
          textShadow: '0 0 40px rgba(255,255,255,0.1)',
        }}>
          {character}
        </div>

        {/* Romaji */}
        {(card.shownRomaji || card.romaji) && (
          <div style={{ 
            fontSize: '26px', 
            color: '#ec4899',
            fontWeight: '500',
            letterSpacing: '3px',
            textTransform: 'lowercase',
            textShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
          }}>
            {card.shownRomaji || card.romaji}
          </div>
        )}
      </div>

      {/* Bottom action buttons */}
      <div style={{ 
        display: 'flex', 
        padding: '16px 20px',
        paddingBottom: '24px',
        gap: '12px',
        opacity: swipeState === 'exit' ? 0 : 1,
      }}>
        <button
          onClick={() => handleButtonClick(false)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.15)'
          }}
        >
          <span style={{ fontSize: '16px' }}>✗</span>
          Falsch
        </button>

        <button
          onClick={() => handleButtonClick(true)}
          disabled={swipeState === 'exit'}
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.15)'
          }}
        >
          <span style={{ fontSize: '16px' }}>✓</span>
          Richtig
        </button>
      </div>
    </div>
  )
}
