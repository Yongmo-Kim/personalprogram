import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const proxy = {
  '/google-news': {
    target: 'https://news.google.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/google-news/, ''),
  },
  '/yahoo-finance': {
    target: 'https://query1.finance.yahoo.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/yahoo-finance/, ''),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
});
