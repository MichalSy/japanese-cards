import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, "..", "build", "client");

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log("🔀 Converting prerendered HTML files to hash-based redirects...");

walk(buildDir, (filePath) => {
  if (filePath.endsWith(".html") && filePath !== path.join(buildDir, "index.html")) {
    // Extract the pathname from the file path
    const relativePath = path.relative(buildDir, filePath);
    const routePath = "/" + relativePath
      .replace(/index\.html$/, "")
      .replace(/\\/g, "/")
      .replace(/\/$/, "");

    const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    // Redirect traditional path to hash-based route
    const routePath = "${routePath}";
    window.location.replace("/japanese-cards/#" + routePath);
  </script>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to hash-based routing...</p>
</body>
</html>`;

    fs.writeFileSync(filePath, redirectHtml);
    console.log(`✅ Converted: ${relativePath}`);
  }
});

console.log("✨ All prerendered pages converted to redirects!");
