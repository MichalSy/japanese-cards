'use client'

import { useEffect, useState, useRef } from 'react'
import { fetchGroupData, fetchAllItemsFromCategory } from '@/config/api'
import { useSwipeGame } from './useSwipeGame'
import SwipeCardPro from './SwipeCardPro'

function HelpModal({ items, onClose }) {
  // Group items by group_name
  const groups = []
  const seen = new Map()
  for (const item of items) {
    const name = item.group_name || '—'
    if (!seen.has(name)) { seen.set(name, []); groups.push({ name, items: seen.get(name) }) }
    seen.get(name).push(item)
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '75vh', background: 'linear-gradient(180deg, rgba(28,16,60,0.98) 0%, rgba(12,8,34,0.99) 100%)', borderRadius: '20px 20px 0 0', border: '1px solid rgba(255,255,255,0.12)', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 20px 16px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Zeichen im Spiel</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '22px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {groups.map(({ name, items: groupItems }) => (
          <div key={name} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 20px 8px' }}>
              {name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', padding: '0 20px' }}>
              {groupItems.map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '300', color: 'white', lineHeight: 1.1 }}>{item.native}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '4px', letterSpacing: '0.5px' }}>{item.transliteration}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SwipeGamePro({ contentType, groupId, cardCount }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const toastTimeoutRef = useRef(null)
  const buttonClickRef = useRef(null)

  const game = useSwipeGame(items, cardCount, contentType)

  const handleSwipeWithToast = (isCorrect, direction, correctTransliteration, native) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ isCorrect, correctTransliteration, native, id: Date.now() })
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

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>Laden...</div>
  )
  if (error) return (
    <div style={{ flex: 1, padding: '20px' }}>
      <div style={{ padding: '20px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '16px', color: '#ef4444' }}>Fehler: {error}</div>
    </div>
  )

  if (game.gameState === 'finished') {
    const total = game.stats.correct + game.stats.incorrect
    const pct = total > 0 ? Math.round((game.stats.correct / total) * 100) : 0
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(236,72,153,0.2)', padding: '32px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: '0 0 24px' }}>Spiel beendet! 🎉</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Richtig</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#10b981', margin: '8px 0 0' }}>{game.stats.correct}/{total}</p></div>
            <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Prozent</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#ec4899', margin: '8px 0 0' }}>{pct}%</p></div>
          </div>
        </div>
      </div>
    )
  }

  const progress = (game.currentIndex / game.totalCards) * 100

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {showHelp && <HelpModal items={items} onClose={() => setShowHelp(false)} />}

      {toast && (
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, opacity: toastVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', backgroundColor: toast.isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{toast.isCorrect ? '✓' : '✗'}</span>
            <span style={{ fontSize: '17px', fontWeight: '600', color: 'white' }}>{toast.native} = {toast.correctTransliteration}</span>
          </div>
        </div>
      )}

      {/* Titel-Zone mit Info-Button */}
      <div style={{ flex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12px', minHeight: 0, position: 'relative' }}>
        <span style={{ fontSize: '19px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          Ist die Kombination richtig?
        </span>
        <button
          onClick={() => setShowHelp(true)}
          title="Alle Zeichen anzeigen"
          style={{ position: 'absolute', right: '16px', bottom: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '700', transition: 'background 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
        >?</button>
      </div>

      {/* Karte */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '290px', aspectRatio: '9/12' }}>
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

      {/* Button-Zone */}
      <div style={{ flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', minHeight: 0 }}>
        {[
          { isCorrect: false, icon: '✕', r: 255, g: 59,  b: 48  },
          { isCorrect: true,  icon: '✓', r: 52,  g: 199, b: 89  },
        ].map(({ isCorrect, icon, r, g, b }) => (
          <button
            key={icon}
            onClick={() => handleButtonClick(isCorrect)}
            style={{
              width: '84px', height: '84px', borderRadius: '50%',
              background: `linear-gradient(160deg, rgba(${r},${g},${b},0.20) 0%, rgba(${r},${g},${b},0.08) 100%)`,
              backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: `1px solid rgba(${r},${g},${b},0.25)`,
              boxShadow: [`inset 0 1px 0 rgba(255,255,255,0.18)`, `inset 0 -1px 0 rgba(0,0,0,0.15)`, `0 2px 8px rgba(0,0,0,0.20)`].join(', '),
              color: `rgb(${r},${g},${b})`, fontSize: '28px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.16s cubic-bezier(0.34,1.56,0.64,1)', flexShrink: 0,
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.88)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >{icon}</button>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ flexShrink: 0, height: 'calc(3px + env(safe-area-inset-bottom, 0px))', backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '3px', width: `${progress}%`, background: 'linear-gradient(90deg, #ec4899, #a855f7)', transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 0 6px rgba(236,72,153,0.6)' }} />
      </div>
    </div>
  )
}
