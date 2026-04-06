'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@michalsy/aiko-webapp-core'

export default function StartPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else {
      router.replace('/')
    }
  }, [loading, user, router])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh',
      background: 'radial-gradient(circle at 15% 10%, rgba(236,72,153,0.4) 0%, transparent 50%), radial-gradient(circle at 85% 95%, rgba(236,72,153,0.3) 0%, transparent 50%), linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 25%, #0f172a 50%, #0d1e3f 100%)',
      fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      Einen Moment...
    </div>
  )
}
