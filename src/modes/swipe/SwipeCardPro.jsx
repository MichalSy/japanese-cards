'use client'

import { useState, useEffect, useCallback } from 'react'

export default function SwipeCardPro({ card, index, isActive, onSwipe, correctAnswer, onButtonClick }) {
  const [swipeState, setSwipeState] = useState(null)
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, rotation: 0 })
  const [resultFlash, setResultFlash] = useState(null) // 'correct' | 'incorrect' | null

  const character = card?.native || ''

  const triggerSwipe = useCallback((swipedRight) => {
    if (!card || swipeState === 'exit' || swipeState === 'result') return
    const isCorrect = swipedRight === correctAnswer
    const direction = swipedRight ? 'right' : 'left'

    // Brief color flash before exit
    setSwipeState('result')
    setResultFlash(isCorrect ? 'correct' : 'incorrect')

    setTimeout(() => {
      setSwipeState('exit')
      setPosition({ x: direction === 'right' ? 300 : -300, rotation: direction === 'right' ? 10 : -10 })
      setTimeout(() => { onSwipe(isCorrect, direction, card.correctTransliteration, character) }, 220)
    }, 300)
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

  const isLocked = swipeState === 'result' || swipeState === 'exit'

  const handleDragStart = (e) => {
    if (!isActive || isLocked) return
    e.preventDefault()
    setIsDragging(true)
    setSwipeState('swiping')
    setDragStart(e.touches ? e.touches[0].clientX : e.clientX)
  }

  const handleDragMove = (e) => {
    if (!isActive || !isDragging) return
    e.preventDefault()
    const diff = (e.touches ? e.touches[0].clientX : e.clientX) - dragStart
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

  const stackYOffset = index * 3
  const stackScale = 1 - (index * 0.01)
  const stackOpacity = index === 0 ? 1 : Math.max(0.45, 0.7 - (index * 0.08))
  const stackBlur = index === 0 ? 0 : index * 0.8

  const flashColor = resultFlash === 'correct'
    ? 'rgba(16,185,129,0.45)'
    : resultFlash === 'incorrect'
    ? 'rgba(239,68,68,0.45)'
    : null

  return (
    <div
      onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}
      onMouseDown={handleDragStart} onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd} onMouseLeave={isDragging ? handleDragEnd : undefined}
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) translate(${position.x}px, ${stackYOffset}px) rotate(${position.rotation}deg) scale(${stackScale})`,
        width: 'calc(100% - 48px)', maxWidth: '276px', aspectRatio: '9/12',
        backgroundColor: 'transparent', padding: '6px', borderRadius: '34px',
        border: index === 0 ? '2px solid rgba(236,72,153,1)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: index === 0
          ? '0 0 15px rgba(236,72,153,0.8), 0 0 40px rgba(236,72,153,0.4), 0 10px 40px rgba(0,0,0,0.5)'
          : '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(), willChange: 'transform, opacity',
        opacity: swipeState === 'exit' ? 0 : stackOpacity,
        userSelect: 'none', overflow: 'visible', touchAction: 'none',
        filter: stackBlur > 0 ? `blur(${stackBlur}px)` : 'none',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%', height: '100%', position: 'relative', borderRadius: '26px',
        background: 'linear-gradient(160deg, rgba(28,16,60,1) 0%, rgba(12,8,34,1) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.10)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Glass top-sheen */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '45%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        {/* Bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(0deg, rgba(236,72,153,0.08) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Result flash overlay */}
        {flashColor && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
            background: flashColor,
            borderRadius: '26px',
            transition: 'opacity 0.15s ease-in',
          }} />
        )}

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(100px, 28vw, 170px)', fontWeight: '300', lineHeight: 1, color: 'white', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {character}
          </div>
        </div>
      </div>
    </div>
  )
}
