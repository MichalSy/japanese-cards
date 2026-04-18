'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSettings } from '@/components/SettingsContext'
import { useBackHandler } from '@/components/BackHandlerContext'

export default function AppHeaderBar({ title }) {
  const router = useRouter()
  const pathname = usePathname()
  const { settings } = useSettings()
  const contextHandler = useBackHandler()

  const isHome = pathname === '/'
  const handleBack = contextHandler ?? (() => router.back())

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 12px',
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: 'inset 0 0 12px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      height: '60px', width: '100%', boxSizing: 'border-box',
      flexShrink: 0,
    }}>
      {!isHome ? (
        <button
          onClick={handleBack}
          style={{
            width: '36px', height: '36px', flexShrink: 0,
            borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', transition: 'background-color 0.2s', padding: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      ) : (
        <div style={{ width: '36px', height: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '20px' }}>{settings.appIcon}</span>
        </div>
      )}

      <span style={{
        fontSize: '17px', fontWeight: '700', color: 'white',
        letterSpacing: '0.3px', whiteSpace: 'nowrap',
        marginLeft: '10px', flex: 1,
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}>
        {title || settings.appTitle}
      </span>

      <button
        onClick={() => router.push('/settings')}
        style={{
          width: '36px', height: '36px', flexShrink: 0,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background-color 0.2s', padding: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)' }}
        aria-label="Settings"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  )
}
