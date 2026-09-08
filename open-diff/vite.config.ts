import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [solid(), unocss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  base: '/',
});
