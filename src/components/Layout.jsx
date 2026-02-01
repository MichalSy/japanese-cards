export function AppLayout({ children }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--color-bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-family)'
    }}>
      {children}
    </div>
  )
}

export function AppHeader({ children, onBack }) {
  return (
    <div className="header">
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: 'var(--spacing-2)',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}
      {children}
    </div>
  )
}

export function AppContent({ children }) {
  return (
    <div className="content">
      {children}
    </div>
  )
}

export function AppFooter({ children }) {
  return (
    <div className="footer">
      {children}
    </div>
  )
}

export function Card({ children, interactive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card ${interactive ? 'card-interactive' : ''}`}
      style={{
        cursor: interactive ? 'pointer' : 'default'
      }}
      onMouseDown={(e) => interactive && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </div>
  )
}

export function Button({ children, variant = 'filled', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`button button-${variant}`}
      style={{
        width: '100%'
      }}
    >
      {children}
    </button>
  )
}
