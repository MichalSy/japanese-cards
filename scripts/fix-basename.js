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

console.log("🛠️ Fixing basename, manifestPath, and isSpaMode in generated HTML files...");

walk(buildDir, (filePath) => {
  if (filePath.endsWith(".html")) {
    let content = fs.readFileSync(filePath, "utf-8");
    let newContent = content;
    let fixed = false;
    
    // Fix the basename
    if (newContent.includes('"basename":"/"')) {
      newContent = newContent.replace(
        /"basename":"\/"/g,
        '"basename":"/japanese-cards/"'
      );
      fixed = true;
    }
    
    // Fix the manifestPath
    if (newContent.includes('"manifestPath":"/__manifest"')) {
      newContent = newContent.replace(
        /"manifestPath":"\/__manifest"/g,
        '"manifestPath":"/japanese-cards/__manifest"'
      );
      fixed = true;
    }
    
    // Enable SPA mode for proper client-side routing
    if (newContent.includes('"isSpaMode":false')) {
      newContent = newContent.replace(
        /"isSpaMode":false/g,
        '"isSpaMode":true'
      );
      fixed = true;
    }
    
    if (fixed) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed: ${path.relative(buildDir, filePath)}`);
    }
  }
});

console.log("✨ All HTML files fixed!");
