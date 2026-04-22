'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter } from '@/components/Layout'
import LearnCardCharacter from './LearnCardCharacter'
import LearnCardInfo from './LearnCardInfo'

export default function LearnMode({ lesson, cards, lang }) {
  const router = useRouter()
  const t = useT()
  const [index, setIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [animDir, setAnimDir] = useState('forward')
  const [animKey, setAnimKey] = useState(0)
  useEffect(() => {
    const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL
    cards.forEach(card => {
      if (card.image_id) {
        const img = new Image()
        img.src = `${assetsUrl}/${card.image_id}.jpg`
      }
    })
  }, [cards])

  const dragRef = useRef(null)
  const card = cards[index]
  const total = cards.length
  const progress = (index / total) * 100
  const isQuiz = card?.card_type === 'quiz_4_option'
  const answered = isQuiz ? quizAnswers[index] != null : true
  const canAdvance = answered
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

  const renderQuizContent = () => {
    const opts = (card.data?.options ?? []).sort((a, b) => a.sort_order - b.sort_order)
    const answer = quizAnswers[index] ?? null
    const question = card.data?.question?.[lang] ?? card.data?.question?.en ?? card.data?.question?.default ?? `Which character represents ${card.transliteration?.toUpperCase()}?`

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Question — centred in remaining space */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5', textAlign: 'center' }}>
            {question}
          </div>
        </div>

        {/* Feedback */}
        {answer != null && (
          <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: opts[answer]?.is_correct ? '#10b981' : '#ef4444' }}>
            {opts[answer]?.is_correct
              ? t('learn.correct')
              : `${t('learn.wrong')} ${opts.find(o => o.is_correct)?.default_text}`}
          </div>
        )}

        {/* Options — always at bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {opts.map((opt, i) => {
            const optText = opt.translations?.[lang] ?? opt.default_text
            const isSelected = answer === i
            const isCorrect = opt.is_correct
            let bg = 'rgba(255,255,255,0.07)'
            let border = '1px solid rgba(255,255,255,0.12)'
            let color = 'white'
            if (answer != null) {
              if (isCorrect) { bg = 'rgba(16,185,129,0.2)'; border = '1px solid rgba(16,185,129,0.5)'; color = '#10b981' }
              else if (isSelected) { bg = 'rgba(239,68,68,0.2)'; border = '1px solid rgba(239,68,68,0.5)'; color = '#ef4444' }
              else { color = 'rgba(255,255,255,0.3)' }
            }
            return (
              <button
                key={i}
                disabled={answer != null}
                onClick={() => answer == null && setQuizAnswers(prev => ({ ...prev, [index]: i }))}
                style={{ padding: '16px 8px', background: bg, border, borderRadius: '16px', color, fontSize: '30px', fontWeight: '400', cursor: answer != null ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { if (answer == null) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { if (answer == null) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              >
                {optText}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCardContent = () => {
    if (!card) return null
    if (isQuiz) return renderQuizContent()
    if (card.card_type === 'character') return <LearnCardCharacter card={card} lang={lang} />
    if (card.card_type === 'info') return <LearnCardInfo card={card} lang={lang} />
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

        <AppContent>
          {isQuiz ? (
            <div
              key={animKey}
              className="card"
              style={{ flex: 1, animation: `${animDir === 'forward' ? 'learnSlideRight' : 'learnSlideLeft'} 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both` }}
            >
              {renderCardContent()}
            </div>
          ) : (
            <div
              key={animKey}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', animation: `${animDir === 'forward' ? 'learnSlideRight' : 'learnSlideLeft'} 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both` }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <div className="card" style={{ width: '100%', padding: 0, overflow: 'hidden' }}>
                {renderCardContent()}
              </div>
            </div>
          )}
        </AppContent>

        <AppFooter>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: 'linear-gradient(90deg,#ec4899,#a855f7)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500', flexShrink: 0 }}>{index + 1}/{total}</span>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrev}
                style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}
              >
                ←
              </button>
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                style={{ flex: 1, padding: '14px', borderRadius: '100px', border: 'none', background: canAdvance ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(255,255,255,0.08)', color: canAdvance ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '16px', fontWeight: '700', cursor: canAdvance ? 'pointer' : 'default', boxShadow: canAdvance ? '0 4px 16px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s' }}
              >
                {isLast ? t('learn.finish') : t('learn.next')}
              </button>
            </div>
          </div>
        </AppFooter>
      </AppLayout>
    </>
  )
}
