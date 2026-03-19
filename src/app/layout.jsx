import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Japanese Cards',
  description: 'Learn Japanese characters playfully',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
