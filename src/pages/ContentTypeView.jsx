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
  }

  const data = contentData[contentType] || contentData.hiragana
  const completedCount = data.groups.filter(g => g.progress > 0).length
  const totalCount = data.groups.length

  return (
    <AppLayout>
      <AppHeader onBack={() => navigate('/')} progress={`${completedCount}/${totalCount}`}>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{data.name}</h1>
      </AppHeader>

      <AppContent>
        <div className="space-y-6">
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm font-medium text-primary">Gesamtfortschritt</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
                <div style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, height: '8px', borderRadius: '9999px', transition: 'width 0.3s ease', width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
            </div>
          </Card>

          <div className="grid-1">
            {data.groups.map((group) => (
              <Card key={group.id} interactive onClick={() => navigate(`/content/${contentType}/${group.id}`)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 className="text-base font-medium" style={{ color: 'var(--color-text-primary)', margin: 0 }}>{group.name}</h3>
                      <p className="text-sm text-tertiary" style={{ margin: 'var(--spacing-1) 0 0 0' }}>{group.count} Zeichen</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>{group.progress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'var(--color-surface-light)', borderRadius: '9999px', height: '8px' }}>
                    <div style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`, height: '8px', borderRadius: '9999px', transition: 'width 0.3s ease', width: `${group.progress}%` }}></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <Button onClick={() => navigate(`/content/${contentType}/${data.groups[0].id}`)}>
          Spielen →
        </Button>
      </AppFooter>
    </AppLayout>
  )
}
