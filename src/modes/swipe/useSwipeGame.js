import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading') // loading, playing, finished
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState([])
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    mistakes: []
  })

  // Initialize game with shuffled items
  useEffect(() => {
    if (!items || items.length === 0) {
      setGameState('error')
      return
    }

    // Determine how many cards to use
    const count = cardCount === 'all' ? items.length : Math.min(parseInt(cardCount), items.length)
    
    // Shuffle and take only needed count
    const shuffled = [...items]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
    
    setCards(shuffled)
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect, swipeDirection) => {
    const nextIndex = currentIndex + 1

    if (!isCorrect) {
      setStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        mistakes: [...prev.mistakes, cards[currentIndex]]
      }))
    } else {
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }))
    }

    // Check if game is finished
    if (nextIndex >= cards.length) {
      setGameState('finished')
    } else {
      setCurrentIndex(nextIndex)
    }
  }, [currentIndex, cards])

  const getCardStack = useCallback(() => {
    // Return 3-4 cards for stack (current + buffer)
    return cards.slice(currentIndex, currentIndex + 4)
  }, [cards, currentIndex])

  return {
    gameState,
    currentCard: cards[currentIndex],
    cardStack: getCardStack(),
    currentIndex,
    totalCards: cards.length,
    stats,
    handleSwipe,
  }
}
