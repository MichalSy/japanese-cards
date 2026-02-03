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

// NOTE: With hash-based routing (/# URLs), basename fixes are no longer needed
// The entry.client.jsx converts traditional paths to hash routes automatically
// This script is kept for reference but doesn't apply any transformations
console.log("✨ Hash-based routing enabled - no basename fixes needed!");
