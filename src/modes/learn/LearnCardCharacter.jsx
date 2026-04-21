'use client'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardCharacter({ card, lang }) {
  const translation = card.data?.translations?.[lang] ?? card.data?.translations?.en ?? null
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '8px 0' }}>
      {imageUrl && (
        <div style={{ width: '200px', height: '200px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <img src={imageUrl} alt={card.native} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(80px, 22vw, 140px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
          {card.native}
        </div>
        <div style={{ marginTop: '12px', fontSize: '28px', fontWeight: '600', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.05em' }}>
          {card.transliteration}
        </div>
        {translation && (
          <div style={{ marginTop: '8px', fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
            {translation}
          </div>
        )}
      </div>
    </div>
  )
}
