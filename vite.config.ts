import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' keeps the build portable: it can be opened from any static host or sub-folder.
// Two pages: index.html (capabilities deck) and brand.html (visual brand guide).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
  preview: { port: 4180 },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        deck: resolve(import.meta.dirname, 'index.html'),
        brand: resolve(import.meta.dirname, 'brand.html'),
      },
    },
  },
});
