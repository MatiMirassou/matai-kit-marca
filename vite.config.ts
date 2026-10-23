import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Hosted routes use root-relative assets. scripts/portable.mjs inlines assets
// separately and lib/media.ts resolves local file:// bundles without a server.
export default defineConfig(({isSsrBuild})=>({
  base: '/',
  publicDir: isSsrBuild?false:'public',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
  preview: { port: 4180 },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild?{}:{
      input: {
        deck: resolve(import.meta.dirname, 'index.html'),
        brand: resolve(import.meta.dirname, 'brand.html'),
      },
    },
  },
}));
