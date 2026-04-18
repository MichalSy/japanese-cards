import { useState, useEffect, useCallback } from 'react'
import { recordCorrect, recordWrong } from '@/utils/progressStorage'

export function useSwipeGame(items, cardCount, category) {
  const [gameState, setGameState] = useState('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState({})
  const [displayCards, setDisplayCards] = useState([])
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, mistakes: [] })

  useEffect(() => {
    if (!items || items.length === 0) {
      setGameState('error')
      return
    }

    const count = cardCount === 'all' ? items.length : parseInt(cardCount)

    let deck = []
    while (deck.length < count) {
      const remaining = count - deck.length
      const itemsToAdd = [...items].sort(() => Math.random() - 0.5).slice(0, remaining)
      deck = [...deck, ...itemsToAdd]
    }

    const answers = {}
    const display = []

    const correctnessArray = [
      ...Array(Math.ceil(deck.length / 2)).fill(true),
      ...Array(Math.floor(deck.length / 2)).fill(false)
    ].sort(() => Math.random() - 0.5)

    deck.forEach((card, idx) => {
      const isCorrectMeaning = correctnessArray[idx]

      if (isCorrectMeaning) {
        display.push({ ...card, shownTransliteration: card.transliteration, correctTransliteration: card.transliteration, isWrongPairing: false })
      } else {
        let wrongCard
        let attempts = 0
        do {
          wrongCard = items[Math.floor(Math.random() * items.length)]
          attempts++
        } while (wrongCard.transliteration === card.transliteration && attempts < 20)

        if (wrongCard.transliteration === card.transliteration) {
          display.push({ ...card, shownTransliteration: card.transliteration, correctTransliteration: card.transliteration, isWrongPairing: false })
        } else {
          display.push({ ...card, shownTransliteration: wrongCard.transliteration, correctTransliteration: card.transliteration, isWrongPairing: true })
        }
      }

      answers[`${idx}-${card.id}`] = isCorrectMeaning
    })

    setCards(deck)
    setDisplayCards(display)
    setCorrectAnswers(answers)
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect, swipeDirection) => {
    const nextIndex = currentIndex + 1
    const currentCard = cards[currentIndex]

    if (category && currentCard) {
      if (isCorrect) recordCorrect(category, currentCard.id)
      else recordWrong(category, currentCard.id)
    }

    if (!isCorrect) {
      setStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        mistakes: [...prev.mistakes, {
          realCard: cards[currentIndex],
          displayedCard: displayCards[currentIndex],
          userAction: swipeDirection,
          wasCorrectPairing: correctAnswers[`${currentIndex}-${cards[currentIndex].id}`],
        }]
      }))
    } else {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }))
    }

    if (nextIndex >= cards.length) setGameState('finished')
    else setCurrentIndex(nextIndex)
  }, [currentIndex, cards, category, displayCards, correctAnswers])

  const getCardStack = useCallback(() => {
    return displayCards.slice(currentIndex, currentIndex + 4)
  }, [displayCards, currentIndex])

  return {
    gameState,
    currentCard: displayCards[currentIndex],
    realCard: cards[currentIndex],
    cardStack: getCardStack(),
    currentIndex,
    totalCards: cards.length,
    stats,
    handleSwipe,
    correctAnswer: cards[currentIndex] ? correctAnswers[`${currentIndex}-${cards[currentIndex].id}`] : null,
  }
}
