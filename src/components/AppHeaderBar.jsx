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
      gap: 'var(--spacing-4)',
    }}>
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
        textAlign: 'center',
        flex: 1,
      }}>
        {title || 'Japanese Cards'}
      </h1>

      <LanguageToggle />
    </div>
  )
}
