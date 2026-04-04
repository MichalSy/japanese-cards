'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchCategories } from '@/config/api'

export default function HomePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
      .then((data: any) => {
        setCategories(data.categories.filter((cat: any) => cat.enabled !== false))
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Laden...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Fehler: {error}</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        🎌 Japanische Karten
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map((type) => (
          <button
            key={type.id}
            onClick={() => router.push(`/content/${type.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--color-surface, #1a1a2e)',
              border: '1px solid var(--color-border, #333)',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{type.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500' }}>{type.name}</div>
              {type.description && (
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{type.description}</div>
              )}
            </div>
            <span style={{ opacity: 0.5 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
