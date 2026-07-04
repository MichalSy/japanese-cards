'use client'

import { useEffect, useRef, useState } from 'react'
import { getCardImageUrl } from '@/utils/assets'

function formatRomaji(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function translationFor(card, lang) {
  if (card.translation) return card.translation
  const rows = card.translations ?? []
  return rows.find(t => t.lang_code === lang)?.translation
    ?? rows.find(t => t.lang_code === 'en')?.translation
    ?? null
}

function shouldShowTransliteration(native, romaji) {
  if (!romaji) return false
  const cleanNative = String(native ?? '').toLocaleLowerCase().replace(/[\s.!?…]/g, '')
  const cleanRomaji = String(romaji ?? '').toLocaleLowerCase().replace(/[\s.!?…]/g, '')
  return cleanNative !== cleanRomaji
}

export default function LearnCardVocabulary({ card, lang }) {
  const imageUrl = getCardImageUrl(card.image_id)
  const translation = translationFor(card, lang)
  const romaji = formatRomaji(card.transliteration)
  const showTransliteration = shouldShowTransliteration(card.native, romaji)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
    return () => {
      if (!audioRef.current) return
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [card.audio_url])

  const handlePlayAudio = async () => {
    if (!card.audio_url || !audioRef.current) return

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

  const handleAudioPanelKeyDown = (event) => {
    if (!card.audio_url) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handlePlayAudio()
  }

  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: imageUrl ? '18px' : '28px', padding: imageUrl ? '4px 0 6px' : '18px 0',
    }}>
      {imageUrl && (
        <div style={{
          width: 'min(100%, 360px)', aspectRatio: '1/1', overflow: 'hidden', position: 'relative',
          borderRadius: '30px', background: 'rgba(255,255,255,0.045)',
          boxShadow: '0 18px 46px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.14)',
        }}>
          <img
            src={imageUrl}
            alt={translation ?? card.native}
            loading="eager"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div
        role={card.audio_url ? 'button' : undefined}
        tabIndex={card.audio_url ? 0 : undefined}
        onClick={card.audio_url ? handlePlayAudio : undefined}
        onKeyDown={handleAudioPanelKeyDown}
        style={{
          width: 'min(100%, 360px)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          gap: '10px', padding: '0 8px', cursor: card.audio_url ? 'pointer' : 'default',
        }}
      >
        {card.audio_url && (
          <audio ref={audioRef} src={card.audio_url} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
        )}

        {translation && (
          <div style={{
            fontSize: '13px', fontWeight: '850', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.48)',
          }}>
            {translation}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%' }}>
          {card.audio_url && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handlePlayAudio()
              }}
              aria-label={lang === 'de' ? 'Aussprache abspielen' : 'Play pronunciation'}
              style={{
                width: '46px', height: '46px', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '999px', cursor: 'pointer', border: '1px solid rgba(236,72,153,0.42)', color: 'white',
                background: isPlaying ? 'linear-gradient(135deg, rgba(236,72,153,0.96), rgba(168,85,247,0.96))' : 'rgba(255,255,255,0.08)',
                boxShadow: isPlaying ? '0 8px 22px rgba(236,72,153,0.30)' : '0 8px 20px rgba(0,0,0,0.22)',
                transition: 'background 0.18s ease, box-shadow 0.18s ease',
              }}
            >
              <span aria-hidden="true" style={{ fontSize: '16px', lineHeight: 1, transform: isPlaying ? 'none' : 'translateX(1px)' }}>{isPlaying ? '■' : '▶'}</span>
            </button>
          )}

          <div style={{ minWidth: 0, flex: '0 1 auto' }}>
            <div style={{
              fontSize: 'clamp(46px, 13vw, 76px)', lineHeight: 0.98, fontWeight: '850', color: 'white',
              textShadow: '0 8px 32px rgba(236,72,153,0.28)', overflowWrap: 'anywhere', wordBreak: 'normal',
            }}>
              {card.native}
            </div>
          </div>
        </div>

        {showTransliteration && (
          <div style={{
            fontSize: 'clamp(18px, 5vw, 25px)', fontWeight: '800', color: 'rgba(236,72,153,0.95)',
            letterSpacing: '0.02em', lineHeight: 1.12,
          }}>
            {romaji}
          </div>
        )}
      </div>
    </div>
  )
}
