import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, "..", "build", "client");

console.log("📝 Setting up GitHub Pages for SPA with 404.html fallback...");

// Create 404.html that serves index.html for all unknown routes
const notFoundHtml = fs.readFileSync(path.join(buildDir, "index.html"), "utf-8");
fs.writeFileSync(path.join(buildDir, "404.html"), notFoundHtml);
console.log("✅ Created 404.html fallback");

// Create .nojekyll to prevent Jekyll processing
fs.writeFileSync(path.join(buildDir, ".nojekyll"), "");
console.log("✅ Created .nojekyll");

console.log("✨ GitHub Pages SPA setup complete!");
