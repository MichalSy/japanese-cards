import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pause } from 'lucide-react'

export default function GameScreen() {
  const { contentType, groupId, modeId } = useParams()
  const navigate = useNavigate()

  const modeNames = {
    swipe: 'Swipe Game',
    multiChoice: 'Multiple Choice',
    flashcard: 'Flashcard',
    typing: 'Typing Challenge',
  }

  const modeEmojis = {
    swipe: '👆',
    multiChoice: '🎯',
    flashcard: '🃏',
    typing: '⌨️',
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">{modeNames[modeId]}</h1>
          <p className="text-xs text-slate-400">Score: 0 / 15</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white">
          <Pause size={24} />
        </button>
      </div>

      {/* Game Content Area */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-7xl mb-6">{modeEmojis[modeId]}</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Game wird geladen...</h2>
          <p className="text-slate-600 text-lg">
            Das {modeNames[modeId]} wird gerade vorbereitet
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-white border-t-2 border-slate-200 flex items-center justify-center px-6 gap-3">
        <button className="flex-1 py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-all active:scale-95">
          Fortschritt
        </button>
        <button className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all active:scale-95">
          Start Game
        </button>
      </div>
    </div>
  )
}
