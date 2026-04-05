'use client'

import { useEffect, useState, useRef } from 'react'
import { fetchGroupData, fetchAllItemsFromCategory } from '@/config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCardPro from './SwipeCardPro'
import ProHeaderBar from '@/components/ProHeaderBar'

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

  const bgStyle = {
    background: `
      radial-gradient(circle at 15% 10%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 85% 95%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 25%, #0f172a 50%, #0d1e3f 100%)
    `,
    backgroundAttachment: 'fixed',
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', ...bgStyle, color: 'rgba(255,255,255,0.6)' }}>Laden...</div>
  if (error) return <div style={{ padding: '20px', minHeight: '100dvh', ...bgStyle }}><div style={{ padding: '20px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '16px', color: '#ef4444' }}>Fehler: {error}</div></div>

  if (game.gameState === 'finished') {
    const total = game.stats.correct + game.stats.incorrect
    const pct = total > 0 ? Math.round((game.stats.correct / total) * 100) : 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', ...bgStyle }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', overflow: 'auto', ...bgStyle }}>
      <div style={{ flexShrink: 0 }}>
        <ProHeaderBar title="Swipe Game" />
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: '120px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, opacity: toastVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', backgroundColor: toast.isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{toast.isCorrect ? '✓' : '✗'}</span>
            <span style={{ fontSize: '17px', fontWeight: '600', color: 'white' }}>{toast.character} = {toast.correctRomaji}</span>
          </div>
        </div>
      )}

      {/* Titel + Progress + Card zusammen zentriert */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', minHeight: 0 }}>
        <span style={{ fontSize: '19px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginBottom: '10px', letterSpacing: '0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          Ist die Kombination richtig?
        </span>

        {/* Progress zwischen Titel und Card — schmal */}
        <div style={{ width: '160px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, #ec4899, #a855f7)',
              borderRadius: '2px',
              transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 0 6px rgba(236,72,153,0.6)',
            }} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
            {game.currentIndex + 1}/{game.totalCards}
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '290px', aspectRatio: '9/12', flexShrink: 0 }}>
          {game.cardStack.map((card, idx) => (
            <SwipeCardPro
              key={`${game.currentIndex + idx}`}
              card={card} index={idx} isActive={idx === 0}
              onSwipe={handleSwipeWithToast}
              correctAnswer={idx === 0 ? game.correctAnswer : undefined}
              onButtonClick={idx === 0 ? buttonClickRef : undefined}
            />
          ))}
        </div>
      </div>

      {/* Bubble-Buttons — nah an der Card */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '48px',
        padding: '12px 24px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 16px))',
      }}>
        {[
          { isCorrect: false, icon: '✕', r: 255, g: 59,  b: 48  },
          { isCorrect: true,  icon: '✓', r: 52,  g: 199, b: 89  },
        ].map(({ isCorrect, icon, r, g, b }) => (
          <button
            key={icon}
            onClick={() => handleButtonClick(isCorrect)}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              /* Glass wie die Card: dunkle Basis + Farb-Tint, inset highlights */
              background: `linear-gradient(160deg, rgba(${r},${g},${b},0.20) 0%, rgba(${r},${g},${b},0.08) 100%)`,
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: `1px solid rgba(${r},${g},${b},0.25)`,
              boxShadow: [
                `inset 0 1px 0 rgba(255,255,255,0.18)`,  /* obere Glas-Kante */
                `inset 0 -1px 0 rgba(0,0,0,0.15)`,        /* untere Kante */
                `0 2px 8px rgba(0,0,0,0.20)`,              /* kein starker 3D-Glow */
              ].join(', '),
              color: `rgb(${r},${g},${b})`,
              fontSize: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.16s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.16s ease',
              flexShrink: 0,
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  )
}
