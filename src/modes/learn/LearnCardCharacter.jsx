'use client'

import { useState } from 'react'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL

export default function LearnCardCharacter({ card, lang }) {
  const mnemonic = card.data?.mnemonic?.[lang] ?? card.data?.mnemonic?.en ?? null
  const imageUrl = card.image_id ? `${ASSETS_URL}/${card.image_id}.jpg` : null
  const [imgLoaded, setImgLoaded] = useState(false)

  if (!imageUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0', textAlign: 'center' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      {/* Image hero */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={card.native}
          onLoad={() => setImgLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease', display: 'block' }}
        />
        {/* Bottom fade into card */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, transparent, rgba(18,10,40,0.85))' }} />
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
        {mnemonic && (
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', maxWidth: '300px' }}>
            {mnemonic}
          </div>
        )}

        <div style={{ fontSize: 'clamp(64px, 18vw, 96px)', lineHeight: 1, fontWeight: '300', color: 'white', textShadow: '0 4px 24px rgba(236,72,153,0.3)' }}>
          {card.native}
        </div>

        <div style={{ fontSize: '24px', fontWeight: '600', color: 'rgba(236,72,153,0.9)', letterSpacing: '0.05em' }}>
          {card.transliteration}
        </div>
      </div>
    </div>
  )
}
