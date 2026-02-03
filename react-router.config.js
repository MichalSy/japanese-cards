export default {
  ssr: true,
  async prerender() {
    // GitHub Pages SPA: Only prerender index.html
    // GitHub Pages automatically serves 404.html for non-existent routes
    // React Router hydrates client-side and routes dynamically
    return ["/"];
  },
};
