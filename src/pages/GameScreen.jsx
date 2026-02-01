import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function GameScreen() {
  const { contentType, groupId, modeId } = useParams()
  const navigate = useNavigate()

  const modeNames = {
    swipe: 'Swipe Game',
    multiChoice: 'Multiple Choice',
    flashcard: 'Flashcard',
    typing: 'Typing Challenge',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{modeNames[modeId]}</h1>
            <p className="text-gray-600 text-sm">{contentType} / {groupId}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🚀</p>
            <h2 className="text-2xl font-bold mb-2">Spiel wird geladen...</h2>
            <p className="text-gray-600">Hier kommt das {modeNames[modeId]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
