import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()

  const groupNames = {
    hiragana: {
      a: 'Hiragana - A-Reihe',
      ka: 'Hiragana - Ka-Reihe',
      sa: 'Hiragana - Sa-Reihe',
      ta: 'Hiragana - Ta-Reihe',
      na: 'Hiragana - Na-Reihe',
    },
    katakana: {
      a: 'Katakana - A-Reihe',
      ka: 'Katakana - Ka-Reihe',
    },
  }

  const gameModes = [
    {
      id: 'swipe',
      name: 'Swipe Game',
      emoji: '👆',
      description: 'Wische links oder rechts',
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Einfach',
    },
    {
      id: 'multiChoice',
      name: 'Multiple Choice',
      emoji: '🎯',
      description: 'Wähle die richtige Antwort',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Mittel',
    },
    {
      id: 'flashcard',
      name: 'Flashcard',
      emoji: '🃏',
      description: 'Karte umdrehen',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Einfach',
    },
    {
      id: 'typing',
      name: 'Typing Challenge',
      emoji: '⌨️',
      description: 'Tippe das Romaji',
      color: 'from-orange-500 to-red-500',
      difficulty: 'Schwer',
    },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'
  const stats = { total: 15, correct: 14, accuracy: 93.33 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-20">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/content/${contentType}`)}
            className="p-3 hover:bg-white/10 rounded-xl transition-all"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{groupName}</h1>
            <p className="text-purple-300 text-xs">Wähle einen Spiel-Modus</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 backdrop-blur-lg border border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-white font-semibold">Deine Statistik</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{stats.correct}/{stats.total}</div>
              <div className="text-xs text-green-300">Korrekt</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{stats.accuracy.toFixed(1)}%</div>
              <div className="text-xs text-blue-300">Genauigkeit</div>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="space-y-3 mb-8">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
              className={`w-full p-4 bg-gradient-to-br ${mode.color} hover:shadow-2xl text-white rounded-2xl font-semibold transition-all transform hover:scale-105 hover:-translate-y-1 shadow-lg active:scale-95`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{mode.emoji}</span>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-lg">{mode.name}</h3>
                  <p className="text-sm opacity-90">{mode.description}</p>
                  <span className="inline-block text-xs opacity-75 mt-1 bg-white/20 px-2 py-1 rounded">
                    {mode.difficulty}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
          <p className="text-center text-purple-300 text-sm">Wähle einen Modus zum Spielen</p>
        </div>
      </div>
    </div>
  )
}
