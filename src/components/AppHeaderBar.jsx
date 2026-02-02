import { useNavigate, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'

export default function AppHeaderBar({ title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '100px 1fr 100px',
      alignItems: 'center',
      width: '100%',
      gap: 'var(--spacing-2)',
    }}>
      {/* Left - Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
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

      {/* Center - Title */}
      <h1 className="text-lg font-bold" style={{
        color: 'var(--color-text-primary)',
        margin: 0,
        textAlign: 'center',
      }}>
        {title || 'Japanese Cards'}
      </h1>

      {/* Right - Language Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <LanguageToggle />
      </div>
    </div>
  )
}
