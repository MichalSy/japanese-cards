'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter } from '@/components/Layout'
import { preloadImage, preloadImagesInBackground } from '@/utils/imagePreload'
import LearnCardCharacter from './LearnCardCharacter'
import LearnCardInfo from './LearnCardInfo'

function randomShuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function LearnMode({ lesson, cards, lang }) {
  const router = useRouter()
  const t = useT()
  const [index, setIndex] = useState(() => {
    if (typeof window === 'undefined') return 0
    const p = new URLSearchParams(window.location.search).get('card')
    if (!p) return 0
    const n = parseInt(p, 10) - 1
    return isNaN(n) ? 0 : Math.max(0, Math.min(n, cards.length - 1))
  })
  const [quizAnswers, setQuizAnswers] = useState({})
  const [animDir, setAnimDir] = useState('forward')
  const [animKey, setAnimKey] = useState(0)
  const [currentImageReady, setCurrentImageReady] = useState(false)

  const imageUrls = useMemo(() => {
    const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL
    return cards
      .filter(card => card.image_id)
      .map(card => `${assetsUrl}/${card.image_id}.jpg`)
  }, [cards])

  const dragRef = useRef(null)
  const shuffleCache = useRef({})
  const card = cards[index]
  const total = cards.length
  const isSummary = index === total
  const isQuiz = card?.card_type === 'quiz_4_option'
  const currentImageUrl = card?.image_id
    ? `${process.env.NEXT_PUBLIC_ASSETS_URL}/${card.image_id}.jpg`
    : null

  useEffect(() => {
    preloadImagesInBackground(imageUrls)
  }, [imageUrls])

  useEffect(() => {
    if (!currentImageUrl) {
      setCurrentImageReady(true)
      return
    }

    let cancelled = false
    setCurrentImageReady(false)
    preloadImage(currentImageUrl)
      .catch(() => null)
      .then(() => {
        if (cancelled) return
        setCurrentImageReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [currentImageUrl])

  // Shuffle quiz options once per card per session, cached in ref
  const getShuffledOpts = (cardIdx) => {
    if (!shuffleCache.current[cardIdx]) {
      const c = cards[cardIdx]
      const sorted = [...(c.data?.options ?? [])].sort((a, b) => a.sort_order - b.sort_order)
      shuffleCache.current[cardIdx] = randomShuffle(sorted)
    }
    return shuffleCache.current[cardIdx]
  }
  const shuffledOpts = isQuiz ? getShuffledOpts(index) : []

  const progress = ((index + 1) / total) * 100
  const answered = isQuiz ? quizAnswers[index] != null : true
  const canAdvance = isSummary || answered
  const isLast = index === total - 1

  const quizCardIndices = useMemo(() =>
    cards.reduce((acc, c, i) => { if (c.card_type === 'quiz_4_option') acc.push(i); return acc }, []),
    [cards]
  )
  const quizCount = quizCardIndices.length
  const correctCount = quizCardIndices.filter(i => quizAnswers[i]?.isCorrect).length
  const passed = quizCount === 0 || correctCount === quizCount

  const goTo = useCallback((newIndex, dir) => {
    if (newIndex < 0 || newIndex > total) return
    setAnimDir(dir)
    setAnimKey(k => k + 1)
    setIndex(newIndex)
  }, [total])

  const handleNext = () => {
    if (!canAdvance) return
    if (isSummary) { router.back(); return }
    if (isLast) { goTo(total, 'forward'); return }
    goTo(index + 1, 'forward')
  }

  const canGoBack = isSummary || index > 0

  const handlePrev = () => {
    if (!canGoBack) return
    if (isSummary) { goTo(total - 1, 'backward'); return }
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
    const answerData = quizAnswers[index] ?? null
    const label = lang === 'de' ? 'Das Hiragana-Zeichen fur:' : 'The Hiragana character for:'
    const correct = answerData?.isCorrect ?? false

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Hero */}
        <div style={{
          flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '18px', padding: '24px 20px',
          background: 'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(168,85,247,0.13) 0%, transparent 100%)',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.06)',
            padding: '5px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.09)',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 'clamp(96px, 26vw, 130px)', fontWeight: '800', lineHeight: 1,
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 32px rgba(236,72,153,0.4))',
          }}>
            {card.transliteration?.toUpperCase()}
          </div>

          {/* Feedback strip - absolute overlay, no layout shift */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            textAlign: 'center', padding: '11px 20px',
            fontSize: '14px', fontWeight: '700', letterSpacing: '0.03em',
            color: correct ? '#34d399' : '#f87171',
            background: correct ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            borderTop: `1px solid ${correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            backdropFilter: 'blur(8px)',
            opacity: answerData != null ? 1 : 0,
            transform: answerData != null ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
          }}>
            {answerData != null
              ? (correct ? t('learn.correct') : `${t('learn.wrong')} ${shuffledOpts.find(o => o.is_correct)?.default_text}`)
              : ''}
          </div>
        </div>

        {/* Answer grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '16px' }}>
          {shuffledOpts.map((opt, i) => {
            const optText = opt.translations?.[lang] ?? opt.default_text
            const isSelected = answerData?.selectedIndex === i
            const isCorrect = opt.is_correct
            let bg = 'rgba(255,255,255,0.05)'
            let borderColor = 'rgba(255,255,255,0.11)'
            let color = 'rgba(255,255,255,0.9)'
            let opacity = 1
            if (answerData != null) {
              if (isCorrect) { bg = 'rgba(16,185,129,0.13)'; borderColor = 'rgba(52,211,153,0.55)'; color = '#34d399' }
              else if (isSelected) { bg = 'rgba(239,68,68,0.13)'; borderColor = 'rgba(248,113,113,0.55)'; color = '#f87171' }
              else { opacity = 0.3 }
            }
            return (
              <button
                key={i}
                disabled={answerData != null}
                onClick={() => answerData == null && setQuizAnswers(prev => ({ ...prev, [index]: { selectedIndex: i, isCorrect: opt.is_correct } }))}
                style={{
                  height: '82px', padding: '0',
                  background: bg, border: `1.5px solid ${borderColor}`, borderRadius: '18px',
                  color, fontSize: '38px', fontWeight: '300',
                  cursor: answerData != null ? 'default' : 'pointer',
                  transition: 'background 0.15s, border-color 0.15s, opacity 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', opacity,
                }}
                onMouseEnter={e => { if (answerData == null) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' } }}
                onMouseLeave={e => { if (answerData == null) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = borderColor } }}
              >
                {optText}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSummaryContent = () => {
    const de = lang === 'de'
    if (passed) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '42px', boxShadow: '0 8px 32px rgba(236,72,153,0.45)',
          }}>
            {quizCount > 0 ? '★' : '✓'}
          </div>
          <div style={{
            fontSize: '30px', fontWeight: '800', lineHeight: '1.2',
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {de ? 'Bestanden!' : 'Passed!'}
          </div>
          {quizCount > 0 && (
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
              {de ? `Alle ${quizCount} Fragen richtig beantwortet.` : `All ${quizCount} questions correct.`}
            </div>
          )}
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', maxWidth: '260px' }}>
            {de ? 'Super gemacht! Du kannst stolz auf dich sein.' : 'Great job! You should be proud of yourself.'}
          </div>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '6px',
          fontSize: '72px', fontWeight: '800', lineHeight: 1,
          background: 'linear-gradient(135deg, #ec4899, #a855f7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 24px rgba(236,72,153,0.35))',
        }}>
          {correctCount}
          <span style={{ fontSize: '36px', color: 'rgba(255,255,255,0.2)', WebkitTextFillColor: 'rgba(255,255,255,0.2)' }}>/ {quizCount}</span>
        </div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: 'white' }}>
          {de ? 'Fast geschafft!' : 'Almost there!'}
        </div>
        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', maxWidth: '260px' }}>
          {de ? 'Beim nächsten Mal klappt es sicher. Üben macht den Meister!' : 'You will get it next time. Practice makes perfect!'}
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

  const finishLabel = lang === 'de' ? 'Fertig' : 'Finish'
  const nextLabel = isSummary ? finishLabel : (isLast ? t('learn.finish') : t('learn.next'))

  return (
    <>
      <style>{`
        @keyframes learnSlideRight { from { transform:translateX(32px) } to { transform:translateX(0) } }
        @keyframes learnSlideLeft  { from { transform:translateX(-32px) } to { transform:translateX(0) } }
      `}</style>

      <AppLayout>
        <AppHeader>
          <AppHeaderBar title={lesson.title} />
        </AppHeader>

        <AppContent>
          {!currentImageReady ? (
            <div className="card" style={{ width: '100%', padding: '28px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
              {t('loading')}
            </div>
          ) : isSummary ? (
            <div
              key={animKey}
              className="card"
              style={{ flex: 1, padding: 0, overflow: 'hidden', animation: `${animDir === 'forward' ? 'learnSlideRight' : 'learnSlideLeft'} 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both` }}
            >
              {renderSummaryContent()}
            </div>
          ) : isQuiz ? (
            <div
              key={animKey}
              className="card"
              style={{ flex: 1, padding: 0, overflow: 'hidden', animation: `${animDir === 'forward' ? 'learnSlideRight' : 'learnSlideLeft'} 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both` }}
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
              <div className="card" style={{ width: '100%', padding: (card.card_type === 'info' || (card.card_type === 'character' && card.image_id)) ? 0 : undefined, overflow: 'hidden' }}>
                {renderCardContent()}
              </div>
            </div>
          )}
        </AppContent>

        <AppFooter>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {/* Progress bar */}
            {!isSummary && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '3px', background: 'linear-gradient(90deg,#ec4899,#a855f7)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500', flexShrink: 0 }}>
                  {index + 1}/{total}
                </span>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isSummary && (
                <button
                  onClick={handlePrev}
                  disabled={!canGoBack}
                  style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', color: canGoBack ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', fontSize: '15px', fontWeight: '600', cursor: canGoBack ? 'pointer' : 'default', flexShrink: 0, transition: 'color 0.2s' }}
                >
                  ←
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                style={{ flex: 1, padding: '14px', borderRadius: '100px', border: 'none', background: canAdvance ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(255,255,255,0.08)', color: canAdvance ? 'white' : 'rgba(255,255,255,0.3)', fontSize: '16px', fontWeight: '700', cursor: canAdvance ? 'pointer' : 'default', boxShadow: canAdvance ? '0 4px 16px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s' }}
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </AppFooter>
      </AppLayout>
    </>
  )
}
