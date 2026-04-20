import { useState, useEffect, useCallback } from 'react'

export function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayCards, setDisplayCards] = useState([])
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, mistakes: [], results: [] })

  useEffect(() => {
    if (!items || items.length === 0) { setGameState('error'); return }

    const count = cardCount === 'all' ? items.length : parseInt(cardCount)

    // Each card appears exactly once — binary choice (left vs right)
    let baseDeck = []
    while (baseDeck.length < count) {
      const remaining = count - baseDeck.length
      baseDeck = [...baseDeck, ...[...items].sort(() => Math.random() - 0.5).slice(0, remaining)]
    }

    const cards = baseDeck.map(card => {
      // Wrong option: prefer same group, fallback to all items
      const sameGroup = items.filter(i => i.group_name === card.group_name && i.transliteration !== card.transliteration)
      const pool = sameGroup.length > 0 ? sameGroup : items.filter(i => i.transliteration !== card.transliteration)
      if (pool.length === 0) return null
      const wrongCard = pool[Math.floor(Math.random() * pool.length)]

      const correctOnRight = Math.random() > 0.5
      return {
        ...card,
        correctTransliteration: card.transliteration,
        leftOption: correctOnRight ? wrongCard.transliteration : card.transliteration,
        rightOption: correctOnRight ? card.transliteration : wrongCard.transliteration,
        correctOnRight,
      }
    }).filter(Boolean)

    setDisplayCards(cards)
    setCurrentIndex(0)
    setStats({ correct: 0, incorrect: 0, mistakes: [], results: [] })
    setGameState('playing')
  }, [items, cardCount])

  const handleSwipe = useCallback((isCorrect) => {
    const card = displayCards[currentIndex]
    const nextIndex = currentIndex + 1

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      results: [...prev.results, { cardSlug: card.id, isCorrect }],
      mistakes: isCorrect ? prev.mistakes : [...prev.mistakes, { card }],
    }))

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
    // true = right side is correct, false = left side is correct
    correctAnswer: displayCards[currentIndex]?.correctOnRight ?? null,
  }
}
