import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ContentTypeView() {
  const { contentType } = useParams()
  const navigate = useNavigate()

  const contentData = {
    hiragana: {
      name: 'Hiragana',
      groups: [
        { id: 'a', name: 'A-Reihe', count: 5, progress: 93 },
        { id: 'ka', name: 'Ka-Reihe', count: 5, progress: 87 },
        { id: 'sa', name: 'Sa-Reihe', count: 5, progress: 0 },
        { id: 'ta', name: 'Ta-Reihe', count: 5, progress: 0 },
        { id: 'na', name: 'Na-Reihe', count: 5, progress: 0 },
      ],
    },
    katakana: {
      name: 'Katakana',
      groups: [
        { id: 'a', name: 'A-Reihe', count: 5, progress: 0 },
        { id: 'ka', name: 'Ka-Reihe', count: 5, progress: 0 },
      ],
    },
    words: {
      name: 'Wörter',
      groups: [
        { id: 'animals', name: 'Tiere', count: 8, progress: 0 },
        { id: 'food', name: 'Essen', count: 12, progress: 0 },
      ],
    },
    sentences: {
      name: 'Sätze',
      groups: [
        { id: 'greetings', name: 'Grüße', count: 6, progress: 0 },
      ],
    },
  }

  const data = contentData[contentType] || contentData.hiragana
  const completedCount = data.groups.filter(g => g.progress > 0).length
  const totalCount = data.groups.length

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700 gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">{data.name}</h1>
          <p className="text-xs text-slate-400">{completedCount}/{totalCount} abgeschlossen</p>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {/* Progress Overview */}
          <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-900">Gesamtfortschritt</span>
              <span className="text-sm font-bold text-pink-600">{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Groups */}
          {data.groups.map((group) => (
            <button
              key={group.id}
              onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              className="w-full group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md p-4 transition-all active:scale-95 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all"></div>
              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{group.name}</h3>
                    <p className="text-xs text-slate-500">{group.count} Zeichen</p>
                  </div>
                  <span className="text-sm font-bold text-pink-600">{group.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${group.progress}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom padding for tab navigation */}
        <div className="h-8"></div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="h-16 bg-white border-t-2 border-slate-200 flex items-center justify-center px-6">
        <button
          onClick={() => navigate(`/content/${contentType}/${data.groups[0].id}`)}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          Zum Spielen
        </button>
      </div>
    </div>
  )
}
