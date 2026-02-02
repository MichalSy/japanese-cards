import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Generate static HTML files for all routes dynamically based on GameData
function generateStaticHtml() {
  return {
    name: 'generate-static-html',
    apply: 'build',
    enforce: 'post',
    writeBundle() {
      const distDir = path.join(__dirname, 'dist')
      const publicDir = path.join(__dirname, 'public')
      const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

      const routes = []

      try {
        // Read categories and global game modes
        const categoriesData = JSON.parse(fs.readFileSync(path.join(publicDir, 'GameData', 'categories.json'), 'utf-8'))
        const gameModesData = JSON.parse(fs.readFileSync(path.join(publicDir, 'GameData', 'gamemodes.json'), 'utf-8'))
        const globalEnabledModes = gameModesData.gameModes.filter(m => m.enabled).map(m => m.id)

        categoriesData.categories.forEach(cat => {
          // Even if a category is disabled, we might want to generate routes if they were accessible
          // But usually we only want enabled ones. Let's include all that have a directory.
          const catDir = path.join(publicDir, 'GameData', cat.id)
          if (!fs.existsSync(catDir)) return

          // Content list page (e.g., /content/hiragana)
          routes.push({ path: `content/${cat.id}`, title: cat.name })

          // Read category specific config
          const catConfigPath = path.join(catDir, 'category.json')
          if (fs.existsSync(catConfigPath)) {
            const catConfig = JSON.parse(fs.readFileSync(catConfigPath, 'utf-8'))
            
            const processGroup = (groupId, groupName) => {
              // Mode selector page (e.g., /content/hiragana/a)
              routes.push({ path: `content/${cat.id}/${groupId}`, title: `${cat.name} - ${groupName}` })
              
              // Game pages for each mode (e.g., /game/hiragana/a/swipe)
              // We intersect global enabled modes with category supported modes
              const supportedModes = catConfig.gameModes || []
              globalEnabledModes.forEach(modeId => {
                if (supportedModes.includes(modeId)) {
                  const modeName = modeId.charAt(0).toUpperCase() + modeId.slice(1)
                  routes.push({ 
                    path: `game/${cat.id}/${groupId}/${modeId}`, 
                    title: `${cat.name} - ${groupName} (${modeName})` 
                  })
                }
              })
            }

            // Individual groups
            if (catConfig.groups) {
              catConfig.groups.forEach(group => {
                processGroup(group.id, group.name)
              })
            }

            // "All" option if enabled
            if (catConfig.showAllOption) {
              processGroup('all', 'Alle kombiniert')
            }
          }
        })
      } catch (err) {
        console.error('❌ Error generating dynamic routes:', err)
      }

      // Generate the actual HTML files
      routes.forEach(({ path: routePath, title }) => {
        const fullPath = path.join(distDir, routePath, 'index.html')
        const dir = path.dirname(fullPath)
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        // Replace title in HTML for SEO and correct tab naming
        const customHtml = indexHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${title} - Japanese Cards</title>`
        )
        
        fs.writeFileSync(fullPath, customHtml)
      })

      console.log(`✅ Dynamically generated ${routes.length} static HTML files for GitHub Pages`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/japanese-cards/',
  plugins: [react(), generateStaticHtml()],
})
