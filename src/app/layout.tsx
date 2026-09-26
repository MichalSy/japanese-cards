import { LanguageProvider } from '@michalsy/aiko-webapp-core'
import AuthProvider from '@/components/AuthProvider'
import UserSettingsSync from '@/components/UserSettingsSync'
import { SettingsProvider } from '@/components/SettingsContext'
import { I18nProvider } from '@/components/I18nContext'
import { BackHandlerProvider } from '@/components/BackHandlerContext'
import '@michalsy/aiko-webapp-core/core.css'
import './globals.css'

export const metadata = {
  title: 'Japanese Cards',
  description: 'Learn Japanese characters playfully',
}

export const viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">
        <AuthProvider>
          <LanguageProvider>
            <SettingsProvider>
              <I18nProvider>
                <BackHandlerProvider>
                  <UserSettingsSync />
                  {children}
                </BackHandlerProvider>
              </I18nProvider>
            </SettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
