import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [react(),wasm(),topLevelAwait()],
  server: {
    port: 5173,
    historyApiFallback: true,
    proxy: {
      '/generate': {
        target: 'https://simplicode-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  optimizeDeps: {
    exclude: ["sql.js/react"],
    esbuildOptions: {
      target: "es2020"
    }
  },
  build: {
    target: 'esnext'
  }
});
