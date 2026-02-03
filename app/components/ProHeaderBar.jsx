import { useNavigate } from 'react-router'
import { useLanguage } from '../context/LanguageContext'

export default function ProHeaderBar({ title }) {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 10px',
      background: 'rgba(107, 114, 128, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '100px',
      margin: '12px 16px',
    }}>
      {/* Back Button - dark circle with < */}
      <button
        onClick={() => navigate(-1)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(55, 65, 81, 0.9)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '20px',
          fontWeight: '300',
          flexShrink: 0,
        }}
      >
        ‹
      </button>

      {/* Title - centered */}
      <span style={{
        flex: 1,
        fontSize: '17px',
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        paddingLeft: '8px',
      }}>
        {title}
      </span>

      {/* Right side: Globe + DE + EN pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '18px', opacity: 0.7 }}>🌐</span>
        
        <span 
          onClick={() => setLanguage('de')}
          style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: language === 'de' ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '6px 8px',
          }}
        >
          DE
        </span>
        
        <button
          onClick={() => setLanguage('en')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: language === 'en' ? '#ec4899' : 'transparent',
            color: 'white',
          }}
        >
          EN
        </button>
      </div>
    </div>
  )
}
