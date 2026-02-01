import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout, AppHeader, AppContent, AppFooter, Card, Button } from '../components/Layout'

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
    <AppLayout>
      <AppHeader onBack={() => navigate('/')}>
        <div>
          <h1 className="text-2xl font-bold text-white">{data.name}</h1>
          <p className="text-xs text-slate-300">{completedCount}/{totalCount} abgeschlossen</p>
        </div>
      </AppHeader>

      <AppContent>
        <div className="space-y-[var(--spacing-5)]">
          {/* Progress Card */}
          <Card>
            <div className="space-y-[var(--spacing-3)]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--md-on-surface)]">Gesamtfortschritt</span>
                <span className="text-sm font-semibold text-[var(--md-primary)]">{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[var(--md-primary)] to-[var(--md-secondary)] h-2 rounded-full transition-all"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Groups */}
          <div className="space-y-[var(--spacing-3)]">
            {data.groups.map((group) => (
              <Card
                key={group.id}
                interactive
                onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              >
                <div className="space-y-[var(--spacing-3)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[var(--md-on-surface)] text-base">{group.name}</h3>
                      <p className="text-xs text-[var(--md-on-surface-variant)]">{group.count} Zeichen</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--md-primary)]">{group.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--md-primary)] to-[var(--md-secondary)] h-2 rounded-full transition-all"
                      style={{ width: `${group.progress}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <Button
          variant="filled"
          onClick={() => navigate(`/content/${contentType}/${data.groups[0].id}`)}
          className="w-full"
        >
          Spielen →
        </Button>
      </AppFooter>
    </AppLayout>
  )
}
