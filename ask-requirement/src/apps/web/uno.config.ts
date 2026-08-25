import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss"

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: "hsl(210 100% 50%)",
      surface: "hsl(220 20% 10%)",
      border: "hsl(220 20% 20%)",
    },
  },
  shortcuts: {
    "card": "bg-surface rounded-xl border border-border p-6",
    "btn-primary": "bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity",
    "btn-ghost": "px-4 py-2 rounded-lg hover:bg-white/5 transition-colors",
    "input-base": "w-full px-3 py-2 bg-black/30 border border-border rounded-lg outline-none focus:border-primary transition-colors",
  },
})
