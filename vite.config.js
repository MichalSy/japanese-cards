import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Generate static HTML files for all routes with correct titles
function generateStaticHtml() {
  return {
    name: 'generate-static-html',
    apply: 'build',
    enforce: 'post',
    writeBundle() {
      const distDir = path.join(__dirname, 'dist')
      const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

      // Define all routes with their titles
      const routes = [
        { path: 'content/hiragana', title: 'ひらがな' },
        { path: 'content/hiragana/a', title: 'ひらがな - A-Reihe' },
        { path: 'content/hiragana/ka', title: 'ひらがな - Ka-Reihe' },
        { path: 'content/hiragana/sa', title: 'ひらがな - Sa-Reihe' },
        { path: 'content/hiragana/ta', title: 'ひらがな - Ta-Reihe' },
        { path: 'content/hiragana/na', title: 'ひらがな - Na-Reihe' },
        { path: 'content/hiragana/ha', title: 'ひらがな - Ha-Reihe' },
        { path: 'content/hiragana/ma', title: 'ひらがな - Ma-Reihe' },
        { path: 'content/hiragana/ya', title: 'ひらがな - Ya-Reihe' },
        { path: 'content/hiragana/ra', title: 'ひらがな - Ra-Reihe' },
        { path: 'content/hiragana/wa', title: 'ひらがな - Wa-Reihe' },
        { path: 'content/hiragana/ga', title: 'ひらがな - Ga-Reihe' },
        { path: 'content/hiragana/za', title: 'ひらがな - Za-Reihe' },
        { path: 'content/hiragana/da', title: 'ひらがな - Da-Reihe' },
        { path: 'content/hiragana/ba', title: 'ひらがな - Ba-Reihe' },
        { path: 'content/hiragana/pa', title: 'ひらがな - Pa-Reihe' },
        { path: 'content/hiragana/all', title: 'ひらがな - Alle kombiniert' },
        { path: 'content/katakana', title: 'カタカナ' },
        { path: 'content/words', title: 'Vokabeln' },
        { path: 'content/sentences', title: 'Sätze' },
      ]

      // Generate HTML files with custom titles
      routes.forEach(({ path: routePath, title }) => {
        const fullPath = path.join(distDir, routePath, 'index.html')
        const dir = path.dirname(fullPath)
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        // Replace title in HTML
        const customHtml = indexHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${title} - Japanese Cards</title>`
        )
        
        fs.writeFileSync(fullPath, customHtml)
      })

      console.log(`✅ Generated ${routes.length} static HTML files with correct titles`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/japanese-cards/',
  plugins: [react(), generateStaticHtml()],
})
