'use client'

import { useEffect, useRef, useState } from 'react'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardSentence({ card, lang }) {
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const meaningLabel = lang === 'de' ? 'Bedeutung' : 'Meaning'

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

  const handleAudioPanelKeyDown = event => {
    if (!card.audio_url) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handlePlayAudio()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {imageUrl && (
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
          <img src={imageUrl} alt={card.native} loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {card.translation && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '42px 14px 13px', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.86))' }}>
              <div style={{ fontSize: '10px', fontWeight: '850', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.58)', marginBottom: '4px' }}>{meaningLabel}</div>
              <div style={{ fontSize: 'clamp(20px, 5.8vw, 30px)', fontWeight: '900', lineHeight: 1.12, color: 'white' }}>{card.translation}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: imageUrl ? '10px 14px 12px' : '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
        <div
          role={card.audio_url ? 'button' : undefined}
          tabIndex={card.audio_url ? 0 : undefined}
          onClick={card.audio_url ? handlePlayAudio : undefined}
          onKeyDown={handleAudioPanelKeyDown}
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '9px 50px', borderRadius: '18px', textAlign: 'center', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)', cursor: card.audio_url ? 'pointer' : 'default' }}
        >
          {card.audio_url && (
            <>
              <audio ref={audioRef} src={card.audio_url} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation()
                  handlePlayAudio()
                }}
                aria-label={lang === 'de' ? 'Aussprache abspielen' : 'Play pronunciation'}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', border: '1px solid rgba(236,72,153,0.38)', color: 'white', background: isPlaying ? 'linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95))' : 'rgba(236,72,153,0.24)', boxShadow: isPlaying ? '0 5px 14px rgba(236,72,153,0.24)' : '0 4px 12px rgba(0,0,0,0.22)', cursor: 'pointer', transition: 'background 0.18s ease, box-shadow 0.18s ease', zIndex: 1 }}
              >
                <span aria-hidden="true" style={{ fontSize: '14px', lineHeight: 1, transform: isPlaying ? 'none' : 'translateX(1px)' }}>{isPlaying ? '■' : '▶'}</span>
              </button>
            </>
          )}
          <div style={{ fontSize: 'clamp(23px, 6.5vw, 34px)', fontWeight: '800', lineHeight: 1.18, color: 'white', overflowWrap: 'anywhere' }}>{card.native}</div>
          {card.transliteration && (
            <div style={{ fontSize: 'clamp(15px, 4.3vw, 20px)', fontWeight: '850', lineHeight: 1.15, letterSpacing: '0.02em', color: 'rgba(236,72,153,0.96)', overflowWrap: 'anywhere' }}>
              {card.transliteration}
            </div>
          )}
        </div>

        {!imageUrl && card.translation && (
          <div style={{ padding: '11px 14px', textAlign: 'center', borderRadius: '16px', background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(96,165,250,0.22)' }}>
            <div style={{ fontSize: '10px', fontWeight: '850', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.82)', marginBottom: '4px' }}>{meaningLabel}</div>
            <div style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: '800', lineHeight: 1.25, color: 'white' }}>{card.translation}</div>
          </div>
        )}
      </div>
    </div>
  )
}
