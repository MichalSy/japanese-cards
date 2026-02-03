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
      background: 'rgba(75, 85, 99, 0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '8px 12px',
      gap: '8px',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(55, 65, 81, 1)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '22px',
          fontWeight: '300',
          flexShrink: 0,
        }}
      >
        ‹
      </button>

      {/* Title */}
      <span style={{
        flex: 1,
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
      }}>
        {title}
      </span>

      {/* Globe + Language */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
      }}>
        {/* Globe as SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        
        <span 
          onClick={() => setLanguage('de')}
          style={{ 
            fontSize: '13px', 
            fontWeight: '600',
            color: language === 'de' ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '16px',
            backgroundColor: language === 'de' ? '#ec4899' : 'transparent',
          }}
        >
          DE
        </span>
        
        <span
          onClick={() => setLanguage('en')}
          style={{
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
            color: 'white',
          }}
        >
          EN
        </span>
      </div>
    </div>
  )
}
