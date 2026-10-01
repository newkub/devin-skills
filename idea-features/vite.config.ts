import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { nitro } from 'nitro/vite'
import UnoCSS from 'unocss/vite'
import viteSolid from 'vite-plugin-solid'

process.env.NITRO_PRESET ??= 'bun'

export default defineConfig({
  plugins: [tanstackStart(), nitro(), UnoCSS(), viteSolid({ ssr: true })],
})
