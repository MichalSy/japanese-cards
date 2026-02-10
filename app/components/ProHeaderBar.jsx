import { useNavigate } from 'react-router'
import { useLanguage } from '../context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px', // Equal padding 8px on all sides (Top/Bottom/Left/Right)
      background: 'rgba(255, 255, 255, 0.08)', // White transparent base
      backdropFilter: 'blur(20px)', // Strong blur for glass
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
      boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1)', // Inset glow + soft drop shadow
      border: '1px solid rgba(255, 255, 255, 0.15)', // Crisp border
      height: '52px',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Back Button - Flat Design */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          zIndex: 1,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)', // Flat subtle background
          border: 'none', // No border for flat look
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '20px',
          fontWeight: '300',
          transition: 'background-color 0.2s',
          padding: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      >
        ‹
      </button>

      {/* Title - Next to Back Button */}
      <span style={{
        fontSize: '18px',
        fontWeight: '700',
        color: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
        marginLeft: '12px', // Space between back button and title
        flex: 1, // Push language toggle to right
      }}>
        {title}
      </span>

      {/* Language Toggle + Globe */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        zIndex: 1,
        gap: '6px', // Space between globe and toggle
      }}>
        {/* Globe Icon */}
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
