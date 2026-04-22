'use client'

import { useState } from 'react'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardCharacter({ card, lang }) {
  const mnemonic = card.data?.mnemonic?.[lang] ?? card.data?.mnemonic?.en ?? null
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const [imgLoaded, setImgLoaded] = useState(false)

  if (!imageUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(80px, 22vw, 120px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
          {card.native}
        </div>
        <div style={{ fontSize: '26px', fontWeight: '600', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.05em' }}>
          {card.transliteration}
        </div>
        {mnemonic && (
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', maxWidth: '280px' }}>
            {mnemonic}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Square image - fills full card width */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
        <img
          src={imageUrl}
          alt={card.native}
          onLoad={() => setImgLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease', display: 'block' }}
        />
      </div>

      {/* Text content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '14px 20px', textAlign: 'center' }}>
        {mnemonic && (
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
            {mnemonic}
          </div>
        )}

        {/* Character + transliteration side by side */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: 'clamp(56px, 15vw, 80px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
            {card.native}
          </span>
          <span style={{ fontSize: '28px', fontWeight: '600', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.05em' }}>
            {card.transliteration}
          </span>
        </div>
      </div>
    </div>
  )
}
