import { useState, useEffect, useCallback } from 'react'

export default function SwipeCardPro({ card, index, isActive, onSwipe, correctAnswer, onButtonClick }) {
  const [swipeState, setSwipeState] = useState(null)
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, rotation: 0 })

  const character = card?.character || card?.word || ''

  const triggerSwipe = useCallback((userThinkCorrect) => {
    if (!card || swipeState === 'exit') return
    
    const isCorrect = userThinkCorrect === correctAnswer
    const direction = userThinkCorrect ? 'right' : 'left'
    
    setSwipeState('exit')
    setPosition({
      x: direction === 'right' ? 300 : -300,
      rotation: direction === 'right' ? 10 : -10
    })
    
    setTimeout(() => {
      onSwipe(isCorrect, direction, card.correctRomaji, character)
    }, 220)
  }, [card, correctAnswer, onSwipe, character, swipeState])

  // Expose triggerSwipe to parent for button clicks
  useEffect(() => {
    if (onButtonClick && isActive) {
      onButtonClick.current = triggerSwipe
    }
  }, [onButtonClick, isActive, triggerSwipe])

  // Keyboard support
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

  const getTransition = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') return 'all 0.22s ease-out'
    return 'all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1)'
  }

  const swipeProgress = Math.min(1, Math.abs(position.x) / 50)
  const isSwipingRight = position.x > 0
  const isSwipingLeft = position.x < 0

  // Stack effect for background cards
  const stackOffset = index * 6
  const stackScale = 1 - (index * 0.02)
  const stackOpacity = index === 0 ? 1 : 0.5 - (index * 0.15)

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
        maxWidth: '340px',
        aspectRatio: '3/4',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(24px)',
        borderRadius: '24px',
        border: '2px solid rgba(236, 72, 153, 0.5)',
        boxShadow: index === 0 
          ? '0 0 60px rgba(236, 72, 153, 0.4), 0 0 120px rgba(236, 72, 153, 0.2)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(),
        willChange: 'transform, opacity',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: swipeState === 'exit' ? 0 : stackOpacity,
        userSelect: 'none',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Swipe feedback - left */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: `linear-gradient(90deg, rgba(239, 68, 68, ${isSwipingLeft ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '24px',
      }}>
        <span style={{
          fontSize: '48px',
          opacity: isSwipingLeft ? swipeProgress : 0,
          transform: `scale(${0.6 + swipeProgress * 0.4})`,
          transition: isDragging ? 'none' : 'all 0.2s',
          color: '#ef4444',
        }}>✗</span>
      </div>

      {/* Swipe feedback - right */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: `linear-gradient(-90deg, rgba(16, 185, 129, ${isSwipingRight ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none',
        transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '24px',
      }}>
        <span style={{
          fontSize: '48px',
          opacity: isSwipingRight ? swipeProgress : 0,
          transform: `scale(${0.5 + swipeProgress * 0.5})`,
          transition: isDragging ? 'none' : 'all 0.2s',
          color: '#10b981',
        }}>✓</span>
      </div>

      {/* Character */}
      <div style={{ 
        fontSize: 'clamp(100px, 28vw, 180px)', 
        fontWeight: '200', 
        lineHeight: 1,
        color: 'white',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        {character}
      </div>

      {/* Romaji */}
      {(card.shownRomaji || card.romaji) && (
        <div style={{ 
          fontSize: '28px', 
          color: '#ec4899',
          fontWeight: '500',
          letterSpacing: '4px',
          textTransform: 'lowercase',
        }}>
          {card.shownRomaji || card.romaji}
        </div>
      )}
    </div>
  )
}
