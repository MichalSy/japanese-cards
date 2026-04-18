import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState({})
  const [displayCards, setDisplayCards] = useState([])
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, mistakes: [], results: [] })

  useEffect(() => {
    if (!items || items.length === 0) { setGameState('error'); return }

    const count = cardCount === 'all' ? items.length : parseInt(cardCount)
    let deck = []
    while (deck.length < count) {
      const remaining = count - deck.length
      deck = [...deck, ...[...items].sort(() => Math.random() - 0.5).slice(0, remaining)]
    }

    const answers = {}
    const display = []
    const wrongCount = Math.max(1, Math.round(deck.length * 0.25))
    const correctnessArray = [
      ...Array(deck.length - wrongCount).fill(true),
      ...Array(wrongCount).fill(false),
    ].sort(() => Math.random() - 0.5)

    deck.forEach((card, idx) => {
      const isCorrect = correctnessArray[idx]
      if (isCorrect) {
        display.push({ ...card, shownTransliteration: card.transliteration, correctTransliteration: card.transliteration, isWrongPairing: false })
      } else {
        let wrongCard, attempts = 0
        do { wrongCard = items[Math.floor(Math.random() * items.length)]; attempts++ }
        while (wrongCard.transliteration === card.transliteration && attempts < 20)
        if (wrongCard.transliteration === card.transliteration) {
          display.push({ ...card, shownTransliteration: card.transliteration, correctTransliteration: card.transliteration, isWrongPairing: false })
        } else {
          display.push({ ...card, shownTransliteration: wrongCard.transliteration, correctTransliteration: card.transliteration, isWrongPairing: true })
        }
      }
      answers[`${idx}-${card.id}`] = isCorrect
    })

    setCards(deck)
    setDisplayCards(display)
    setCorrectAnswers(answers)
    setStats({ correct: 0, incorrect: 0, mistakes: [], results: [] })
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect, swipeDirection) => {
    const currentCard = cards[currentIndex]
    const nextIndex = currentIndex + 1

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      results: [...prev.results, { cardSlug: currentCard?.id, isCorrect }],
      mistakes: isCorrect ? prev.mistakes : [...prev.mistakes, {
        realCard: cards[currentIndex],
        displayedCard: displayCards[currentIndex],
        userAction: swipeDirection,
        wasCorrectPairing: correctAnswers[`${currentIndex}-${cards[currentIndex]?.id}`],
      }],
    }))

    if (nextIndex >= cards.length) setGameState('finished')
    else setCurrentIndex(nextIndex)
  }, [currentIndex, cards, displayCards, correctAnswers])

  return {
    gameState,
    currentCard: displayCards[currentIndex],
    cardStack: displayCards.slice(currentIndex, currentIndex + 4),
    currentIndex,
    totalCards: cards.length,
    stats,
    handleSwipe,
    correctAnswer: cards[currentIndex] ? correctAnswers[`${currentIndex}-${cards[currentIndex].id}`] : null,
  }
}
