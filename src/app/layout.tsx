import type { Metadata } from 'next'
import './globals.css'
import '@michalsy/aiko-webapp-core/core.css'
import { AuthProvider } from '@michalsy/aiko-webapp-core'
import { AbilitiesProvider } from '@/contexts/AbilitiesContext'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: "Japanese Cards - Learn Japanese Characters",
  description: 'Learn Japanese characters playfully',
}

// Pages that should show sidebar (all authenticated pages)
const SIDEBAR_PATHS = ['/', '/content', '/game']

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <AbilitiesProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AbilitiesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
