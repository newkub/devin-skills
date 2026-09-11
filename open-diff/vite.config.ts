import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import viteSolid from 'vite-plugin-solid';
import unocss from 'unocss/vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.OPEN_DIFF_PORT || 51998}`,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackStart({ spa: { enabled: true } }),
    viteSolid({ ssr: true }),
    unocss(),
  ],
});
