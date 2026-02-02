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
      justifyContent: 'space-between',
      width: '100%',
      gap: 'var(--spacing-2)',
    }}>
      <div style={{ flex: 1 }}>
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            ←
          </button>
        )}
      </div>

      <h1 className="text-lg font-bold" style={{
        color: 'var(--color-text-primary)',
        margin: 0,
        textAlign: 'center',
        flex: 2,
      }}>
        {title || 'Japanese Cards'}
      </h1>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <LanguageToggle />
      </div>
    </div>
  )
}
