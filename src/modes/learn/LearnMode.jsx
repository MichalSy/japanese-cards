'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter } from '@/components/Layout'
import LearnCardCharacter from './LearnCardCharacter'
import LearnCardInfo from './LearnCardInfo'
import LearnCardQuiz from './LearnCardQuiz'

export default function LearnMode({ lesson, course, cards, lang }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [animDir, setAnimDir] = useState('forward')
  const [animKey, setAnimKey] = useState(0)

  const dragRef = useRef(null)
  const card = cards[index]
  const total = cards.length
  const progress = (index / total) * 100

  const goTo = useCallback((newIndex, dir) => {
    if (newIndex < 0 || newIndex > total) return
    setAnimDir(dir)
    setAnimKey(k => k + 1)
    setIndex(newIndex)
  }, [total])

  const canAdvance = card?.card_type !== 'quiz_4_option' || quizAnswers[index] != null

  const handleNext = () => {
    if (!canAdvance) return
    if (index === total - 1) { router.back(); return }
    goTo(index + 1, 'forward')
  }

  const handlePrev = () => {
    if (index === 0) { router.back(); return }
    goTo(index - 1, 'backward')
  }

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY }
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

  return (
    <>
      <style>{`
        @keyframes learnSlideRight { from { opacity:0; transform:translateX(32px) } to { opacity:1; transform:translateX(0) } }
        @keyframes learnSlideLeft  { from { opacity:0; transform:translateX(-32px) } to { opacity:1; transform:translateX(0) } }
      `}</style>

      <AppLayout>
        <AppHeader>
          <AppHeaderBar title={lesson.title} />
        </AppHeader>

        {/* Progress bar + counter */}
        <div style={{ flexShrink: 0, padding: '0 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>{course.name}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>{index + 1} / {total}</span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '3px', background: 'linear-gradient(90deg,#ec4899,#a855f7)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <AppContent>
          <div
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100%', cursor: 'grab' }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div
              key={animKey}
              className="card"
              style={{
                width: '100%',
                animation: `${animDir === 'forward' ? 'learnSlideRight' : 'learnSlideLeft'} 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both`,
              }}
            >
              {renderCard()}
            </div>
          </div>
        </AppContent>

        <AppFooter>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
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
              {index === total - 1 ? 'Fertig ✓' : 'Weiter →'}
            </button>
          </div>
        </AppFooter>
      </AppLayout>
    </>
  )
}
