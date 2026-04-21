'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import LearnMode from '@/modes/learn/LearnMode'

export default function LearnLessonPage() {
  const { lessonId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/learn/lessons/${lessonId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setData)
      .catch(err => setError(String(err)))
  }, [lessonId])

  if (error) return (
    <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', background: '#0c0820', color: '#ef4444', fontSize: '15px', padding: '24px', textAlign: 'center' }}>
      Fehler: {error}
    </div>
  )

  if (!data) return (
    <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', background: '#0c0820' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(236,72,153,0.3)', borderTopColor: '#ec4899', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return <LearnMode lesson={data.lesson} course={data.course} cards={data.cards} lang={data.lang} />
}
