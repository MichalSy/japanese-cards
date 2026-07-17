'use client'

import { useEffect, useRef, useState } from 'react'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardSentence({ card, lang }) {
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const meaningLabel = lang === 'de' ? 'Bedeutung' : 'Meaning'
  const hintLabel = lang === 'de' ? 'Tipp' : 'Tip'

  useEffect(() => {
    setIsPlaying(false)
    return () => {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.currentTime = 0
    }
  }, [card.audio_url])

  const toggleAudio = async () => {
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
        <div style={{ position: 'relative', padding: card.audio_url ? '10px 50px' : '10px 14px', borderRadius: '18px', textAlign: 'center', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {card.audio_url && (
            <>
              <audio ref={audioRef} src={card.audio_url} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
              <button type="button" onClick={toggleAudio} aria-label={lang === 'de' ? 'Satz abspielen' : 'Play sentence'} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '999px', border: '1px solid rgba(236,72,153,0.38)', color: 'white', background: isPlaying ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(236,72,153,0.24)', cursor: 'pointer' }}>
                {isPlaying ? '■' : '▶'}
              </button>
            </>
          )}
          <div style={{ fontSize: 'clamp(23px, 6.5vw, 34px)', fontWeight: '800', lineHeight: 1.18, color: 'white', overflowWrap: 'anywhere' }}>{card.native}</div>
        </div>

        {!imageUrl && card.translation && (
          <div style={{ padding: '11px 14px', textAlign: 'center', borderRadius: '16px', background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(96,165,250,0.22)' }}>
            <div style={{ fontSize: '10px', fontWeight: '850', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.82)', marginBottom: '4px' }}>{meaningLabel}</div>
            <div style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: '800', lineHeight: 1.25, color: 'white' }}>{card.translation}</div>
          </div>
        )}

        {card.hint && (
          <div style={{ padding: '8px 11px', borderRadius: '15px', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.22)', color: 'rgba(255,255,255,0.86)', fontSize: '13px', lineHeight: 1.32 }}>
            <div style={{ fontSize: '10px', fontWeight: '850', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(134,239,172,0.82)', marginBottom: '4px' }}>{hintLabel}</div>
            {card.hint}
          </div>
        )}
      </div>
    </div>
  )
}
