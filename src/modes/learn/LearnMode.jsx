'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter } from '@/components/Layout'
import LearnCardCharacter from './LearnCardCharacter'
import LearnCardInfo from './LearnCardInfo'
import LearnCardQuiz from './LearnCardQuiz'

export default function LearnMode({ lesson, course, cards, lang }) {
  const router = useRouter()
  const t = useT()
  const [index, setIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [animDir, setAnimDir] = useState('forward')
  const [animKey, setAnimKey] = useState(0)

  const dragRef = useRef(null)
  const card = cards[index]
  const total = cards.length
  const progress = (index / total) * 100
  const isQuiz = card?.card_type === 'quiz_4_option'
  const canAdvance = !isQuiz || quizAnswers[index] != null
  const isLast = index === total - 1

  const goTo = useCallback((newIndex, dir) => {
    if (newIndex < 0 || newIndex > total) return
    setAnimDir(dir)
    setAnimKey(k => k + 1)
    setIndex(newIndex)
  }, [total])

  const handleNext = () => {
    if (!canAdvance) return
    if (isLast) { router.back(); return }
    goTo(index + 1, 'forward')
  }

  const handlePrev = () => {
    if (index === 0) { router.back(); return }
    goTo(index - 1, 'backward')
  }

  const onPointerDown = (e) => { dragRef.current = { startX: e.clientX, startY: e.clientY } }
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
    if (card.card_type === 'quiz_4_option') return <LearnCardQuiz card={card} lang={lang} answer={quizAnswers[index] ?? null} />
    return <LearnCardCharacter card={card} lang={lang} />
  }

  // Quiz footer: options + feedback
  const renderQuizFooter = () => {
    const opts = (card.data?.options ?? []).sort((a, b) => a.sort_order - b.sort_order)
    const answer = quizAnswers[index] ?? null
    const answered = answer != null

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {answered && (
          <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '600', color: opts[answer]?.is_correct ? '#10b981' : '#ef4444' }}>
            {opts[answer]?.is_correct
              ? t('learn.correct')
              : `${t('learn.wrong')} ${opts.find(o => o.is_correct)?.default_text}`}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {opts.map((opt, i) => {
            const optText = opt.translations?.[lang] ?? opt.default_text
            const isSelected = answer === i
            const isCorrect = opt.is_correct
            let bg = 'rgba(255,255,255,0.07)'
            let border = '1px solid rgba(255,255,255,0.12)'
            let color = 'white'
            if (answered) {
              if (isCorrect) { bg = 'rgba(16,185,129,0.2)'; border = '1px solid rgba(16,185,129,0.5)'; color = '#10b981' }
              else if (isSelected) { bg = 'rgba(239,68,68,0.2)'; border = '1px solid rgba(239,68,68,0.5)'; color = '#ef4444' }
              else { color = 'rgba(255,255,255,0.3)' }
            }
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => !answered && setQuizAnswers(prev => ({ ...prev, [index]: i }))}
                style={{ padding: '16px 8px', background: bg, border, borderRadius: '16px', color, fontSize: '30px', fontWeight: '400', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              >
                {optText}
              </button>
            )
          })}
        </div>
        {answered && (
          <button
            onClick={handleNext}
            style={{ width: '100%', padding: '14px', borderRadius: '100px', border: 'none', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(236,72,153,0.35)' }}
          >
            {isLast ? t('learn.finish') : t('learn.next')}
          </button>
        )}
      </div>
    )
  }

  const renderNavFooter = () => (
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
        style={{ flex: 1, padding: '14px', borderRadius: '100px', border: 'none', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(236,72,153,0.35)', transition: 'all 0.2s' }}
      >
        {isLast ? t('learn.finish') : t('learn.next')}
      </button>
    </div>
  )

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

        <AppContent>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', cursor: 'grab' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500', flexShrink: 0 }}>{course.name}</span>
              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: 'linear-gradient(90deg,#ec4899,#a855f7)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500', flexShrink: 0 }}>{index + 1}/{total}</span>
            </div>

            {isQuiz ? renderQuizFooter() : renderNavFooter()}
          </div>
        </AppFooter>
      </AppLayout>
    </>
  )
}
