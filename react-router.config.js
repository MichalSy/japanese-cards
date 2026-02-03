import fs from "node:fs";
import path from "node:path";

export default {
  ssr: true, // Keep SSR for initial rendering
  async prerender() {
    // For GitHub Pages SPA with 404.html fallback, only prerender index
    // All client-side routes will be handled by React Router
    const routes = ["/"];
    console.log(`🚀 Prerendering ${routes.length} route (index only)...`);
    return routes;
  },
};
