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

function TranslationPreference({ lang, enabled, saving, onChange }) {
  const de = lang === 'de'
  return (
    <div style={{
      padding: '11px 13px', borderRadius: '18px',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.62), rgba(24,24,27,0.72))',
      border: '1px solid rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.26)', backdropFilter: 'blur(10px)',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '850', color: 'white', lineHeight: 1.25 }}>
          {de ? 'Übersetzungen direkt anzeigen' : 'Show translations directly'}
        </div>
        <div style={{ marginTop: '3px', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.45)', lineHeight: 1.35 }}>
          {de ? 'Aus: Text ist verdeckt, pro Karte manuell einblenden.' : 'Off: text is hidden, reveal each card manually.'}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        disabled={saving}
        aria-pressed={enabled}
        style={{
          width: '58px', height: '34px', padding: '3px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)',
          background: enabled ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(255,255,255,0.09)',
          cursor: saving ? 'wait' : 'pointer', flexShrink: 0, transition: 'background 0.18s ease',
          boxShadow: enabled ? '0 5px 16px rgba(236,72,153,0.28)' : 'none',
        }}
      >
        <span style={{
          display: 'block', width: '26px', height: '26px', borderRadius: '50%', background: 'white',
          transform: enabled ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.18s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
        }} />
      </button>
    </div>
  )
}

export default function LearnCardVocabulary({
  card,
  lang,
  showTranslationsByDefault = true,
  isTranslationRevealed = false,
  onRevealTranslation,
  showTranslationPreference = false,
  onShowTranslationsByDefaultChange,
  isSavingTranslationPreference = false,
}) {
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const translation = translationFor(card, lang)
  const languageLabel = lang === 'de' ? 'Bedeutung' : 'Meaning'
  const revealLabel = lang === 'de' ? 'Anzeigen' : 'Show'
  const romaji = formatRomaji(card.transliteration)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const translationVisible = showTranslationsByDefault || isTranslationRevealed
  const shouldHideTranslation = Boolean(translation && !translationVisible)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <div style={{
          fontSize: 'clamp(22px, 6.5vw, 34px)', fontWeight: '900', lineHeight: 1.1, color: 'white', overflowWrap: 'anywhere',
          filter: shouldHideTranslation ? 'blur(7px)' : 'none', userSelect: shouldHideTranslation ? 'none' : 'auto',
          opacity: shouldHideTranslation ? 0.72 : 1, transition: 'filter 0.18s ease, opacity 0.18s ease',
        }}>
          {translation}
        </div>
        {shouldHideTranslation && (
          <button
            type="button"
            onClick={onRevealTranslation}
            style={{
              flexShrink: 0, padding: '8px 11px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.14)', color: 'white', fontSize: '12px', fontWeight: '850', cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            {revealLabel}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {showTranslationPreference && !imageUrl && (
        <div style={{ margin: '14px 14px 0' }}>
          <TranslationPreference
            lang={lang}
            enabled={showTranslationsByDefault}
            saving={isSavingTranslationPreference}
            onChange={onShowTranslationsByDefaultChange}
          />
        </div>
      )}

      {imageUrl && (
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
          <img
            src={imageUrl}
            alt={translation ?? card.native}
            loading="eager"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {showTranslationPreference && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 2 }}>
              <TranslationPreference
                lang={lang}
                enabled={showTranslationsByDefault}
                saving={isSavingTranslationPreference}
                onChange={onShowTranslationsByDefaultChange}
              />
            </div>
          )}
          {translationPanel}
        </div>
      )}

      <div style={{ padding: imageUrl ? '14px 18px 16px' : '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '7px' }}>
          <div style={{
            fontSize: '11px', fontWeight: '800', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.06)',
            padding: '5px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.09)',
          }}>
            Vokabel
          </div>
          <div style={{
            fontSize: 'clamp(40px, 12vw, 58px)', lineHeight: 1.08, fontWeight: '700', color: 'white',
            textShadow: '0 4px 24px rgba(236,72,153,0.28)', wordBreak: 'keep-all', overflowWrap: 'anywhere',
          }}>
            {card.native}
          </div>
          {romaji && (
            <div style={{
              fontSize: 'clamp(18px, 5vw, 25px)', fontWeight: '800', color: 'rgba(236,72,153,0.95)',
              letterSpacing: '0.02em', overflowWrap: 'anywhere',
            }}>
              {romaji}
            </div>
          )}
          {card.audio_url && (
            <>
              <audio ref={audioRef} src={card.audio_url} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
              <button
                type="button"
                onClick={handlePlayAudio}
                aria-label={lang === 'de' ? 'Aussprache abspielen' : 'Play pronunciation'}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  minHeight: '40px', padding: '8px 15px', borderRadius: '999px', cursor: 'pointer',
                  border: '1px solid rgba(236,72,153,0.35)', color: 'white', fontSize: '14px', fontWeight: '800',
                  background: isPlaying ? 'linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95))' : 'rgba(236,72,153,0.14)',
                  boxShadow: isPlaying ? '0 6px 18px rgba(236,72,153,0.28)' : 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                }}
              >
                <span aria-hidden="true">{isPlaying ? '■' : '▶'}</span>
                {lang === 'de' ? 'Anhören' : 'Listen'}
              </button>
            </>
          )}
        </div>

        {!imageUrl && translationPanel}
      </div>
    </div>
  )
}
