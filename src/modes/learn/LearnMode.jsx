'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LearnCardCharacter from './LearnCardCharacter'
import LearnCardInfo from './LearnCardInfo'
import LearnCardQuiz from './LearnCardQuiz'

function CardWrapper({ children, entering, direction }) {
  return (
    <div style={{
      width: '100%',
      animation: entering
        ? `slideIn${direction === 'forward' ? 'Right' : 'Left'} 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both`
        : undefined,
    }}>
      {children}
    </div>
  )
}

export default function LearnMode({ lesson, course, cards, lang }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [animDir, setAnimDir] = useState('forward')
  const [animKey, setAnimKey] = useState(0)

  const dragRef = useRef(null)
  const card = cards[index]
  const total = cards.length
  const progress = ((index) / total) * 100

  const goTo = useCallback((newIndex, dir) => {
    if (newIndex < 0 || newIndex > total) return
    setAnimDir(dir)
    setAnimKey(k => k + 1)
    setIndex(newIndex)
  }, [total])

  const canAdvance = card?.card_type !== 'quiz_4_option' || quizAnswers[index] != null

  const handleNext = () => {
    if (index >= total) return
    if (!canAdvance) return
    if (index === total - 1) {
      router.back()
      return
    }
    goTo(index + 1, 'forward')
  }

  const handlePrev = () => {
    if (index === 0) { router.back(); return }
    goTo(index - 1, 'backward')
  }

  // Touch / mouse drag
  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false }
  }

  const onPointerUp = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    dragRef.current = null
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) handleNext()
    else handlePrev()
  }

  const renderCard = () => {
    if (!card) return null
    if (card.card_type === 'character') return <LearnCardCharacter card={card} lang={lang} />
    if (card.card_type === 'info') return <LearnCardInfo card={card} lang={lang} />
    if (card.card_type === 'quiz_4_option') return (
      <LearnCardQuiz
        card={card}
        lang={lang}
        answer={quizAnswers[index] ?? null}
        onAnswer={i => setQuizAnswers(prev => ({ ...prev, [index]: i }))}
      />
    )
    return <LearnCardCharacter card={card} lang={lang} />
  }

  const isLast = index === total - 1

  return (
    <>
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'linear-gradient(160deg,#0c0820 0%,#1a0a3a 50%,#0a0e28 100%)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: '12px', paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}
          >
            ←
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{course.name} · {index + 1}/{total}</div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg,#ec4899,#a855f7)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ flexShrink: 0, padding: '4px 20px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>{lesson.title}</div>
        </div>

        {/* Card area */}
        <div
          style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', cursor: 'grab' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <div
              key={animKey}
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '28px',
                padding: '32px 24px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                animation: `${animDir === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both`,
              }}
            >
              {renderCard()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: '12px 20px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', display: 'flex', gap: '12px' }}>
          {index > 0 && (
            <button
              onClick={handlePrev}
              style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}
            >
              ←
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance}
            style={{
              flex: 1, padding: '14px', borderRadius: '100px', border: 'none',
              background: canAdvance ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(255,255,255,0.08)',
              color: canAdvance ? 'white' : 'rgba(255,255,255,0.3)',
              fontSize: '16px', fontWeight: '700', cursor: canAdvance ? 'pointer' : 'default',
              boxShadow: canAdvance ? '0 4px 16px rgba(236,72,153,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {isLast ? 'Fertig ✓' : 'Weiter →'}
          </button>
        </div>
      </div>
    </>
  )
}
