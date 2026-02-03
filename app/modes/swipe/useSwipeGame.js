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
      // 50/50: show correct meaning or random wrong meaning
      const isCorrectMeaning = Math.random() > 0.5
      
      if (isCorrectMeaning) {
        // Show the real card with its correct romaji
        display.push({
          ...card,
          shownRomaji: card.romaji,    // What user sees (correct)
          correctRomaji: card.romaji,  // The right answer
        })
      } else {
        // Show the character but with a DIFFERENT wrong romaji
        let wrongCard
        // Keep trying until we find a different romaji
        do {
          wrongCard = items[Math.floor(Math.random() * items.length)]
        } while (wrongCard.romaji === card.romaji)
        
        // Combine: show character from deck, romaji from random different item
        display.push({
          ...card,
          shownRomaji: wrongCard.romaji,  // What user sees (wrong)
          correctRomaji: card.romaji,     // The right answer (hidden)
        })
      }
      
      // Store if the pairing is correct (for scoring)
      // Right swipe = "this pairing is correct"
      // True = user should swipe right, False = user should swipe left
      answers[`${idx}-${card.id}`] = isCorrectMeaning
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
        mistakes: [...prev.mistakes, {
          realCard: cards[currentIndex], // The actual character
          displayedCard: displayCards[currentIndex], // What was shown (with possibly wrong meaning)
          userAction: swipeDirection, // 'left' or 'right'
          wasCorrectPairing: correctAnswers[`${currentIndex}-${cards[currentIndex].id}`],
        }]
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
