import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import viteSolid from 'vite-plugin-solid';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    tanstackStart({ spa: { enabled: true } }),
    viteSolid({ ssr: true }),
    unocss(),
  ],
});
