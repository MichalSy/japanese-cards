import { useState, useEffect, useMemo } from 'react'

export default function SwipeCard({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null) // null, swiping, correct, incorrect
  const [showCorrection, setShowCorrection] = useState(false) // Show correction when wrong
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [rotateZ, setRotateZ] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [flashOpacity, setFlashOpacity] = useState(0)

  if (!card) return null

  // Handle Touch + Mouse drag
  const handleDragStart = (e) => {
    if (!isActive || swipeState) return
    setIsDragging(true)
    setDragStart(e.touches ? e.touches[0].clientX : e.clientX)
  }

  const handleDragMove = (e) => {
    if (!isActive || swipeState || !isDragging) return
    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = currentX - dragStart
    const maxDiff = 150

    if (Math.abs(diff) > 20) {
      setRotateZ((diff / maxDiff) * 15)
      setTranslateX(diff)
    }
  }

  const handleDragEnd = async () => {
    if (!isActive) return
    setIsDragging(false)

    const threshold = 80
    const isSwipedLeft = translateX < -threshold
    const isSwipedRight = translateX > threshold

    if (isSwipedLeft || isSwipedRight) {
      await triggerResponse(isSwipedRight)
    } else {
      // Snap back
      setRotateZ(0)
      setTranslateX(0)
    }
  }

  // Handle Button Click
  const handleButtonClick = async (isCorrect) => {
    if (!isActive || swipeState) return
    await triggerResponse(isCorrect)
  }

  const triggerResponse = async (userThinkCorrect) => {
    if (!isActive) return
    
    const isCorrect = userThinkCorrect === correctAnswer
    
    // Flash animation
    setSwipeState(isCorrect ? 'correct' : 'incorrect')
    setFlashOpacity(1)
    
    // If wrong: Show correction
    if (!isCorrect) {
      // Wait for flash to be visible (200ms)
      await new Promise(resolve => setTimeout(resolve, 200))
      // Now show the correction text
      setShowCorrection(true)
      setFlashOpacity(0.3) // Keep red overlay visible but lighter
      // Wait 1.5 seconds total for correction to be visible
      await new Promise(resolve => setTimeout(resolve, 1500))
    } else {
      // Correct answer: fade out flash quickly
      await new Promise(resolve => {
        setTimeout(() => {
          setFlashOpacity(0)
        }, 200)
        setTimeout(resolve, 300)
      })
    }
    
    // Animate out
    setTranslateX(userThinkCorrect ? 500 : -500)
    setRotateZ(userThinkCorrect ? 45 : -45)
    setOpacity(0)
    
    // Wait for animation then call callback
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onSwipe(isCorrect, userThinkCorrect ? 'right' : 'left')
  }

  const getBackgroundColor = () => {
    return 'var(--color-surface)'
  }

  const getFlashColor = () => {
    if (swipeState === 'correct') return 'rgba(16, 185, 129, 0.8)' // Green
    if (swipeState === 'incorrect') return 'rgba(239, 68, 68, 0.8)' // Red
    return 'transparent'
  }

  const getZIndex = () => {
    return 100 - index
  }

  const getOffset = () => {
    // Cards exactly behind each other - no stack visual
    return 0
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
          translateX(calc(-50% + ${translateX}px))
          translateY(-50%)
          rotateZ(${rotateZ}deg)
        `,
        width: '90%',
        maxWidth: '420px',
        height: '580px',
        backgroundColor: getBackgroundColor(),
        borderRadius: '32px',
        border: '1px solid var(--color-surface-light)',
        zIndex: getZIndex(),
        cursor: isActive && !isDragging ? 'grab' : isDragging ? 'grabbing' : 'default',
        transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        opacity: opacity,
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        touchAction: 'none',
      }}
    >
      {/* Flash overlay */}
      {swipeState && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: getFlashColor(),
            opacity: flashOpacity,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '32px',
          }}
        />
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

        {/* Bottom Section: Buttons or Correction */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: '100%',
          gap: 'var(--spacing-4)',
          flexDirection: showCorrection ? 'column' : 'row',
          alignItems: 'center',
          minHeight: '90px',
        }}>
          {/* Show correction when wrong answer and they're different */}
          {showCorrection && swipeState === 'incorrect' && card.correctRomaji && card.correctRomaji !== card.shownRomaji && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: '0 var(--spacing-4)',
              width: '100%',
              animation: 'fadeIn 0.3s ease-in',
              pointerEvents: 'none',
              zIndex: 20,
            }}>
              {/* Wrong answer struck through */}
              <div style={{
                fontSize: '18px',
                color: '#ef4444',
                textDecoration: 'line-through',
                opacity: 0.7,
                fontWeight: '600',
              }}>
                ✗ {card.shownRomaji}
              </div>
              {/* Correct answer in green */}
              <div style={{
                fontSize: '24px',
                color: '#10b981',
                fontWeight: '700',
                letterSpacing: '0.5px',
                fontStyle: 'italic',
              }}>
                ✓ Richtig: {card.correctRomaji}
              </div>
            </div>
          )}

          {/* Show "actually correct" when they were wrong but it was right */}
          {showCorrection && swipeState === 'incorrect' && card.correctRomaji && card.correctRomaji === card.shownRomaji && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: '0 var(--spacing-4)',
              width: '100%',
              animation: 'fadeIn 0.3s ease-in',
              pointerEvents: 'none',
              zIndex: 20,
            }}>
              <div style={{
                fontSize: '20px',
                color: '#10b981',
                fontWeight: '700',
                letterSpacing: '0.5px',
              }}>
                Das war eigentlich richtig! ✓
              </div>
              <div style={{
                fontSize: '24px',
                color: '#10b981',
                fontWeight: '700',
                letterSpacing: '0.5px',
                fontStyle: 'italic',
              }}>
                {card.correctRomaji}
              </div>
            </div>
          )}

          {/* Show buttons when no correction needed */}
          {!showCorrection && (
            <>
              {/* Left Button - Falsch */}
          <button
            onClick={() => handleButtonClick(false)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-4) var(--spacing-3)',
              borderRadius: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            ←
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>Falsch</span>
          </button>

          {/* Right Button - Richtig */}
          <button
            onClick={() => handleButtonClick(true)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: 'var(--spacing-4) var(--spacing-3)',
              borderRadius: '20px',
              backgroundColor: 'rgba(236, 72, 153, 0.2)',
              border: '2px solid rgba(236, 72, 153, 0.4)',
              color: '#ec4899',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(236, 72, 153, 0.3)'
              e.target.style.borderColor = 'rgba(236, 72, 153, 0.6)'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(236, 72, 153, 0.2)'
              e.target.style.borderColor = 'rgba(236, 72, 153, 0.4)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            →
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>Richtig</span>
          </button>
            </>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
