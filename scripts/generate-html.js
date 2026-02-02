import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Define all possible routes
const routes = [
  '/',
  '/content/hiragana',
  '/content/hiragana/a',
  '/content/hiragana/ka',
  '/content/hiragana/sa',
  '/content/hiragana/ta',
  '/content/hiragana/na',
  '/content/hiragana/ha',
  '/content/hiragana/ma',
  '/content/hiragana/ya',
  '/content/hiragana/ra',
  '/content/hiragana/wa',
  '/content/hiragana/ga',
  '/content/hiragana/za',
  '/content/hiragana/da',
  '/content/hiragana/ba',
  '/content/hiragana/pa',
  '/content/hiragana/all',
  '/content/katakana',
  '/content/words',
  '/content/sentences',
];

// Generate HTML files for each route
routes.forEach((route) => {
  if (route === '/') return; // index.html already exists
  
  const routePath = path.join(distDir, route, 'index.html');
  const dir = path.dirname(routePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write index.html to route directory
  fs.writeFileSync(routePath, indexHtml);
  console.log(`Generated: ${route}/index.html`);
});

console.log('✅ All route HTML files generated!');
