'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  useEffect(() => { if (status === 'authenticated') router.replace('/') }, [status, router])
  return <main className="login-screen">
    <div className="login-card">
      <div className="login-icon">🌸</div>
      <h1>Irasshaimase!</h1>
      <p>Japanisch lernen mit Japanese Cards</p>
      <button type="button" disabled={status === 'loading'} onClick={() => void signIn('authentik', { callbackUrl: '/' })}>
        Sicher anmelden
      </button>
    </div>
  </main>
}
