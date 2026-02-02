import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('de')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  // Save language to localStorage when it changes
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'de' ? 'en' : 'de'
      localStorage.setItem('language', newLanguage)
      return newLanguage
    })
  }

  if (!isLoaded) {
    return null
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
