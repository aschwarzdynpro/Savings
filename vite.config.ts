import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// GitHub Pages serves the app from https://<user>.github.io/<repo>/
// Keep this in sync with the repository name.
const REPO_BASE = '/Savings/';

export default defineConfig({
  base: REPO_BASE,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
