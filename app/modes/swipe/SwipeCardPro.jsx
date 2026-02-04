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

  // Stack styling - make stacked cards more visible with proper blur
  const stackOffset = index * 5
  const stackScale = 1 - (index * 0.015)
  const stackOpacity = index === 0 ? 1 : Math.max(0.55, 0.8 - (index * 0.1))
  const stackBlur = index === 0 ? 0 : index * 1.5

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
        width: 'calc(100% - 48px)',
        maxWidth: '320px',
        aspectRatio: '3/4',
        // Frosted glass - semi-opaque dark for true glass effect
        background: 'rgba(30, 40, 60, 0.45)',
        backdropFilter: 'blur(35px) brightness(1.15)',
        WebkitBackdropFilter: 'blur(35px) brightness(1.15)',
        borderRadius: '28px',
        // Fine pink border
        border: index === 0 ? '2px solid rgba(236, 72, 153, 0.95)' : '1px solid rgba(100, 116, 139, 0.15)',
        boxShadow: index === 0 
          ? `
            0 0 3px rgba(236, 72, 153, 1),
            0 0 12px rgba(236, 72, 153, 0.95),
            0 0 25px rgba(236, 72, 153, 0.8),
            0 0 50px rgba(236, 72, 153, 0.5),
            0 0 90px rgba(236, 72, 153, 0.25),
            inset 0 0 25px rgba(0, 0, 0, 0.06),
            inset 0 0 120px rgba(255, 255, 255, 0.12)
          `
          : '0 8px 32px rgba(0,0,0,0.3)',
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
        filter: stackBlur > 0 ? `blur(${stackBlur}px)` : 'none',
      }}
    >
      {/* Subtle diagonal reflection for frosted glass */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '-40%',
        width: '180%',
        height: '180%',
        background: 'linear-gradient(135deg, transparent 0%, transparent 22%, rgba(255,255,255,0.65) 40%, rgba(255,255,255,0.3) 60%, transparent 78%, transparent 100%)',
        pointerEvents: 'none',
        transform: 'rotate(0deg)',
        zIndex: 1,
      }} />

      {/* Top bright edge highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Swipe feedback left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%',
        background: `linear-gradient(90deg, rgba(239,68,68,${isSwipingLeft ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '24px',
        zIndex: 3,
      }}>
        <span style={{ fontSize: '48px', opacity: isSwipingLeft ? swipeProgress : 0, color: '#ef4444' }}>✗</span>
      </div>

      {/* Swipe feedback right */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
        background: `linear-gradient(-90deg, rgba(16,185,129,${isSwipingRight ? swipeProgress * 0.4 : 0}) 0%, transparent 100%)`,
        pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px',
        zIndex: 3,
      }}>
        <span style={{ fontSize: '48px', opacity: isSwipingRight ? swipeProgress : 0, color: '#10b981' }}>✓</span>
      </div>

      {/* Content wrapper - positioned above reflection */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Character */}
        <div style={{ 
          fontSize: 'clamp(100px, 28vw, 170px)', 
          fontWeight: '200', 
          lineHeight: 1, 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '24px',
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {character}
        </div>

        {/* Romaji - very large and bright */}
        {(card.shownRomaji || card.romaji) && (
          <div style={{ 
            fontSize: '44px', 
            color: '#ff1493', 
            fontWeight: '700', 
            letterSpacing: '10px', 
            textTransform: 'lowercase',
            textShadow: '0 0 40px rgba(255, 20, 147, 0.7), 0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {card.shownRomaji || card.romaji}
          </div>
        )}
      </div>
    </div>
  )
}
