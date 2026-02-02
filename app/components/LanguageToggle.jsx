import { Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      <Globe size={18} style={{ color: 'var(--color-text-primary)' }} />
      <button
        onClick={toggleLanguage}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: 'var(--color-surface-light)',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {/* DE Button */}
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            color: language === 'de' ? 'white' : 'var(--color-text-tertiary)',
            backgroundColor: language === 'de' ? 'var(--color-primary)' : 'transparent',
          }}
        >
          DE
        </div>

        {/* EN Button */}
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            color: language === 'en' ? 'white' : 'var(--color-text-tertiary)',
            backgroundColor: language === 'en' ? 'var(--color-primary)' : 'transparent',
          }}
        >
          EN
        </div>
      </button>
    </div>
  )
}
