'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { fetchGroupData, fetchAllItemsFromCategory, fetchCategoryConfig } from '@/config/api'
import { useT } from '@/components/I18nContext'
import { useSwipeGame } from './useSwipeGame'
import SwipeCardPro from './SwipeCardPro'

function HelpModal({ items, onClose, t }) {
  // Group items by group_name
  const groups = []
  const seen = new Map()
  for (const item of items) {
    const name = item.group_name || '—'
    if (!seen.has(name)) { seen.set(name, []); groups.push({ name, items: seen.get(name) }) }
    seen.get(name).push(item)
  }

  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  return (
    <div
      onClick={handleClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '75vh', background: 'linear-gradient(180deg, rgba(28,16,60,0.98) 0%, rgba(12,8,34,0.99) 100%)', borderRadius: '20px 20px 0 0', border: '1px solid rgba(255,255,255,0.12)', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 16px)', transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 20px 16px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>{t('game.charsInGame')}</span>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '22px', lineHeight: 1, padding: '4px' }}>✕</button>
        </div>

        {groups.map(({ name, items: groupItems }) => (
          <div key={name} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 20px 8px' }}>
              {name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', padding: '0 16px' }}>
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

export default function SwipeGamePro({ contentType, groupId, cardCount, onGameEnd }) {
  const t = useT()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [nextGroupId, setNextGroupId] = useState(null)
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

  // Notify parent + determine next group when game ends
  useEffect(() => {
    if (game.gameState !== 'finished') return
    onGameEnd?.()
    if (groupId === 'all') return
    fetchCategoryConfig(contentType)
      .then(config => {
        const groups = config.groups || []
        const idx = groups.findIndex(g => g.id === groupId)
        if (idx >= 0 && idx < groups.length - 1) setNextGroupId(groups[idx + 1].id)
      })
      .catch(() => {})
  }, [game.gameState])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>{t('loading')}</div>
  )
  if (error) return (
    <div style={{ flex: 1, padding: '20px' }}>
      <div style={{ padding: '20px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '16px', color: '#ef4444' }}>{t('error')}: {error}</div>
    </div>
  )

  if (game.gameState === 'finished') {
    const total = game.stats.correct + game.stats.incorrect
    const pct = total > 0 ? Math.round((game.stats.correct / total) * 100) : 0
    const btn = (label, onClick, primary = false) => (
      <button onClick={onClick} style={{
        padding: primary ? '14px 24px' : '11px 20px',
        borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: '700',
        fontSize: primary ? '16px' : '14px', transition: 'all 0.2s',
        background: primary ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(255,255,255,0.08)',
        color: 'white',
        boxShadow: primary ? '0 4px 16px rgba(236,72,153,0.35)' : 'none',
        flex: primary ? undefined : 1,
      }}>{label}</button>
    )
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(236,72,153,0.2)', padding: '32px 24px', textAlign: 'center', gap: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: 0 }}>{t('game.finished')}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t('game.correct')}</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#10b981', margin: '8px 0 0' }}>{game.stats.correct}/{total}</p></div>
            <div><p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t('game.percent')}</p><p style={{ fontSize: '36px', fontWeight: '700', color: '#ec4899', margin: '8px 0 0' }}>{pct}%</p></div>
          </div>
        </div>

        {/* Primary action: next group (if available) */}
        {nextGroupId && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {btn(t('game.nextGroup'), () => router.push(`/content/${contentType}/${nextGroupId}`), true)}
          </div>
        )}

        {/* Secondary actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {btn(t('game.playAgain'), () => router.push(`/content/${contentType}/${groupId}`))}
          {btn(t('game.toCategory'), () => router.push(`/content/${contentType}`))}
          {btn(t('game.toHome'), () => router.push('/'))}
        </div>
      </div>
    )
  }

  const progress = (game.currentIndex / game.totalCards) * 100

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {showHelp && <HelpModal items={items} onClose={() => setShowHelp(false)} t={t} />}

      {toast && (
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, opacity: toastVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', backgroundColor: toast.isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{toast.isCorrect ? '✓' : '✗'}</span>
            <span style={{ fontSize: '17px', fontWeight: '600', color: 'white' }}>{toast.native} = {toast.correctTransliteration}</span>
          </div>
        </div>
      )}

      {/* Titel-Zone */}
      <div style={{ flex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12px', minHeight: 0 }}>
        <span style={{ fontSize: '19px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          {t('game.question')}
        </span>
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
      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px' }}>
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

        {/* Hilfe-Button unter den Swipe-Buttons */}
        <button
          onClick={() => setShowHelp(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '7px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          {t('game.lookup')}
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ flexShrink: 0, height: 'calc(3px + env(safe-area-inset-bottom, 0px))', backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '3px', width: `${progress}%`, background: 'linear-gradient(90deg, #ec4899, #a855f7)', transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 0 6px rgba(236,72,153,0.6)' }} />
      </div>
    </div>
  )
}
