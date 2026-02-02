import { useNavigate, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'

export default function AppHeaderBar({ title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
      gap: 'var(--spacing-4)',
    }}>
      {/* Left slot - always reserve space for back button */}
      <div style={{ width: '44px', flexShrink: 0 }}>
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              color: 'var(--color-text-primary)',
              fontSize: '20px',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '50%',
              transition: 'all 0.2s',
              backgroundColor: 'transparent',
              lineHeight: 1,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-light)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ←
          </button>
        )}
      </div>

      {/* Center - always centered title */}
      <h1 className="text-lg font-bold" style={{
        color: 'var(--color-text-primary)',
        margin: 0,
        textAlign: 'center',
        flex: 1,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {title || 'Japanese Cards'}
      </h1>

      {/* Right - language toggle */}
      <div style={{ width: '100px', flexShrink: 0, textAlign: 'right' }}>
        <LanguageToggle />
      </div>
    </div>
  )
}
