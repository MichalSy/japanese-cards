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

      {/* Text + Card zusammen vertikal zentriert */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px', minHeight: 0 }}>
        <span style={{ fontSize: '19px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginBottom: '18px', letterSpacing: '0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          Ist die Kombination richtig?
        </span>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', aspectRatio: '9/12', flexShrink: 0 }}>
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

      <div style={{ flexShrink: 0, padding: '12px 20px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 16px))' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #ec4899, #d946ef)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', minWidth: '42px', textAlign: 'right' }}>
            {game.currentIndex + 1}/{game.totalCards}
          </span>
        </div>
        {/* Buttons — Topbar-Style: pill, blur, inset glow */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { isCorrect: false, label: 'Falsch', icon: '✕', r: 255, g: 59,  b: 48  },
            { isCorrect: true,  label: 'Richtig', icon: '✓', r: 48,  g: 209, b: 88  },
          ].map(({ isCorrect, label, icon, r, g, b }) => (
            <button
              key={label}
              onClick={() => handleButtonClick(isCorrect)}
              style={{
                flex: 1,
                height: '56px',
                borderRadius: '100px',
                /* Zwei Background-Layer: weißer Schimmer oben + Farb-Tint */
                background: [
                  `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 55%)`,
                  `rgba(${r},${g},${b},0.10)`,
                ].join(', '),
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: `1px solid rgba(${r},${g},${b},0.28)`,
                boxShadow: [
                  `inset 0 1px 0 rgba(255,255,255,0.20)`,   /* obere Kante hell */
                  `inset 0 -1px 0 rgba(0,0,0,0.12)`,         /* untere Kante dunkel */
                  `inset 0 0 16px rgba(${r},${g},${b},0.10)`,/* subtiler Farb-Glow */
                  `0 4px 20px rgba(${r},${g},${b},0.20)`,    /* äußerer Schatten */
                  `0 1px 4px rgba(0,0,0,0.18)`,
                ].join(', '),
                color: `rgba(${r},${g},${b},0.95)`,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.14s cubic-bezier(0.34,1.56,0.64,1), opacity 0.1s',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                letterSpacing: '-0.01em',
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)'; e.currentTarget.style.opacity = '0.7' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
              onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.93)'; e.currentTarget.style.opacity = '0.7' }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: '700' }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
