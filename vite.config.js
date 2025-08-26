import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
  ],
  build: {
    sourcemap: mode !== 'production' ? 'inline' : false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
}));
