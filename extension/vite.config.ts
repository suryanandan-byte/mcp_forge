import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

// Plugin to copy static files into dist
function copyExtensionFiles() {
  return {
    name: "copy-extension-files",
    writeBundle() {
      const distDir = resolve(__dirname, "dist");

      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, "manifest.json"),
        resolve(distDir, "manifest.json")
      );

      // Icons are already copied by Vite's public dir handling
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyExtensionFiles()],
  // Use relative paths for Chrome extension compatibility
  base: "",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Inline the shared chunk into the service worker to avoid import issues
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        "service-worker": resolve(
          __dirname,
          "src/background/service-worker.ts"
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "service-worker") {
            return "background.js";
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  // public directory for icons
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
