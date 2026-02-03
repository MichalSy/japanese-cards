import fs from "node:fs";
import path from "node:path";

export default {
  ssr: true,
  async prerender() {
    // Only prerender index for GitHub Pages with Hash-based routing
    // All routes handled client-side by React Router via hash history
    return ["/"];
  },
};
