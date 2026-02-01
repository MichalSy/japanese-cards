export function AppLayout({ children }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {children}
    </div>
  )
}

export function AppHeader({ children, onBack }) {
  return (
    <div style={{
      height: '80px',
      background: 'linear-gradient(to right, #0f172a, #1e293b)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '24px',
      paddingRight: '24px',
      gap: '12px',
      borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'white',
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
    <div style={{
      flex: 1,
      overflowY: 'auto',
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingTop: '24px',
      paddingBottom: '24px'
    }}>
      {children}
    </div>
  )
}

export function AppFooter({ children }) {
  return (
    <div style={{
      height: '80px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid rgba(226, 232, 240, 0.5)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}>
      {children}
    </div>
  )
}

export function Card({ children, interactive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12)',
        transition: 'all 0.2s ease',
        cursor: interactive ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => interactive && (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.12)')}
      onMouseLeave={(e) => interactive && (e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12)')}
      onMouseDown={(e) => interactive && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </div>
  )
}

export function Button({ children, variant = 'filled', onClick, className = '' }) {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  }

  const filledStyle = {
    ...baseStyle,
    background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.12)'
  }

  return (
    <button
      onClick={onClick}
      style={variant === 'filled' ? filledStyle : baseStyle}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  )
}
