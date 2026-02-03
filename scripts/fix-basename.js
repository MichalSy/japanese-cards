import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, "..", "build", "client");

function walk(dir, callback) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log("🛠️ Fixing basename in generated HTML files for hash-based routing...");

walk(buildDir, (filePath) => {
  if (filePath.endsWith(".html")) {
    let content = fs.readFileSync(filePath, "utf-8");
    
    // Even with hash routing, we need basename in the context for React Router
    let newContent = content.replace(
      /"basename":"\/"/g,
      '"basename":"/japanese-cards/"'
    );
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed: ${path.relative(buildDir, filePath)}`);
    }
  }
});

console.log("✨ All HTML files fixed!");
