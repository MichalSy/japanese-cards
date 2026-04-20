import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayCards, setDisplayCards] = useState([])
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, mistakes: [], results: [] })

  useEffect(() => {
    if (!items || items.length === 0) { setGameState('error'); return }

    const count = cardCount === 'all' ? items.length : parseInt(cardCount)

    // Each card appears exactly once as a correct pairing
    let baseDeck = []
    while (baseDeck.length < count) {
      const remaining = count - baseDeck.length
      baseDeck = [...baseDeck, ...[...items].sort(() => Math.random() - 0.5).slice(0, remaining)]
    }

    const correctPairings = baseDeck.map(card => ({
      ...card,
      shownTransliteration: card.transliteration,
      correctTransliteration: card.transliteration,
      isWrongPairing: false,
    }))

    // Inject ~25% additional wrong pairings as decoys
    const wrongCount = Math.max(1, Math.round(baseDeck.length * 0.25))
    const wrongPairings = [...baseDeck]
      .sort(() => Math.random() - 0.5)
      .slice(0, wrongCount)
      .reduce((acc, card) => {
        let wrongCard, attempts = 0
        do { wrongCard = items[Math.floor(Math.random() * items.length)]; attempts++ }
        while (wrongCard.transliteration === card.transliteration && attempts < 20)
        if (wrongCard.transliteration !== card.transliteration) {
          acc.push({
            ...card,
            shownTransliteration: wrongCard.transliteration,
            correctTransliteration: card.transliteration,
            isWrongPairing: true,
          })
        }
        return acc
      }, [])

    const allCards = [...correctPairings, ...wrongPairings].sort(() => Math.random() - 0.5)

    setDisplayCards(allCards)
    setCurrentIndex(0)
    setStats({ correct: 0, incorrect: 0, mistakes: [], results: [] })
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect) => {
    const card = displayCards[currentIndex]
    const nextIndex = currentIndex + 1

    // Only track stats for real pairings — wrong pairings are neutral decoys
    if (!card.isWrongPairing) {
      setStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        results: [...prev.results, { cardSlug: card.id, isCorrect }],
        mistakes: isCorrect ? prev.mistakes : [...prev.mistakes, { card, displayedCard: card }],
      }))
    }

    if (nextIndex >= displayCards.length) setGameState('finished')
    else setCurrentIndex(nextIndex)
  }, [currentIndex, displayCards])

  return {
    gameState,
    currentCard: displayCards[currentIndex],
    cardStack: displayCards.slice(currentIndex, currentIndex + 4),
    currentIndex,
    totalCards: displayCards.length,
    stats,
    handleSwipe,
    // true = correct pairing (swipe right), false = wrong pairing (swipe left)
    correctAnswer: displayCards[currentIndex] ? !displayCards[currentIndex].isWrongPairing : null,
  }
}
