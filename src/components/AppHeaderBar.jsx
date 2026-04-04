'use client'

import { useRouter, usePathname } from 'next/navigation'
import LanguageToggle from './LanguageToggle'

export default function AppHeaderBar({ title }) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '16px', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isHome && (
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px',
              color: 'var(--color-text-primary)', fontSize: '24px', cursor: 'pointer',
              border: 'none', borderRadius: '50%', transition: 'background-color 0.2s',
              backgroundColor: 'transparent', padding: 0, margin: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-light)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            ←
          </button>
        )}
        <h1 className="text-lg font-bold" style={{
          color: 'var(--color-text-primary)', margin: 0, textAlign: 'left', lineHeight: 1,
        }}>
          {title || 'Japanese Cards'}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LanguageToggle />
      </div>
    </div>
  )
}
