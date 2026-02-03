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

  // Stack styling - make stacked cards more visible
  const stackOffset = index * 6
  const stackScale = 1 - (index * 0.02)
  const stackOpacity = index === 0 ? 1 : Math.max(0.5, 0.75 - (index * 0.12))
  const stackBlur = index === 0 ? 0 : index * 2

  return (
    <>
      {/* Outer glow ring - separate from card */}
      {index === 0 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translateX(calc(-50% + ${position.x}px)) translateY(-50%) rotate(${position.rotation}deg)`,
          width: 'calc(100% - 24px)',
          maxWidth: '360px',
          aspectRatio: '3/4',
          borderRadius: '32px',
          border: '3px solid rgba(236, 72, 153, 0.8)',
          boxShadow: `
            0 0 20px rgba(236, 72, 153, 0.9),
            0 0 40px rgba(236, 72, 153, 0.6),
            0 0 60px rgba(236, 72, 153, 0.4),
            0 0 80px rgba(236, 72, 153, 0.2),
            inset 0 0 30px rgba(236, 72, 153, 0.1)
          `,
          zIndex: 99,
          pointerEvents: 'none',
          transition: getTransition(),
          opacity: swipeState === 'exit' ? 0 : 1,
        }} />
      )}

      {/* Card */}
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
          background: 'linear-gradient(145deg, rgba(75, 85, 99, 0.7) 0%, rgba(55, 65, 81, 0.8) 50%, rgba(45, 55, 75, 0.85) 100%)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
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
          filter: stackBlur > 0 ? `blur(${Math.max(0, stackBlur - 1)}px)` : 'none',
        }}
      >
        {/* Diagonal glass reflection - more prominent */}
        <div style={{
          position: 'absolute',
          top: '-60%',
          left: '-60%',
          width: '220%',
          height: '220%',
          background: 'linear-gradient(135deg, transparent 0%, transparent 35%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.08) 55%, transparent 65%, transparent 100%)',
          pointerEvents: 'none',
          transform: 'rotate(0deg)',
        }} />

        {/* Top highlight shine */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
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
        <div style={{ 
          fontSize: 'clamp(90px, 25vw, 160px)', 
          fontWeight: '200', 
          lineHeight: 1, 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}>
          {character}
        </div>

        {/* Romaji - larger and more vibrant */}
        {(card.shownRomaji || card.romaji) && (
          <div style={{ 
            fontSize: '40px', 
            color: '#ff69b4', 
            fontWeight: '700', 
            letterSpacing: '8px', 
            textTransform: 'lowercase',
            textShadow: '0 0 30px rgba(255, 105, 180, 0.6), 0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {card.shownRomaji || card.romaji}
          </div>
        )}
      </div>
    </>
  )
}
