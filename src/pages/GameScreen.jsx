import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'

export default function GameScreen() {
  const { contentType, groupId, modeId } = useParams()
  const navigate = useNavigate()

  const modeNames = {
    swipe: { name: 'Swipe Game', emoji: '👆', color: 'from-pink-500 to-rose-500' },
    multiChoice: { name: 'Multiple Choice', emoji: '🎯', color: 'from-blue-500 to-cyan-500' },
    flashcard: { name: 'Flashcard', emoji: '🃏', color: 'from-purple-500 to-pink-500' },
    typing: { name: 'Typing Challenge', emoji: '⌨️', color: 'from-orange-500 to-red-500' },
  }

  const mode = modeNames[modeId]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-white/10 rounded-xl transition-all"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{mode?.name}</h1>
            <p className="text-purple-300 text-xs">{contentType} / {groupId}</p>
          </div>
          <span className="text-4xl ml-auto">{mode?.emoji}</span>
        </div>

        {/* Game Area */}
        <div className={`flex-1 bg-gradient-to-br ${mode?.color} rounded-3xl shadow-2xl p-6 flex items-center justify-center`}>
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">{mode?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-3">Spiel wird geladen...</h2>
            <p className="text-white/80 mb-8">Das {mode?.name} wird gerade vorbereitet</p>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95">
              <Play size={20} />
              Starten
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-lg border border-white/20 text-center">
          <p className="text-purple-300 text-sm">
            💡 Tipp: Diese Seite wird bald mit echtem Gameplay gefüllt!
          </p>
        </div>
      </div>
    </div>
  )
}
