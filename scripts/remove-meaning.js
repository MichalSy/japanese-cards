#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameDataDir = path.join(__dirname, '../public/GameData');

let count = 0;

// Recursively find all JSON files and remove "meaning" field
function removeFromJSON(filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // If it has items array, remove meaning from each item
    if (Array.isArray(content.items)) {
      content.items = content.items.map(item => {
        const { meaning, ...rest } = item;
        return rest;
      });
      count++;
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
      console.log(`✅ ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ ${filePath}:`, err.message);
  }
}

// Walk through all data directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.json')) {
      const relativePath = path.relative(gameDataDir, filePath);
      if (relativePath.includes('/data/')) {
        removeFromJSON(filePath);
      }
    }
  });
}

walkDir(gameDataDir);
console.log(`\n✅ Done! Updated ${count} files.`);
