'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      <Globe size={18} style={{ color: 'var(--color-text-primary)' }} />
      <button
        onClick={toggleLanguage}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px', backgroundColor: 'var(--color-surface-light)',
          border: 'none', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s ease',
        }}
      >
        {['de', 'en'].map((lang) => (
          <div
            key={lang}
            style={{
              padding: '6px 12px', borderRadius: '16px',
              fontSize: '12px', fontWeight: '600', transition: 'all 0.3s ease',
              color: language === lang ? 'white' : 'var(--color-text-tertiary)',
              backgroundColor: language === lang ? 'var(--color-primary)' : 'transparent',
            }}
          >
            {lang.toUpperCase()}
          </div>
        ))}
      </button>
    </div>
  )
}
