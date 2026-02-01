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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>{data.name}</h1>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0 0' }}>{completedCount}/{totalCount} abgeschlossen</p>
        </div>
      </AppHeader>

      <AppContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Gesamtfortschritt</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ec4899' }}>{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                <div
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #a855f7)',
                    height: '8px',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease',
                    width: `${(completedCount / totalCount) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {data.groups.map((group) => (
              <Card
                key={group.id}
                interactive
                onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: '500', color: '#1f2937', fontSize: '16px', margin: 0 }}>{group.name}</h3>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{group.count} Zeichen</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#ec4899' }}>{group.progress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                    <div
                      style={{
                        background: 'linear-gradient(to right, #ec4899, #a855f7)',
                        height: '8px',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                        width: `${group.progress}%`
                      }}
                    ></div>
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
