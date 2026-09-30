import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
})
