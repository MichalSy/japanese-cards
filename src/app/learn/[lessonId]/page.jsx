'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useT } from '@/components/I18nContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent } from '@/components/Layout'
import LearnMode from '@/modes/learn/LearnMode'

export default function LearnLessonPage() {
  const { lessonId } = useParams()
  const t = useT()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/learn/lessons/${lessonId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setData)
      .catch(err => setError(String(err)))
  }, [lessonId])

  if (error) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={t('error')} /></AppHeader>
      <AppContent><div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{t('error')}: {error}</div></AppContent>
    </AppLayout>
  )

  if (!data) return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={t('loading')} /></AppHeader>
      <AppContent><div className="card" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('loading')}</div></AppContent>
    </AppLayout>
  )

  return <LearnMode lesson={data.lesson} cards={data.cards} lang={data.lang} settings={data.settings} />
}
