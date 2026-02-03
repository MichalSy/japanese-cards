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

  useEffect(() => {
    if (onButtonClick && isActive) {
      onButtonClick.current = triggerSwipe
    }
  }, [onButtonClick, isActive, triggerSwipe])

  useEffect(() => {
    if (!isActive || swipeState || !card) return
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); triggerSwipe(false) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); triggerSwipe(true) }
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
    setDragStart(e.touches ? e.touches[0].clientX : e.clientX)
  }

  const handleDragMove = (e) => {
    if (!isActive || !isDragging) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStart
    setPosition({ x: diff, rotation: Math.max(-8, Math.min(8, (diff / 300) * 6)) })
  }

  const handleDragEnd = () => {
    if (!isActive || !isDragging) return
    setIsDragging(false)
    if (position.x < -80) triggerSwipe(false)
    else if (position.x > 80) triggerSwipe(true)
    else { setSwipeState(null); setPosition({ x: 0, rotation: 0 }) }
  }

  const getTransition = () => {
    if (isDragging) return 'none'
    if (swipeState === 'exit') return 'all 0.22s ease-out'
    return 'all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1)'
  }

  const swipeProgress = Math.min(1, Math.abs(position.x) / 50)
  const isSwipingRight = position.x > 0
  const isSwipingLeft = position.x < 0

  // Stack styling
  const stackOffset = index * 8
  const stackScale = 1 - (index * 0.03)
  const stackOpacity = index === 0 ? 1 : Math.max(0.3, 0.7 - (index * 0.2))

  // Neon glow effect
  const mainCardShadow = `
    0 0 15px rgba(236, 72, 153, 1),
    0 0 30px rgba(236, 72, 153, 0.8),
    0 0 45px rgba(236, 72, 153, 0.6),
    0 0 60px rgba(236, 72, 153, 0.4),
    0 0 90px rgba(236, 72, 153, 0.2)
  `

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
        transform: `translateX(calc(-50% + ${position.x}px)) translateY(calc(-50% + ${stackOffset}px)) rotate(${position.rotation}deg) scale(${stackScale})`,
        width: 'calc(100% - 40px)',
        maxWidth: '340px',
        height: 'auto',
        aspectRatio: '3/4',
        background: 'linear-gradient(145deg, rgba(45, 55, 72, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '24px',
        border: index === 0 ? '2px solid rgba(236, 72, 153, 0.9)' : '1px solid rgba(100, 116, 139, 0.4)',
        boxShadow: index === 0 ? mainCardShadow : '0 8px 32px rgba(0,0,0,0.4)',
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
      {/* Glass reflection effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '24px 24px 0 0',
        pointerEvents: 'none',
      }} />

      {/* Swipe feedback left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%',
        background: `linear-gradient(90deg, rgba(239,68,68,${isSwipingLeft ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '24px',
      }}>
        <span style={{ fontSize: '48px', opacity: isSwipingLeft ? swipeProgress : 0, color: '#ef4444' }}>✗</span>
      </div>

      {/* Swipe feedback right */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
        background: `linear-gradient(-90deg, rgba(16,185,129,${isSwipingRight ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px',
      }}>
        <span style={{ fontSize: '48px', opacity: isSwipingRight ? swipeProgress : 0, color: '#10b981' }}>✓</span>
      </div>

      {/* Character */}
      <div style={{ fontSize: 'clamp(80px, 22vw, 140px)', fontWeight: '200', lineHeight: 1, color: 'white', textAlign: 'center', marginBottom: '16px' }}>
        {character}
      </div>

      {/* Romaji */}
      {(card.shownRomaji || card.romaji) && (
        <div style={{ fontSize: '26px', color: '#ec4899', fontWeight: '500', letterSpacing: '4px', textTransform: 'lowercase' }}>
          {card.shownRomaji || card.romaji}
        </div>
      )}
    </div>
  )
}
