'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchCategories } from '@/config/api'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, Card } from '@/components/Layout'

export default function CollectionView({ params }) {
  const router = useRouter()
  const { collectionId } = params
  const [collection, setCollection] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        const activeCategories = data.categories.filter(category => category.enabled !== false)
        const selectedCollection = (data.collections ?? []).find(item => item.id === collectionId && item.enabled !== false)
        if (!selectedCollection) throw new Error('Collection nicht gefunden')

        setCollection(selectedCollection)
        setCategories(selectedCollection.categories
          .map(categoryId => activeCategories.find(category => category.id === categoryId))
          .filter(Boolean))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [collectionId])

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={collection?.name} backHref="/" /></AppHeader>
      <AppContent>
        <div className="space-y-6 fade-in">
          {collection?.description && (
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{collection.description}</p>
          )}
          {loading && <div className="card" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Laden...</div>}
          {error && <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Fehler: {error}</div>}
          {!loading && !error && (
            <div className="grid-1">
              {categories.map(category => (
                <Card key={category.id} interactive onClick={() => router.push(`/content/${category.id}?collection=${collectionId}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '16px', fontSize: '28px' }}>
                      {category.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{category.name || category.native_name}</div>
                      {category.description && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{category.description}</div>}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>›</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AppContent>
    </AppLayout>
  )
}
