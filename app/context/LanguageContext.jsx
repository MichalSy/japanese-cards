import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Initialize from localStorage immediately
    try {
      return localStorage.getItem('language') || 'de'
    } catch {
      return 'de'
    }
  })

  // Save language to localStorage when it changes
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'de' ? 'en' : 'de'
      try {
        localStorage.setItem('language', newLanguage)
      } catch (e) {
        console.error('Failed to save language:', e)
      }
      return newLanguage
    })
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
