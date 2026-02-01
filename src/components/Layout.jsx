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

export function AppHeader({ children, onBack, progress }) {
  return (
    <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Back Button or Placeholder */}
      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
      </div>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>

      {/* Progress Badge */}
      {progress && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-1) var(--spacing-3)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid var(--color-primary)',
          borderRadius: '9999px',
          flexShrink: 0
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
            {progress}
          </span>
        </div>
      )}
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
