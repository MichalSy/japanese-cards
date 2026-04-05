import { AbilitiesProvider } from '@/contexts/AbilitiesContext'
import { AuthProvider } from '@michalsy/aiko-webapp-core'
import { LanguageProvider } from '@/context/LanguageContext'
import '@michalsy/aiko-webapp-core/core.css'

export const metadata = {
  title: 'Japanese Cards',
  description: 'Learn Japanese characters playfully',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">
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
