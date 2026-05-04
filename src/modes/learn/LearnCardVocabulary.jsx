'use client'

import { useEffect, useRef, useState } from 'react'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

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

export default function LearnCardVocabulary({ card, lang }) {
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const translation = translationFor(card, lang)
  const languageLabel = lang === 'de' ? 'Bedeutung' : 'Meaning'
  const romaji = formatRomaji(card.transliteration)
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

  const translationPanel = translation && (
    <div style={{
      position: imageUrl ? 'absolute' : 'relative', bottom: imageUrl ? 0 : 'auto', left: imageUrl ? 0 : 'auto', right: imageUrl ? 0 : 'auto',
      background: imageUrl ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.86))' : 'linear-gradient(135deg, rgba(236,72,153,0.13), rgba(168,85,247,0.13))',
      padding: imageUrl ? '42px 14px 14px' : '14px 16px', textAlign: 'center',
      border: imageUrl ? 'none' : '1px solid rgba(236,72,153,0.25)', borderRadius: imageUrl ? 0 : '22px',
      boxShadow: imageUrl ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: '10px', fontWeight: '850', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.58)', marginBottom: '5px' }}>
        {languageLabel}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontSize: 'clamp(22px, 6.5vw, 34px)', fontWeight: '900', lineHeight: 1.1, color: 'white', overflowWrap: 'anywhere',
        }}>
          {translation}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {imageUrl && (
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
          <img
            src={imageUrl}
            alt={translation ?? card.native}
            loading="eager"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {translationPanel}
        </div>
      )}

      <div style={{ padding: imageUrl ? '10px 14px 12px' : '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '7px',
          padding: '10px 12px', borderRadius: '18px', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '9px', fontWeight: '750', letterSpacing: '0.11em', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase' }}>Hiragana</span>
            <span style={{
              fontSize: 'clamp(30px, 9vw, 46px)', lineHeight: 1.04, fontWeight: '700', color: 'white',
              textShadow: '0 4px 24px rgba(236,72,153,0.24)', overflowWrap: 'anywhere', wordBreak: 'normal', textAlign: 'center',
            }}>
              {card.native}
            </span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: '750', letterSpacing: '0.11em', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', flexShrink: 0 }}>Romaji</span>
            <span style={{
              minWidth: 0, fontSize: 'clamp(17px, 4.8vw, 24px)', fontWeight: '850', color: 'rgba(236,72,153,0.96)',
              letterSpacing: '0.02em', overflowWrap: 'anywhere', wordBreak: 'normal', textAlign: 'center', lineHeight: 1.12,
            }}>
              {romaji || '–'}
            </span>
          </div>

          {card.audio_url && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <audio ref={audioRef} src={card.audio_url} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
              <button
                type="button"
                onClick={handlePlayAudio}
                aria-label={lang === 'de' ? 'Aussprache abspielen' : 'Play pronunciation'}
                style={{
                  width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  minHeight: '34px', padding: '7px 12px', borderRadius: '999px', cursor: 'pointer',
                  border: '1px solid rgba(236,72,153,0.32)', color: 'white', fontSize: '13px', fontWeight: '850',
                  background: isPlaying ? 'linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95))' : 'rgba(236,72,153,0.13)',
                  boxShadow: isPlaying ? '0 5px 14px rgba(236,72,153,0.24)' : 'none',
                  transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: '14px', lineHeight: 1 }}>{isPlaying ? '■' : '▶'}</span>
                <span>{lang === 'de' ? 'Audio' : 'Audio'}</span>
              </button>
            </>
          )}
        </div>

        {!imageUrl && translationPanel}
      </div>
    </div>
  )
}
