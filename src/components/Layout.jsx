export function AppLayout({ children }) {
  return (
    <div className="fixed inset-0 bg-[var(--md-background)] flex flex-col font-[var(--font-family)]">
      {children}
    </div>
  )
}

export function AppHeader({ children, onBack }) {
  return (
    <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700/30 gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white flex-shrink-0"
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
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {children}
    </div>
  )
}

export function AppFooter({ children }) {
  return (
    <div className="h-20 bg-[var(--md-surface)] border-t border-slate-200/50 flex items-center px-4">
      {children}
    </div>
  )
}

export function Card({ children, interactive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`md-card ${interactive ? 'md-card-interactive' : ''}`}
    >
      {children}
    </div>
  )
}

export function Button({ children, variant = 'filled', onClick, className = '' }) {
  const baseClass = 'md-button'
  const variantClass = variant === 'filled' ? 'md-button-filled' : 'bg-slate-100 text-slate-900'
  
  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}
