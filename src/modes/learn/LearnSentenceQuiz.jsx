'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

function cleanWord(word) {
  return String(word ?? '').trim().replace(/^[.,!?;:„“"'()]+|[.,!?;:„“"'()]+$/g, '')
}

function wordsFromSentence(sentence) {
  return String(sentence ?? '').split(/\s+/).map(cleanWord).filter(Boolean)
}

function uniqueWords(words) {
  const seen = new Set()
  return words.filter(word => {
    const key = word.toLocaleLowerCase('de-DE')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function stableShuffle(words, seedText) {
  let seed = 2166136261
  for (const character of seedText) {
    seed ^= character.charCodeAt(0)
    seed = Math.imul(seed, 16777619) >>> 0
  }
  const result = [...words]
  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const j = seed % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function LearnSentenceQuiz({ card, lang, answerData, onAnswer, t }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const fallbackOptions = card.data?.options ?? []
  const fallbackCorrect = fallbackOptions.find(option => option.is_correct)?.default_text
  const fallbackDistractor = fallbackOptions.find(option => !option.is_correct)?.default_text
  const targetWords = useMemo(
    () => (card.data?.target_words?.length ? card.data.target_words.map(cleanWord).filter(Boolean) : wordsFromSentence(fallbackCorrect)),
    [card, fallbackCorrect]
  )
  const distractorWords = useMemo(
    () => (card.data?.distractor_words?.length ? card.data.distractor_words.map(cleanWord).filter(Boolean) : wordsFromSentence(fallbackDistractor)),
    [card, fallbackDistractor]
  )
  const wordPool = useMemo(
    () => stableShuffle(uniqueWords([...targetWords, ...distractorWords]), card.slug ?? targetWords.join('|')),
    [card.slug, targetWords, distractorWords]
  )
  const [selectedWords, setSelectedWords] = useState(() => answerData?.selectedWords ?? [])

  const isListeningQuiz = card.data?.quiz_type === 'sentence_audio_builder'
  const question = card.data?.question?.[lang] ?? card.data?.question?.en ?? (lang === 'de' ? 'Baue den deutschen Satz:' : 'Build the German sentence:')
  const prompt = card.data?.prompt?.[lang] ?? card.data?.prompt?.en ?? card.native
  const correct = answerData?.isCorrect ?? false
  const locked = Boolean(answerData)
  const chosen = locked ? (answerData.selectedWords ?? selectedWords) : selectedWords
  const chosenKeys = new Set(chosen.map(word => word.toLocaleLowerCase('de-DE')))
  const availableWords = wordPool.filter(word => !chosenKeys.has(word.toLocaleLowerCase('de-DE')))
  const correctSentence = `${targetWords.join(' ')}.`

  useEffect(() => {
    setIsPlaying(false)
    return () => {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.currentTime = 0
    }
  }, [card.audio_url])

  const handlePlayAudio = async () => {
    if (!audioRef.current || !card.audio_url) return
    if (!audioRef.current.paused) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      return
    }
    try {
      audioRef.current.currentTime = 0
      await audioRef.current.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const handleAudioKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handlePlayAudio()
  }

  const addWord = word => {
    if (locked || selectedWords.length >= targetWords.length) return
    const next = [...selectedWords, word]
    setSelectedWords(next)
    if (next.length === targetWords.length) {
      const isCorrect = next.every((value, index) => value === targetWords[index])
      onAnswer(next, isCorrect)
    }
  }

  const removeWord = index => {
    if (locked) return
    setSelectedWords(words => words.filter((_, wordIndex) => wordIndex !== index))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '22px 16px 48px', background: 'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(168,85,247,0.13) 0%, transparent 100%)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.13em', textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.42)', background: 'rgba(255,255,255,0.06)', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.09)' }}>
          {question}
        </div>

        {isListeningQuiz ? (
          <div
            role="button"
            tabIndex={0}
            aria-label={lang === 'de' ? 'Satz anhören' : 'Listen to sentence'}
            onClick={handlePlayAudio}
            onKeyDown={handleAudioKeyDown}
            style={{ width: 'min(210px, 70vw)', minHeight: '104px', padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '24px', border: '1.5px solid rgba(236,72,153,0.35)', background: isPlaying ? 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.20))' : 'rgba(255,255,255,0.055)', boxShadow: isPlaying ? '0 8px 30px rgba(236,72,153,0.18)' : '0 8px 24px rgba(0,0,0,0.18)', cursor: card.audio_url ? 'pointer' : 'default' }}
          >
            <audio ref={audioRef} src={card.audio_url ?? undefined} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
            <div aria-hidden="true" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', color: 'white', fontSize: '18px', background: isPlaying ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(236,72,153,0.25)', border: '1px solid rgba(236,72,153,0.42)', boxShadow: '0 5px 16px rgba(236,72,153,0.22)' }}>
              {isPlaying ? '■' : '▶'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'rgba(255,255,255,0.76)' }}>
              {lang === 'de' ? 'Satz anhören' : 'Listen to the sentence'}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 'clamp(24px, 7vw, 38px)', fontWeight: '900', lineHeight: 1.15, textAlign: 'center', maxWidth: '100%', overflowWrap: 'anywhere', background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 28px rgba(236,72,153,0.32))' }}>
            {prompt}
          </div>
        )}

        <div aria-label={lang === 'de' ? 'Satzpositionen' : 'Sentence positions'} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', minHeight: '43px' }}>
          {targetWords.map((_, index) => {
            const word = chosen[index]
            const wrong = locked && word !== targetWords[index]
            const right = locked && word === targetWords[index]
            return word ? (
              <button key={index} type="button" disabled={locked} onClick={() => removeWord(index)} aria-label={locked ? word : `${word} ${lang === 'de' ? 'entfernen' : 'remove'}`} style={{ minHeight: '40px', padding: '8px 13px', borderRadius: '12px', border: `1.5px solid ${right ? 'rgba(52,211,153,0.65)' : wrong ? 'rgba(248,113,113,0.65)' : 'rgba(168,85,247,0.55)'}`, background: right ? 'rgba(16,185,129,0.15)' : wrong ? 'rgba(239,68,68,0.15)' : 'rgba(168,85,247,0.16)', color: right ? '#34d399' : wrong ? '#f87171' : 'rgba(255,255,255,0.95)', fontSize: '16px', fontWeight: '800', cursor: locked ? 'default' : 'pointer' }}>
                {word}
              </button>
            ) : (
              <div key={index} aria-hidden="true" style={{ width: '58px', minHeight: '40px', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.025)' }} />
            )
          })}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', padding: '10px 16px', fontSize: '14px', fontWeight: '700', color: correct ? '#34d399' : '#f87171', background: correct ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', borderTop: `1px solid ${correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, opacity: locked ? 1 : 0, pointerEvents: 'none' }}>
          {locked ? (correct ? t('learn.correct') : `${t('learn.wrong')} ${correctSentence}`) : ''}
        </div>
      </div>

      <div style={{ padding: '14px 14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ marginBottom: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: '12px', fontWeight: '700' }}>
          {lang === 'de' ? 'Tippe die Wörter in der richtigen Reihenfolge an.' : 'Tap the words in the correct order.'}
        </div>
        <div aria-label={lang === 'de' ? 'Verfügbare Wörter' : 'Available words'} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', minHeight: '40px' }}>
          {availableWords.map(word => (
            <button key={word.toLocaleLowerCase('de-DE')} type="button" disabled={locked} onClick={() => addWord(word)} style={{ minHeight: '36px', padding: '7px 12px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.92)', fontSize: '15px', fontWeight: '750', cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.35 : 1 }}>
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
