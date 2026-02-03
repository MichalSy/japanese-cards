/**
 * GitHub Pages SPA Configuration
 * 
 * Pure client-side SPA with static route definitions.
 * No SSR, no lazy route discovery, no __manifest HTTP fetches.
 * 
 * Routes are hardcoded in entry.client.jsx via createBrowserRouter()
 * GitHub Pages 404.html fallback serves index.html for all non-existent routes
 * React Router handles all routing client-side
 */

export default {
  // Pure SPA: No server-side rendering
  // This generates a single index.html with embedded route definitions
  ssr: false,
  
  // Don't prerender specific routes
  // Only index.html is generated, 404.html is a copy
  // Everything is handled client-side
  prerender: false,
};
