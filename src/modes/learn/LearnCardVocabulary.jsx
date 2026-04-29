'use client'

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
        </div>
      )}

      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
          <div style={{
            fontSize: '11px', fontWeight: '800', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.06)',
            padding: '5px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.09)',
          }}>
            Vokabel
          </div>
          <div style={{
            fontSize: 'clamp(42px, 13vw, 62px)', lineHeight: 1.12, fontWeight: '700', color: 'white',
            textShadow: '0 4px 24px rgba(236,72,153,0.28)', wordBreak: 'keep-all', overflowWrap: 'anywhere',
          }}>
            {card.native}
          </div>
          {romaji && (
            <div style={{
              fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: '800', color: 'rgba(236,72,153,0.95)',
              letterSpacing: '0.02em', overflowWrap: 'anywhere',
            }}>
              {romaji}
            </div>
          )}
        </div>

        {translation && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.13), rgba(168,85,247,0.13))',
            border: '1px solid rgba(236,72,153,0.25)', borderRadius: '22px', padding: '14px 16px',
            textAlign: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: '6px' }}>
              {languageLabel}
            </div>
            <div style={{ fontSize: 'clamp(24px, 7vw, 36px)', fontWeight: '850', lineHeight: 1.15, color: 'white', overflowWrap: 'anywhere' }}>
              {translation}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
