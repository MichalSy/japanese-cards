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

  // Stack styling - side-by-side offset like reference design
  const stackXOffset = index === 0 ? 0 : (index % 2 === 0 ? 20 : -20) // Left/right offset
  const stackYOffset = index * 3
  const stackScale = 1 - (index * 0.01)
  const stackOpacity = index === 0 ? 1 : Math.max(0.45, 0.7 - (index * 0.08))
  const stackBlur = index === 0 ? 0 : index * 0.8

  return (
    // OUTER CONTAINER: Gestures + Transforms + Neon Border + Padding Gap
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
        // Centering logic
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${position.x}px, ${stackYOffset}px) rotate(${position.rotation}deg) scale(${stackScale})`,

        width: 'calc(100% - 48px)',
        maxWidth: '276px',
        aspectRatio: '9/12',

        // --- 1. THE OUTER NEON BORDER + GAP ---
        // This container is TRANSPARENT but has the neon border and padding
        backgroundColor: 'transparent',
        padding: '6px', // THE TRANSPARENT GAP
        borderRadius: '34px', // Outer radius (inner + gap)

        // The Neon Border - ONLY for the top card (index === 0)
        border: index === 0
          ? '2px solid rgba(236, 72, 153, 1)'
          : '1px solid rgba(255, 255, 255, 0.1)', // Subtle border for stack cards

        boxShadow: index === 0 ? `
          0 0 15px rgba(236, 72, 153, 0.8), /* Inner/Outer Glow around the line */
          0 0 40px rgba(236, 72, 153, 0.4), /* Outer Glow */
          0 10px 40px rgba(0, 0, 0, 0.5)    /* Strong Drop Shadow for depth */
        ` : '0 4px 12px rgba(0, 0, 0, 0.3)', // Simple shadow for stack

        zIndex: 100 - index,
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: getTransition(),
        willChange: 'transform, opacity',
        opacity: swipeState === 'exit' ? 0 : stackOpacity,
        userSelect: 'none',
        overflow: 'visible', // Allow glow to spill out
        touchAction: 'none',
        filter: stackBlur > 0 ? `blur(${stackBlur}px)` : 'none',
        boxSizing: 'border-box', // Padding included in width/height?
        // Actually, if we add padding, we might change size.
        // Let's keep box-sizing border-box so the card size stays consistent.
      }}
    >
      {/* --- 2. THE INNER CARD CONTENT --- */}
      {/* This fills the padded area. The gap is the padding of the parent. */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '26px', // Inner radius matches outer-gap
        
        // SVG Frosted Glass Background
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 300 400%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cdefs%3E%3Cfilter id=%27frostedGlass%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.02%27 numOctaves=%274%27 result=%27noise%27 seed=%272%27 /%3E%3CfeDisplacementMap in=%27SourceGraphic%27 in2=%27noise%27 scale=%2715%27 xChannelSelector=%27R%27 yChannelSelector=%27G%27 /%3E%3CfeGaussianBlur in=%27SourceGraphic%27 stdDeviation=%278%27 result=%27blurred%27 /%3E%3CfeBlend in=%27blurred%27 in2=%27SourceGraphic%27 mode=%27screen%27 /%3E%3C/filter%3E%3ClinearGradient id=%27shimmerGradient%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:rgba%28255,255,255,0.3%29;stop-opacity:0%27 /%3E%3Cstop offset=%2720%25%27 style=%27stop-color:rgba%28255,255,255,0.4%29;stop-opacity:1%27 /%3E%3Cstop offset=%2780%25%27 style=%27stop-color:rgba%28255,255,255,0.2%29;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:rgba%28255,255,255,0%29;stop-opacity:0%27 /%3E%3C/linearGradient%3E%3CradialGradient id=%27cardGradient%27 cx=%2750%25%27 cy=%2730%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:rgba%28120,120,160,0.7%29;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:rgba%2860,60,90,0.85%29;stop-opacity:1%27 /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=%27300%27 height=%27400%27 fill=%27url%28%23cardGradient%29%27 filter=%27url%28%23frostedGlass%29%27 /%3E%3Crect width=%27300%27 height=%27400%27 fill=%27url%28%23shimmerGradient%29%27 opacity=%270.4%27 transform=%27skewX%28-20%29%27 /%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
        // Fallback solid color + blur
        backgroundColor: 'rgba(150, 150, 180, 0.85)',
        backdropFilter: 'blur(30px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
        
        // Subtle inner glow
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3)',
        
        // Crisp inner edge
        border: '1px solid rgba(255,255,255,0.3)',
        
        overflow: 'hidden', // Clip content (stripes etc) to inner radius
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Large glass reflection stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}></div>

        {/* Swipe feedback left */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%',
          background: `linear-gradient(90deg, rgba(239,68,68,${isSwipingLeft ? swipeProgress * 0.25 : 0}) 0%, transparent 100%)`,
          pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '24px',
          zIndex: 1,
        }}>
          <span style={{ fontSize: '44px', opacity: isSwipingLeft ? swipeProgress : 0, color: 'white', fontWeight: '700' }}>✗</span>
        </div>

        {/* Swipe feedback right */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
          background: `linear-gradient(-90deg, rgba(16,185,129,${isSwipingRight ? swipeProgress * 0.25 : 0}) 0%, transparent 100%)`,
          pointerEvents: 'none', transition: isDragging ? 'none' : 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px',
          zIndex: 1,
        }}>
          <span style={{ fontSize: '44px', opacity: isSwipingRight ? swipeProgress : 0, color: 'white', fontWeight: '700' }}>✓</span>
        </div>

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Character */}
          <div style={{
            fontSize: 'clamp(100px, 28vw, 170px)',
            fontWeight: '300',
            lineHeight: 1,
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {character}
          </div>

          {/* Romaji */}
          {(card.shownRomaji || card.romaji) && (
            <div style={{
              fontSize: '40px',
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'lowercase',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}>
              {card.shownRomaji || card.romaji}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
