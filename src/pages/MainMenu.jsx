import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Target, Award } from 'lucide-react'
import { useState } from 'react'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', icon: BookOpen },
    { id: 'katakana', name: 'Katakana', icon: Target },
    { id: 'words', name: 'Wörter', icon: Zap },
    { id: 'sentences', name: 'Sätze', icon: Award },
  ]

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'stats', label: 'Stats', icon: '🏆' },
  ]

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-roboto">
      {/* Top Header - Material Design 3 */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700/30">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Japanese
          </h1>
          <p className="text-xs text-slate-400 font-normal">Learn Japanese</p>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {activeTab === 'start' && (
          <div className="space-y-4">
            <h2 className="text-base font-medium text-slate-900 px-2">Kategorien</h2>
            <div className="space-y-3">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => navigate(`/content/${type.id}`)}
                    className="w-full flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-colors active:bg-slate-100"
                  >
                    <div className="p-3 bg-slate-100 rounded-full flex-shrink-0">
                      <Icon size={24} className="text-slate-700" strokeWidth={2} />
                    </div>
                    <span className="flex-1 text-left font-medium text-slate-900 text-base">{type.name}</span>
                    <span className="text-slate-400 text-lg">→</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50 rounded-2xl">
              <p className="text-sm font-normal text-slate-700 leading-relaxed">
                💡 Starte mit einer Kategorie, um zu spielen!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            <h2 className="text-base font-medium text-slate-900 px-2">Fortschritt</h2>
            <div className="space-y-3">
              {contentTypes.map((type) => (
                <div key={type.id} className="p-4 bg-white border border-slate-200 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-900">{type.name}</span>
                    <span className="text-sm font-semibold text-pink-600">42%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-base font-medium text-slate-900 px-2">Statistiken</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200/50 rounded-2xl text-center">
                <p className="text-xs text-blue-700 font-medium mb-2">Tage aktiv</p>
                <p className="text-3xl font-bold text-blue-700">12</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200/50 rounded-2xl text-center">
                <p className="text-xs text-green-700 font-medium mb-2">Punkte</p>
                <p className="text-3xl font-bold text-green-700">1.2K</p>
              </div>
              <div className="p-4 bg-pink-50 border border-pink-200/50 rounded-2xl text-center">
                <p className="text-xs text-pink-700 font-medium mb-2">Genauigkeit</p>
                <p className="text-3xl font-bold text-pink-700">89%</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200/50 rounded-2xl text-center">
                <p className="text-xs text-purple-700 font-medium mb-2">Streak</p>
                <p className="text-3xl font-bold text-purple-700">7</p>
              </div>
            </div>
          </div>
        )}

        <div className="h-6"></div>
      </div>

      {/* Bottom Navigation - Material Design 3 Bottom App Bar */}
      <div className="h-20 bg-white border-t border-slate-200/50 flex items-center justify-around px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 py-2 px-6 rounded-2xl transition-all font-medium ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
