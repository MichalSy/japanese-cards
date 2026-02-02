import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - Japanese Cards`
    } else {
      document.title = 'Japanese Cards'
    }
  }, [title])
}

export function useRouteTitle() {
  const location = useLocation()

  useEffect(() => {
    // Parse route and set appropriate title
    const pathname = location.pathname
    
    if (pathname === '/') {
      document.title = 'Japanese Cards'
    } else if (pathname.startsWith('/content/')) {
      const parts = pathname.split('/').filter(Boolean)
      // content/hiragana or content/hiragana/a etc
      if (parts.length === 2) {
        const category = parts[1]
        const titles = {
          hiragana: 'ひらがな',
          katakana: 'カタカナ',
          words: 'Vokabeln',
          sentences: 'Sätze',
        }
        document.title = `${titles[category] || category} - Japanese Cards`
      } else if (parts.length === 3) {
        const category = parts[1]
        const group = parts[2]
        const categoryNames = {
          hiragana: 'ひらがな',
          katakana: 'カタカナ',
        }
        const categoryName = categoryNames[category] || category
        
        if (group === 'all') {
          document.title = `${categoryName} - Alle kombiniert - Japanese Cards`
        } else {
          const groupName = group.toUpperCase().replace(/^./, group[0])
          document.title = `${categoryName} - ${groupName}-Reihe - Japanese Cards`
        }
      }
    } else if (pathname.startsWith('/game/')) {
      const parts = pathname.split('/').filter(Boolean)
      const modeId = parts[3]
      const modeNames = {
        swipe: 'Swipe Game',
        multiChoice: 'Multiple Choice',
        flashcard: 'Flashcard',
        typing: 'Typing Challenge',
      }
      document.title = `${modeNames[modeId] || modeId} - Japanese Cards`
    }
  }, [location.pathname])
}
