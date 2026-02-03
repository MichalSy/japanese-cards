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
      padding: '10px 12px',
      background: 'rgba(55, 65, 81, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(75, 85, 99, 0.9)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '18px',
          transition: 'background-color 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.9)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.9)'}
      >
        ←
      </button>

      {/* Title */}
      <span style={{
        fontSize: '17px',
        fontWeight: '600',
        color: 'white',
        letterSpacing: '0.3px',
        flex: 1,
        textAlign: 'center',
      }}>
        {title}
      </span>

      {/* Right side: Globe + Language Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        {/* Globe Icon */}
        <span style={{ 
          fontSize: '20px', 
          color: 'rgba(255, 255, 255, 0.7)',
        }}>
          🌐
        </span>
        
        {/* Language Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}>
          <button
            onClick={() => setLanguage('de')}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
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
              padding: '8px 14px',
              borderRadius: '20px',
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
