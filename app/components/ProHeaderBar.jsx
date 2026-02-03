import { useNavigate } from 'react-router'
import { useLanguage } from '../context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '6px 8px',
      background: 'linear-gradient(180deg, rgba(156, 163, 175, 0.7) 0%, rgba(107, 114, 128, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgba(75, 85, 99, 0.9) 0%, rgba(55, 65, 81, 1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '22px',
          fontWeight: '300',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        ‹
      </button>

      {/* Title */}
      <span style={{
        flex: 1,
        fontSize: '18px',
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        letterSpacing: '0.5px',
      }}>
        {title}
      </span>

      {/* Globe + Language */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        flexShrink: 0,
        marginRight: '4px',
      }}>
        {/* Globe */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" style={{ marginRight: '4px' }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        
        {/* DE */}
        <span 
          onClick={() => setLanguage('de')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '700',
            color: language === 'de' ? 'white' : 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: '20px',
            backgroundColor: language === 'de' ? '#ec4899' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          DE
        </span>
        
        {/* EN */}
        <span
          onClick={() => setLanguage('en')}
          style={{
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '20px',
            backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
            color: language === 'en' ? 'white' : 'rgba(255,255,255,0.6)',
            transition: 'all 0.2s',
            boxShadow: language === 'en' ? '0 2px 8px rgba(236, 72, 153, 0.4)' : 'none',
          }}
        >
          EN
        </span>
      </div>
    </div>
  )
}
