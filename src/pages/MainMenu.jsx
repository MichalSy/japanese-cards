import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'

export default function MainMenu() {
  const navigate = useNavigate()

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', emoji: '🗾' },
    { id: 'katakana', name: 'Katakana', emoji: 'カ' },
    { id: 'words', name: 'Wörter', emoji: '📚' },
    { id: 'sentences', name: 'Sätze', emoji: '💬' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🗾 Japanese Cards</h1>
          <p className="text-gray-600">Lerne Japanisch spielerisch</p>
        </div>

        {/* Content Buttons */}
        <div className="space-y-3 mb-8">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => navigate(`/content/${type.id}`)}
              className="w-full py-4 px-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-semibold transition transform hover:scale-105"
            >
              <span className="text-2xl mr-3">{type.emoji}</span>
              {type.name}
            </button>
          ))}
        </div>

        {/* Settings Button */}
        <button className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition flex items-center justify-center gap-2">
          <Settings size={20} />
          Einstellungen
        </button>
      </div>
    </div>
  )
}
