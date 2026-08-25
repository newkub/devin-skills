# UnoCSS v66 with presetWind4

## Source

- Official Docs: https://unocss.dev
- Wind4 Preset: https://unocss.dev/presets/wind4
- Vite Integration: https://unocss.dev/integrations/vite
- CLI: https://unocss.dev/integrations/cli

## Version

- `unocss`: `66.8.1` (latest stable)
- `@unocss/preset-wind4`: `66.8.1` (included in `unocss` package)

## Installation

```bash
# All package managers
bun add -D unocss
# or: pnpm add -D unocss / npm install -D unocss / yarn add -D unocss

# Standalone preset (if needed separately)
bun add -D @unocss/preset-wind4
```

### Framework-Specific Packages

| Framework | Package | Install |
|-----------|---------|---------|
| Next.js | `@unocss/postcss` | `bun add -D @unocss/postcss` |
| Nuxt | `@unocss/nuxt` | `bun add -D @unocss/nuxt` |
| Astro | `@unocss/astro` | `bun add -D @unocss/astro` |
| Icons | `@iconify-json/mdi` | `bun add -D @iconify-json/mdi` |

## Configuration

### Basic `uno.config.ts`

```ts
import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
```

### presetWind4 Options

```ts
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,   // Built-in CSS reset (no need for @unocss/reset)
        theme: 'on-demand', // Generate CSS variables on-demand (default)
      },
    }),
  ],
})
```

### Theme Key Migration (presetWind3 → presetWind4)

| presetWind3 | presetWind4 |
|-------------|-------------|
| `fontFamily` | `font` |
| `fontSize` | `fontSize` property in `text` |
| `lineHeight` | `lineHeight` property in `text` or `leading` |
| `letterSpacing` | `letterSpacing` property in `text` or `tracking` |
| `borderRadius` | `radius` |
| `easing` | `ease` |
| `breakpoints` | `breakpoint` |
| `verticalBreakpoints` | `verticalBreakpoint` |
| `boxShadow` | `shadow` |
| `transitionProperty` | `property` |
| Size props (`width`, `height`, etc.) | `spacing` |

### Rem to Px Processor

```ts
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        theme: { process: createRemToPxProcessor() },
      },
    }),
  ],
})
```

## Framework Integration

### Vite

```ts
// vite.config.ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UnoCSS()],
})
```

```ts
// main.ts — add virtual import
import 'virtual:uno.css'
```

### Next.js

```ts
// postcss.config.mjs
export default {
  plugins: {
    '@unocss/postcss': {},
  },
}
```

Add `@unocss all;` to `app/globals.css`. Add content path in `uno.config.ts`:

```ts
content: { filesystem: ['./app/**/*.{html,js,ts,jsx,tsx}'] }
```

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@unocss/nuxt'],
})
```

### Astro

```ts
// astro.config.mjs
import UnoCSS from 'unocss/astro'

export default {
  integrations: [UnoCSS()],
}
```

## Transformers

### `transformerVariantGroup`

Group utilities with parentheses:

```html
<div class="hover:(bg-gray-400 font-medium)"></div>
```

### `transformerDirectives`

Use `@apply`, `@screen`, `theme()` in CSS:

```css
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded;
}
```

### `transformerAttributifyJsx`

Attributify mode for JSX using oxc parser.

## CLI

Starting from `v66.6.0`, `@unocss/cli` no longer provides a default preset. Specify `--preset` or configure in `uno.config.ts`:

```bash
unocss --preset wind4
```

| Option | Description |
|--------|-------------|
| `-c, --config [file]` | Config file |
| `-o, --out-file <file>` | Output filename (default: `uno.css`) |
| `-w, --watch` | Watch files |
| `--preflights` | Enable preflight styles |
| `-m, --minify` | Minify generated CSS |
| `--debug` | Enable debug mode |
| `--preset [wind3\|wind4]` | Default preset (ignored if config exists) |

## presetWind4 Features

- Theme variables generated as CSS custom properties on-demand
- Built-in CSS reset (no `@unocss/reset` import needed)
- Bracket syntax for theme values: `text-[--my-color]`
- `zoom-*` utility for zoom scaling
- `supports-*` variants for feature queries
- Enhanced border utilities with color and size options
- Dark mode works through CSS custom properties automatically
- `@property` CSS rules for browser optimization (enabled by default)
- Three new output layers: `base`, `theme`, `properties`
