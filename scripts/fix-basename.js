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
    
    // Fix the basename in the injected context
    newContent = newContent.replace(
      /"basename":"\/"/g,
      '"basename":"/japanese-cards/"'
    );
    
    // Fix the manifestPath for hash-based routing
    newContent = newContent.replace(
      /"manifestPath":"\/__manifest"/g,
      '"manifestPath":"/japanese-cards/__manifest"'
    );
    
    // Disable SPA mode for prerendered content
    // (isSpaMode:false means SSR prerendered content is used, not SPA mode)
    // Keep it false since we have prerendered pages
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed: ${path.relative(buildDir, filePath)}`);
    }
  }
});

console.log("✨ All HTML files fixed!");
