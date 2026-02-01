import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ContentTypeView() {
  const { contentType } = useParams()
  const navigate = useNavigate()

  // Statische Daten
  const contentData = {
    hiragana: {
      name: 'Hiragana',
      emoji: '🗾',
      groups: [
        { id: 'a', name: 'A-Reihe', accuracy: 93, completed: true },
        { id: 'ka', name: 'Ka-Reihe', accuracy: 87, completed: true },
        { id: 'sa', name: 'Sa-Reihe', accuracy: 0, completed: false },
        { id: 'ta', name: 'Ta-Reihe', accuracy: 0, completed: false },
        { id: 'na', name: 'Na-Reihe', accuracy: 0, completed: false },
      ],
    },
    katakana: {
      name: 'Katakana',
      emoji: 'カ',
      groups: [
        { id: 'a', name: 'A-Reihe', accuracy: 0, completed: false },
        { id: 'ka', name: 'Ka-Reihe', accuracy: 0, completed: false },
      ],
    },
    words: {
      name: 'Wörter',
      emoji: '📚',
      groups: [
        { id: 'animals', name: 'Tiere', accuracy: 0, completed: false },
        { id: 'food', name: 'Essen', accuracy: 0, completed: false },
      ],
    },
    sentences: {
      name: 'Sätze',
      emoji: '💬',
      groups: [
        { id: 'greetings', name: 'Grüße', accuracy: 0, completed: false },
      ],
    },
  }

  const data = contentData[contentType] || contentData.hiragana
  const getAccuracyColor = (accuracy) => {
    if (accuracy === 0) return 'bg-gray-100 text-gray-600'
    if (accuracy < 50) return 'bg-red-100 text-red-600'
    if (accuracy < 80) return 'bg-yellow-100 text-yellow-600'
    return 'bg-green-100 text-green-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 bg-white rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="text-gray-600">Wähle eine Gruppe</p>
          </div>
          <span className="text-3xl ml-auto">{data.emoji}</span>
        </div>

        {/* Groups */}
        <div className="space-y-3 mb-8">
          {data.groups.map((group) => (
            <button
              key={group.id}
              onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              className="w-full py-4 px-4 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.completed ? '✅ Abgeschlossen' : '⚪ Nicht gestartet'}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getAccuracyColor(group.accuracy)}`}>
                  {group.accuracy}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
