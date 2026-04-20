import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayCards, setDisplayCards] = useState([])
  const [baseDeckSize, setBaseDeckSize] = useState(0)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, decoyMistakes: 0, mistakes: [], results: [] })

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

    // Inject ~25% wrong pairings as decoys, preferring cards from the same group
    const wrongCount = Math.max(1, Math.round(baseDeck.length * 0.25))
    const wrongPairings = [...baseDeck]
      .sort(() => Math.random() - 0.5)
      .slice(0, wrongCount)
      .reduce((acc, card) => {
        const sameGroup = items.filter(i => i.group_name === card.group_name && i.transliteration !== card.transliteration)
        const pool = sameGroup.length >= 1 ? sameGroup : items.filter(i => i.transliteration !== card.transliteration)
        if (pool.length === 0) return acc
        const wrongCard = pool[Math.floor(Math.random() * pool.length)]
        acc.push({
          ...card,
          shownTransliteration: wrongCard.transliteration,
          correctTransliteration: card.transliteration,
          isWrongPairing: true,
        })
        return acc
      }, [])

    const allCards = [...correctPairings, ...wrongPairings].sort(() => Math.random() - 0.5)

    setBaseDeckSize(baseDeck.length)
    setDisplayCards(allCards)
    setCurrentIndex(0)
    setStats({ correct: 0, incorrect: 0, decoyMistakes: 0, mistakes: [], results: [] })
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect) => {
    const card = displayCards[currentIndex]
    const nextIndex = currentIndex + 1

    if (!card.isWrongPairing) {
      // Real pairing: tracked fully, percent based on this
      setStats(prev => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        results: [...prev.results, { cardSlug: card.id, isCorrect }],
        mistakes: isCorrect ? prev.mistakes : [...prev.mistakes, { card, displayedCard: card }],
      }))
    } else if (!isCorrect) {
      // Wrong pairing swiped right = decoy mistake, tracked separately
      setStats(prev => ({
        ...prev,
        decoyMistakes: prev.decoyMistakes + 1,
        mistakes: [...prev.mistakes, { card, displayedCard: card }],
      }))
    }
    // Wrong pairing swiped left = neutral

    if (nextIndex >= displayCards.length) setGameState('finished')
    else setCurrentIndex(nextIndex)
  }, [currentIndex, displayCards])

  return {
    gameState,
    currentCard: displayCards[currentIndex],
    cardStack: displayCards.slice(currentIndex, currentIndex + 4),
    currentIndex,
    totalCards: displayCards.length,
    baseDeckSize,
    stats,
    handleSwipe,
    correctAnswer: displayCards[currentIndex] ? !displayCards[currentIndex].isWrongPairing : null,
  }
}
