import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()

  // Statische Daten
  const groupNames = {
    hiragana: {
      a: 'Hiragana - A-Reihe',
      ka: 'Hiragana - Ka-Reihe',
    },
    katakana: {
      a: 'Katakana - A-Reihe',
    },
  }

  const gameModes = [
    {
      id: 'swipe',
      name: 'Swipe Game',
      emoji: '👆',
      description: 'Wische links oder rechts',
      color: 'from-pink-400 to-purple-400',
    },
    {
      id: 'multiChoice',
      name: 'Multiple Choice',
      emoji: '🎯',
      description: 'Wähle die richtige Antwort',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      id: 'flashcard',
      name: 'Flashcard',
      emoji: '🃏',
      description: 'Karte umdrehen',
      color: 'from-green-400 to-emerald-400',
    },
    {
      id: 'typing',
      name: 'Typing Challenge',
      emoji: '⌨️',
      description: 'Tippe das Romaji',
      color: 'from-orange-400 to-red-400',
    },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'
  const stats = { total: 15, correct: 14, accuracy: 93.33 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 bg-white rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => navigate(`/content/${contentType}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{groupName}</h1>
            <p className="text-gray-600 text-sm">Wähle einen Spiel-Modus</p>
          </div>
        </div>

        {/* Game Modes */}
        <div className="space-y-3 mb-8">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
              className={`w-full py-5 px-4 bg-gradient-to-r ${mode.color} hover:shadow-lg text-white rounded-xl font-semibold transition transform hover:scale-105`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.emoji}</span>
                <div className="text-left">
                  <h3 className="font-bold">{mode.name}</h3>
                  <p className="text-sm opacity-90">{mode.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Deine Statistik</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Korrekt:</span>
              <span className="text-xl font-bold text-green-600">{stats.correct}/{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Genauigkeit:</span>
              <span className="text-xl font-bold text-blue-600">{stats.accuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${stats.accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
