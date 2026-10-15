| key | value |
|---|---|
| package | `unocss` |
| install | `bun add -D unocss` |
| stable version | 66.10.5 (verified 2026-10-02) |
| license | MIT |
| docs | https://unocss.dev |
| repository | https://github.com/unocss/unocss |

| api | description | signature/example |
|---|---|---|
| `defineConfig` | create `uno.config.ts` | `defineConfig({ presets: [presetWind4()] })` |
| `presetWind4` | Tailwind 4-compatible preset (canonical) | `presetWind4({ dark: 'class', preflights: { reset: true } })` |
| `presetIcons` | icon collections via Iconify | `presetIcons({ collections: { mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default) } })` |
| `presetWebFonts` | web fonts | `presetWebFonts({ fonts: { sans: 'Inter' } })` |
| `presetTypography` | prose styling | `presetTypography()` |
| `presetAttributify` | attributify mode | `presetAttributify()` |
| `presetTagify` | tag mode (`<bg-red-500>`) | `presetTagify()` |
| `presetRemToPx` | rem → px conversion | `presetRemToPx()` or `createRemToPxProcessor()` in wind4 |
| `transformerVariantGroup` | `hover:(bg-gray-400 font-medium)` | `transformerVariantGroup()` |
| `transformerDirectives` | `@apply`, `@screen`, `theme()`, `icon()` | `transformerDirectives()` |
| `transformerAttributifyJsx` | valueless attributes in JSX | `transformerAttributifyJsx()` |
| `transformerCompileClass` | compiled short class names | `transformerCompileClass()` |
| `extendTheme` | merge/inherit preset defaults | `extendTheme: (t) => { t.breakpoint.xs = '480px'; return t }` |
| `unocss/vite` | Vite plugin | `import UnoCSS from 'unocss/vite'` |
| `unocss/postcss` | PostCSS plugin (Next.js) | `import unocss from 'unocss/postcss'` |
| `virtual:uno.css` | generated CSS virtual module | `import 'virtual:uno.css'` |
| `@unocss/nuxt` | Nuxt module | `modules: ['@unocss/nuxt']` in `nuxt.config.ts` |
| `@unocss/astro` | Astro integration | `UnoCSS({ injectReset: true })` in `astro.config.mjs` |
| `@unocss/cli` | standalone CLI | see `cli.md` |
| `@unocss/runtime` | CDN runtime | `import initUnocssRuntime from '@unocss/runtime'` |
| `@unocss/reset` | CSS resets | `@unocss/reset/tailwind.css` — use `preflights.reset` instead with wind4 |
| `@unocss/eslint-plugin` | ESLint plugin (66.10.5) | `unocss.configs.flat` — setup in /follow-unocss-theme lint |
| `@unocss/language-server` | LSP | editor integration |
| `@unocss/twoslash` | TypeScript twoslash | docs tooling |
