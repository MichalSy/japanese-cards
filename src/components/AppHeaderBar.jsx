'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function AppHeaderBar({ title, onBack }) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = !onBack && pathname === '/'
  const { language, setLanguage } = useLanguage()

  const handleBack = onBack || (() => router.back())

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
            cursor: 'pointer', color: 'white', fontSize: '20px', fontWeight: '300',
            transition: 'background-color 0.2s', padding: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
        >‹</button>
      ) : (
        <div style={{ width: '36px', height: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '20px' }}>🌸</span>
        </div>
      )}

      <span style={{
        fontSize: '17px', fontWeight: '700', color: 'white',
        letterSpacing: '0.3px', whiteSpace: 'nowrap',
        marginLeft: '10px', flex: 1,
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}>
        {title || 'Japanese Cards'}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: '6px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <div style={{
          display: 'flex', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '18px',
          padding: '3px', border: '1px solid rgba(255,255,255,0.1)', gap: '1px',
        }}>
          {['de', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                fontSize: '11px', fontWeight: '700',
                color: language === lang ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', padding: '4px 10px', borderRadius: '14px',
                backgroundColor: language === lang ? '#ec4899' : 'transparent',
                transition: 'all 0.2s ease-out', border: 'none',
                boxShadow: language === lang ? '0 4px 12px rgba(236,72,153,0.4)' : 'none',
              }}
            >{lang.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
