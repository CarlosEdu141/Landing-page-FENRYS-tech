import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Gzip para servidores sem Brotli
    compression({ algorithm: 'gzip', ext: '.gz' }),
    // Brotli — melhor compressão (Netlify, Vercel, Nginx suportam)
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'vendor-anim';
          }
          if (id.includes('node_modules/@emailjs')) {
            return 'vendor-email';
          }
        },
      },
    },
    // Avisa se algum chunk superar 400 KB
    chunkSizeWarningLimit: 400,
  },
});
