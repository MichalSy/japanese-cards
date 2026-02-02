import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Generate static HTML files for all routes
function generateStaticHtml() {
  return {
    name: 'generate-static-html',
    apply: 'build',
    enforce: 'post',
    writeBundle() {
      const distDir = path.join(__dirname, 'dist')
      const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

      // Define all routes
      const routes = [
        'content/hiragana',
        'content/hiragana/a',
        'content/hiragana/ka',
        'content/hiragana/sa',
        'content/hiragana/ta',
        'content/hiragana/na',
        'content/hiragana/ha',
        'content/hiragana/ma',
        'content/hiragana/ya',
        'content/hiragana/ra',
        'content/hiragana/wa',
        'content/hiragana/ga',
        'content/hiragana/za',
        'content/hiragana/da',
        'content/hiragana/ba',
        'content/hiragana/pa',
        'content/hiragana/all',
        'content/katakana',
        'content/words',
        'content/sentences',
      ]

      // Generate HTML files
      routes.forEach((route) => {
        const routePath = path.join(distDir, route, 'index.html')
        const dir = path.dirname(routePath)
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        fs.writeFileSync(routePath, indexHtml)
      })

      console.log(`✅ Generated ${routes.length} static HTML files`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/japanese-cards/',
  plugins: [react(), generateStaticHtml()],
})
