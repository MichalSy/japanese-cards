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

export function AppHeader({ children }) {
  return (
    <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
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
