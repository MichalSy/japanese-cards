import { useEffect, useState, useRef } from 'react'
import { fetchGroupData, fetchAllItemsFromCategory } from '../../config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCardPro from './SwipeCardPro'
import ProHeaderBar from '../../components/ProHeaderBar'

export default function SwipeGamePro({ contentType, groupId, cardCount }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimeoutRef = useRef(null)
  const buttonClickRef = useRef(null)

  const game = useSwipeGame(items, cardCount, contentType)
  
  const handleSwipeWithToast = (isCorrect, direction, correctRomaji, character) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    
    setToast({ isCorrect, correctRomaji, character, id: Date.now() })
    setToastVisible(true)
    
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false)
      toastTimeoutRef.current = setTimeout(() => setToast(null), 300)
    }, 2500)
    
    game.handleSwipe(isCorrect, direction)
  }

  const handleButtonClick = (isCorrect) => {
    if (buttonClickRef.current) buttonClickRef.current(isCorrect)
  }
  
  useEffect(() => () => { if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current) }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = groupId === 'all' 
          ? await fetchAllItemsFromCategory(contentType)
          : await fetchGroupData(contentType, groupId)
        setItems(data.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [contentType, groupId])

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', backgroundColor: '#0f172a', color: 'rgba(255,255,255,0.6)' }}>Laden...</div>
  }

  if (error) {
    return <div style={{ padding: '20px', minHeight: '100dvh', backgroundColor: '#0f172a' }}><div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: '#ef4444' }}>Fehler: {error}</div></div>
  }

  if (game.gameState === 'finished') {
    const total = game.stats.correct + game.stats.incorrect
    const pct = total > 0 ? Math.round((game.stats.correct / total) * 100) : 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', backgroundColor: '#0f172a', backgroundImage: 'url(/japanese-cards/images/swipe-bg.png)', backgroundSize: 'cover' }}>
        <ProHeaderBar title="Ergebnis" />
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(236,72,153,0.2)', padding: '32px 24px', textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: '0 0 24px' }}>Spiel beendet! 🎉</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
              <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Richtig</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#10b981', margin: '8px 0 0' }}>{game.stats.correct}/{total}</p></div>
              <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Prozent</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#ec4899', margin: '8px 0 0' }}>{pct}%</p></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = (game.currentIndex / game.totalCards) * 100

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100dvh',
      height: '100dvh',
      maxHeight: '100dvh',
      overflow: 'hidden', 
      backgroundColor: '#0f172a', 
      backgroundImage: 'url(/japanese-cards/images/swipe-bg.png)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}>
      
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <ProHeaderBar title="Swipe Game" />
      </div>

      {/* Question */}
      <div style={{ flexShrink: 0, textAlign: 'center', padding: '4px 20px 12px' }}>
        <span style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}>Ist die Kombination richtig?</span>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '120px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, opacity: toastVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', backgroundColor: toast.isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{toast.isCorrect ? '✓' : '✗'}</span>
            <span style={{ fontSize: '17px', fontWeight: '600', color: 'white' }}>{toast.character} = {toast.correctRomaji}</span>
          </div>
        </div>
      )}

      {/* Card Area - flex grow */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', minHeight: 0, overflow: 'hidden' }}>
        {game.cardStack.map((card, idx) => (
          <SwipeCardPro
            key={`${game.currentIndex + idx}`}
            card={card}
            index={idx}
            isActive={idx === 0}
            onSwipe={handleSwipeWithToast}
            correctAnswer={idx === 0 ? game.correctAnswer : undefined}
            onButtonClick={idx === 0 ? buttonClickRef : undefined}
          />
        ))}
      </div>

      {/* Bottom Section - fixed at bottom */}
      <div style={{ flexShrink: 0, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Progress */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.6)' }}>{game.currentIndex + 1}/{game.totalCards}</span>
        </div>
        
        <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #ec4899, #d946ef)', borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>

        {/* Buttons - matching design */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Falsch Button */}
          <button
            onClick={() => handleButtonClick(false)}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              color: '#f87171',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.15), 0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ 
              width: '26px', 
              height: '26px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}>✗</span>
            <span>Falsch</span>
          </button>

          {/* Richtig Button */}
          <button
            onClick={() => handleButtonClick(true)}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              color: '#34d399',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ 
              width: '26px', 
              height: '26px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}>✓</span>
            <span>Richtig</span>
          </button>
        </div>
      </div>
    </div>
  )
}
