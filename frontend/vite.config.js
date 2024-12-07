import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      'path': 'path-browserify',
      'util': 'util',
      'buffer': 'buffer',
    },
  },
  define: {
    'process.env': {},
    'global': 'window',
  },
  plugins: [
    react(),
    nodePolyfills(),
  ],
});
