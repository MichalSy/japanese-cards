import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Target, Award } from 'lucide-react'
import { useState } from 'react'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', icon: BookOpen, desc: '日本語の基本文字' },
    { id: 'katakana', name: 'Katakana', icon: Target, desc: '外来語の文字' },
    { id: 'words', name: 'Wörter', icon: Zap, desc: 'Vokabeltraining' },
    { id: 'sentences', name: 'Sätze', icon: Award, desc: 'Satzstrukturen' },
  ]

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'stats', label: 'Stats', icon: '🏆' },
  ]

  return (
    <AppLayout>
      <AppHeader>
        <div>
          <h1 className="text-2xl font-bold text-white">Japanese Cards</h1>
          <p className="text-xs text-slate-300">Learn Japanese</p>
        </div>
      </AppHeader>

      <AppContent>
        {activeTab === 'start' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-slate-900">Kategorien</h2>
            <div className="grid grid-cols-1 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card
                    key={type.id}
                    interactive
                    onClick={() => navigate(`/content/${type.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-full flex-shrink-0">
                        <Icon size={24} className="text-slate-700" strokeWidth={2} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-slate-900 text-base">{type.name}</h3>
                        <p className="text-xs text-slate-500">{type.desc}</p>
                      </div>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-slate-900">Dein Fortschritt</h2>
            <div className="grid grid-cols-1 gap-3">
              {contentTypes.map((type) => (
                <Card key={type.id}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900">{type.name}</span>
                      <span className="text-sm font-semibold text-pink-600">42%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-base font-medium text-slate-900">Statistiken</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-2">Tage aktiv</p>
                  <p className="text-3xl font-bold text-pink-600">12</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-2">Punkte</p>
                  <p className="text-3xl font-bold text-purple-600">1.2K</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-2">Genauigkeit</p>
                  <p className="text-3xl font-bold text-blue-600">89%</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium mb-2">Streak</p>
                  <p className="text-3xl font-bold text-green-600">7</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div className="w-full flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-2 px-3 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'text-slate-500'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </AppFooter>
    </AppLayout>
  )
}
