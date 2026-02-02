import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // base: "/japanese-cards/",  // Removed for hash-based routing
  plugins: [reactRouter()],
});
