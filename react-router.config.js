export default {
  ssr: true,
  async prerender() {
    // GitHub Pages SPA: Only prerender index.html
    // 404.html (copy of index.html) handles all non-existent routes
    // React Router hydrates & routes client-side
    // Loaders run on client via useLoaderData hook integration
    return ["/"];
  },
};
