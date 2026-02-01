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
    <div className="fixed inset-0 bg-white flex flex-col font-roboto">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700/30 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{modeNames[modeId]}</h1>
          <p className="text-xs text-slate-400 font-normal">Score: 0 / 15</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-all text-white">
          <Pause size={20} />
        </button>
      </div>

      {/* Game Content Area */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">{modeEmojis[modeId]}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Wird geladen...</h2>
          <p className="text-base text-slate-600 font-normal">
            {modeNames[modeId]} wird vorbereitet
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-white border-t border-slate-200/50 flex items-center gap-3 px-4">
        <button className="flex-1 py-3 bg-slate-100 text-slate-900 font-medium rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-base">
          Info
        </button>
        <button className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-2xl hover:shadow-lg transition-all active:scale-95 text-base">
          Start
        </button>
      </div>
    </div>
  )
}
