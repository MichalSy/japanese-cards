'use client'

const bgStyle = {
  background: `
    radial-gradient(circle at 15% 10%, rgba(236,72,153,0.4) 0%, transparent 50%),
    radial-gradient(circle at 85% 95%, rgba(236,72,153,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 25%, #0f172a 50%, #0d1e3f 100%)
  `,
  backgroundAttachment: 'fixed',
}

export function AppLayout({ children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-family)',
      ...bgStyle,
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
  return <div className="content">{children}</div>
}

export function AppFooter({ children }) {
  return <div className="footer">{children}</div>
}

export function Card({ children, interactive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card ${interactive ? 'card-interactive' : ''}`}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

