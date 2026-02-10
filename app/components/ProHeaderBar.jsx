import { useNavigate } from 'react-router'
import { useLanguage } from '../context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
      border: '1.5px solid rgba(255, 255, 255, 0.2)',
      height: '44px',
      gap: '8px',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '24px',
          fontWeight: '300',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
        }}
      >
        ‹
      </button>

      {/* Title */}
      <span style={{
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        letterSpacing: '0.5px',
        flex: 1,
        textAlign: 'center',
      }}>
        {title}
      </span>

      {/* Globe + Language Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        {/* Globe */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        
        {/* Language Toggle Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '18px',
          padding: '3px',
          border: '1px solid rgba(255,255,255,0.1)',
          gap: '1px',
        }}>
          {/* DE Button */}
          <button
            onClick={() => setLanguage('de')}
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: language === 'de' ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '14px',
              backgroundColor: language === 'de' ? '#ec4899' : 'transparent',
              transition: 'all 0.2s ease-out',
              border: 'none',
              boxShadow: language === 'de' ? '0 4px 12px rgba(236, 72, 153, 0.4)' : 'none',
            }}
          >
            DE
          </button>
          
          {/* EN Button */}
          <button
            onClick={() => setLanguage('en')}
            style={{
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '14px',
              backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
              color: language === 'en' ? 'white' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease-out',
              border: 'none',
              boxShadow: language === 'en' ? '0 4px 12px rgba(236, 72, 153, 0.4)' : 'none',
            }}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  )
}
