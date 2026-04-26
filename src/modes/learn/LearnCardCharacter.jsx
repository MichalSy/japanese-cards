'use client'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardCharacter({ card, lang }) {
  const mnemonic = card.data?.mnemonic?.[lang] ?? card.data?.mnemonic?.en ?? null
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null

  if (!imageUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(80px, 22vw, 120px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
          {card.native}
        </div>
        <div style={{ width: '40px', height: '2px', background: 'rgba(236,72,153,0.5)', borderRadius: '9999px' }} />
        <div style={{ fontSize: '36px', fontWeight: '700', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.08em' }}>
          {card.transliteration?.toUpperCase()}
        </div>
        {mnemonic && (
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', maxWidth: '280px', marginTop: '8px' }}>
            {mnemonic}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
        <img
          src={imageUrl}
          alt={card.native}
          loading="eager"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {mnemonic && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.62)',
            padding: '12px 16px',
            fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.95)', lineHeight: '1.5', textAlign: 'center', whiteSpace: 'pre-line'
          }}>
            {mnemonic}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', padding: '16px 0' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 16px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Hiragana</span>
          <span style={{ fontSize: 'clamp(56px, 16vw, 80px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
            {card.native}
          </span>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '4px 0' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 16px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Romaji</span>
          <span style={{ fontSize: '44px', fontWeight: '700', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.05em' }}>
            {card.transliteration?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
