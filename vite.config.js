import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/japanese-cards/",
  plugins: [react()],
  build: {
    outDir: "build/client",
  },
});
