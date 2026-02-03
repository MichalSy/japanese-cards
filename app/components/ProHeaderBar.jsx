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
      padding: '12px 16px',
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      margin: '12px 16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '18px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      >
        ←
      </button>

      {/* Title */}
      <span style={{
        fontSize: '17px',
        fontWeight: '600',
        color: 'white',
        letterSpacing: '0.3px',
      }}>
        {title}
      </span>

      {/* Language Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {/* Globe Icon */}
        <span style={{ 
          fontSize: '18px', 
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          🌐
        </span>
        
        {/* Language Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '3px',
        }}>
          <button
            onClick={() => setLanguage('de')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: language === 'de' ? '#ec4899' : 'transparent',
              color: language === 'de' ? 'white' : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            DE
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
              color: language === 'en' ? 'white' : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  )
}
