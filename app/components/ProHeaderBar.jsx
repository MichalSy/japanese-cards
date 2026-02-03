import { useNavigate } from 'react-router'
import { useLanguage } from '../context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '6px',
      background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.8) 0%, rgba(55, 65, 81, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '20px',
          fontWeight: '300',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        ‹
      </button>

      {/* Title */}
      <span style={{
        flex: 1,
        fontSize: '17px',
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      }}>
        {title}
      </span>

      {/* Globe + Language */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        marginRight: '4px',
      }}>
        {/* Globe */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" style={{ marginRight: '2px' }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        
        {/* DE */}
        <span 
          onClick={() => setLanguage('de')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: language === 'de' ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '8px 12px',
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
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '20px',
            backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
            color: language === 'en' ? 'white' : 'rgba(255,255,255,0.5)',
            transition: 'all 0.2s',
          }}
        >
          EN
        </span>
      </div>
    </div>
  )
}
