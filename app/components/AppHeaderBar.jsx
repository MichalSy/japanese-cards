import { useNavigate, useLocation } from 'react-router'
import LanguageToggle from './LanguageToggle'

export default function AppHeaderBar({ title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '16px', // Equal padding top, left, bottom (and right)
      boxSizing: 'border-box',
    }}>
      {/* Left Group: Back Button + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              color: 'var(--color-text-primary)',
              fontSize: '24px',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
              backgroundColor: 'transparent',
              padding: 0, // Reset padding for perfect centering
              margin: 0,
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

        <h1 className="text-lg font-bold" style={{
          color: 'var(--color-text-primary)',
          margin: 0,
          textAlign: 'left',
          lineHeight: 1,
        }}>
          {title || 'Japanese Cards'}
        </h1>
      </div>

      {/* Right - Language Toggle */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LanguageToggle />
      </div>
    </div>
  )
}
