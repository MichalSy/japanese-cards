'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchCategories } from '@/config/api'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, Card } from '@/components/Layout'

export default function TrackView({ params }) {
  const router = useRouter()
  const { trackId } = params
  const [track, setTrack] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        const selectedTrack = (data.tracks ?? []).find(item => item.id === trackId && item.enabled !== false)
        if (!selectedTrack) throw new Error('Track nicht gefunden')

        setTrack(selectedTrack)
        setCategories(selectedTrack.categories
          .map(categoryId => data.categories.find(category => category.id === categoryId))
          .filter(Boolean))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [trackId])

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={track?.name} backHref="/" /></AppHeader>
      <AppContent>
        <div className="space-y-6 fade-in">
          {track?.description && (
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{track.description}</p>
          )}
          {loading && <div className="card" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Laden...</div>}
          {error && <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Fehler: {error}</div>}
          {!loading && !error && (
            <div className="grid-1">
              {categories.map(category => {
                const isEnabled = category.enabled !== false
                return (
                  <Card key={category.id} interactive={isEnabled} onClick={isEnabled ? () => router.push(`/content/${category.id}?track=${trackId}`) : undefined}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: isEnabled ? 1 : 0.48 }}>
                      <div style={{ width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '16px', fontSize: '28px' }}>
                        {category.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{category.name || category.native_name}</div>
                          {!isEnabled && <span style={{ padding: '3px 7px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kommt bald</span>}
                        </div>
                        {category.description && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{category.description}</div>}
                      </div>
                      {isEnabled && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>›</span>}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </AppContent>
    </AppLayout>
  )
}
