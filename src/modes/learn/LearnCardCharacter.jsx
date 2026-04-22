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
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {mnemonic && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.62)',
            padding: '12px 16px',
            fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.95)', lineHeight: '1.5', textAlign: 'center'
          }}>
            {mnemonic}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 24px' }}>
        <span style={{ fontSize: 'clamp(64px, 18vw, 90px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
          {card.native}
        </span>
        <div style={{ width: '36px', height: '2px', background: 'rgba(236,72,153,0.5)', borderRadius: '9999px' }} />
        <span style={{ fontSize: '40px', fontWeight: '700', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.1em' }}>
          {card.transliteration?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
