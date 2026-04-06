'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const ABILITIES: Record<string, { name: string; emoji: string; description: string }> = {
  "access": {
    "name": "Passierschein",
    "emoji": "🎫",
    "description": "Zugang zu Japanese Cards"
  }
}

const bgStyle = {
  background: `
    radial-gradient(circle at 15% 10%, rgba(236,72,153,0.4) 0%, transparent 50%),
    radial-gradient(circle at 85% 95%, rgba(236,72,153,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 25%, #0f172a 50%, #0d1e3f 100%)
  `,
  backgroundAttachment: 'fixed' as const,
}

function NoAccessContent() {
  const searchParams = useSearchParams()
  const abilityId = searchParams.get('id') || 'access'
  const ability = ABILITIES[abilityId] || { name: 'Unbekannt', emoji: '🚫', description: '' }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', system-ui, sans-serif", padding: '24px',
      ...bgStyle,
    }}>
      <div style={{
        textAlign: 'center', padding: '40px 32px', maxWidth: '420px', width: '100%',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚫{ability.emoji}</div>
        <h1 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: '700', color: 'white' }}>
          Fehlende Berechtigung
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px', lineHeight: 1.6, fontSize: '15px' }}>
          Du benötigst <strong style={{ color: '#ec4899' }}>{ability.emoji} {ability.name}</strong> für diese Seite.<br />
          Bitte beim <strong style={{ color: 'white' }}>Gildenmeister</strong> anfragen.
        </p>
        <div style={{
          background: 'rgba(236,72,153,0.08)',
          border: '1px solid rgba(236,72,153,0.2)',
          borderRadius: '16px', padding: '14px 16px', marginBottom: '24px',
          fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
        }}>
          {ability.emoji} <strong style={{ color: '#ec4899' }}>{ability.name}</strong>
          {ability.description ? ' — ' + ability.description : ''}
        </div>
        <a href="/start" style={{
          display: 'inline-block', padding: '14px 28px',
          background: 'linear-gradient(135deg, #ec4899, #a855f7)',
          color: 'white', borderRadius: '100px',
          textDecoration: 'none', fontWeight: '700', fontSize: '15px',
          boxShadow: '0 4px 16px rgba(236,72,153,0.35)',
        }}>
          ← Zurück zur App
        </a>
      </div>
    </div>
  )
}

export default function NoAccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'rgba(255,255,255,0.5)' }}>
        Laden...
      </div>
    }>
      <NoAccessContent />
    </Suspense>
  )
}
