'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      height: '52px', position: 'relative', boxSizing: 'border-box',
    }}>
      <button
        onClick={() => router.back()}
        style={{
          width: '36px', height: '36px', flexShrink: 0, zIndex: 1,
          borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', fontSize: '20px', fontWeight: '300',
          transition: 'background-color 0.2s', padding: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)' }}
      >
        ‹
      </button>

      <span style={{
        fontSize: '18px', fontWeight: '700', color: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', letterSpacing: '0.5px',
        whiteSpace: 'nowrap', marginLeft: '12px', flex: 1,
      }}>
        {title}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, zIndex: 1, gap: '6px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
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
                boxShadow: language === lang ? '0 4px 12px rgba(236, 72, 153, 0.4)' : 'none',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
