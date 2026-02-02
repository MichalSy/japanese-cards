import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading') // loading, playing, finished
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState({}) // Map of card id -> isCorrect
  const [displayCards, setDisplayCards] = useState([]) // What to show (real or fake)
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
    const count = cardCount === 'all' ? items.length : parseInt(cardCount)
    
    // Build card deck (repeat if necessary)
    let deck = []
    while (deck.length < count) {
      const remaining = count - deck.length
      const itemsToAdd = [...items].sort(() => Math.random() - 0.5).slice(0, remaining)
      deck = [...deck, ...itemsToAdd]
    }
    
    // Generate correct answers for each card (50/50 random)
    const answers = {}
    const display = []
    
    deck.forEach((card, idx) => {
      const isCorrectAnswer = Math.random() > 0.5
      answers[`${idx}-${card.id}`] = isCorrectAnswer
      
      // If correct answer, show the real card
      // If incorrect answer, show random other card from items
      if (isCorrectAnswer) {
        display.push(card)
      } else {
        // Pick random different card from items
        const randomCard = items[Math.floor(Math.random() * items.length)]
        display.push(randomCard)
      }
    })
    
    setCards(deck)
    setDisplayCards(display)
    setCorrectAnswers(answers)
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
    // Return 3-4 display cards for stack (what user sees)
    return displayCards.slice(currentIndex, currentIndex + 4)
  }, [displayCards, currentIndex])

  return {
    gameState,
    currentCard: displayCards[currentIndex], // Show what user sees
    realCard: cards[currentIndex], // The actual card for tracking
    cardStack: getCardStack(),
    currentIndex,
    totalCards: cards.length,
    stats,
    handleSwipe,
    correctAnswer: cards[currentIndex] ? correctAnswers[`${currentIndex}-${cards[currentIndex].id}`] : null,
  }
}
