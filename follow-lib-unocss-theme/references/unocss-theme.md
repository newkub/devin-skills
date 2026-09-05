# UnoCSS Theme Reference

## Overview

UnoCSS is the instant atomic CSS engine, designed to be flexible and extensible. The core is un-opinionated and all CSS utilities are provided via presets. UnoCSS supports a theming system familiar to Tailwind CSS / Windi CSS users. The `theme` property in the config is deep-merged to the default theme, enabling custom colors, breakpoints, and a Design System with HSL CSS variables.

## Install

```bash
bun add -D unocss
```

The `unocss` package ships the core, CLI, Vite plugin, and official presets together.

Create a `uno.config.ts` file at the project root:

```ts
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
})
```

Add the virtual import to your entry point (Vite):

```ts
import 'virtual:uno.css'
```

## Version Info

- Latest release: `66.10.0`; npm latest: `66.8.1`
- License: MIT
- Source: https://unocss.dev

## Peer Dependencies

No peer dependencies. The `unocss` package bundles these sub-packages:

- `@unocss/core` - core engine without presets
- `@unocss/cli` - command line interface
- `@unocss/vite` - Vite plugin
- `@unocss/preset-wind3` / `@unocss/preset-wind4` - Tailwind compatible presets
- `@unocss/preset-mini` - minimal preset
- `@unocss/preset-attributify` - attributify mode
- `@unocss/preset-icons` - icon preset
- `@unocss/preset-typography` - typography preset
- `@unocss/preset-web-fonts` - web fonts preset
- `@unocss/preset-tagify` - tagify mode
- `@unocss/transformer-variant-group` - variant group transformer
- `@unocss/transformer-directives` - directives transformer
- `@unocss/transformer-compile-class` - compile class transformer
- `@unocss/transformer-attributify-jsx` - attributify JSX transformer

## Configuration

UnoCSS auto-discovers `uno.config.{js,ts,mjs,mts}` or `unocss.config.{js,ts,mjs,mts}` at the project root.

### Theme colors with HSL variables

Use `hsl(var(--color-{name}))` format so colors resolve from CSS variables defined in `theme.css`:

```ts
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  theme: {
    colors: {
      primary: 'hsl(var(--color-primary))',
      'primary-hover': 'hsl(var(--color-primary-hover))',
      'primary-active': 'hsl(var(--color-primary-active))',
      'primary-foreground': 'hsl(var(--color-primary-foreground))',
      secondary: 'hsl(var(--color-secondary))',
      success: 'hsl(var(--color-success))',
      warning: 'hsl(var(--color-warning))',
      destructive: 'hsl(var(--color-destructive))',
      background: 'hsl(var(--color-background))',
      foreground: 'hsl(var(--color-foreground))',
      surface: 'hsl(var(--color-surface))',
      muted: 'hsl(var(--color-muted))',
      accent: 'hsl(var(--color-accent))',
      border: 'hsl(var(--color-border))',
      focus: 'hsl(var(--color-focus))',
      overlay: 'hsl(var(--color-overlay))',
      skeleton: 'hsl(var(--color-skeleton))',
    },
  },
})
```

### Nested color object

Colors can be objects for shade-like states. `DEFAULT` enables the bare class (e.g. `bg-brand`):

```ts
theme: {
  colors: {
    brand: {
      primary: 'hsl(var(--hue, 217) 78% 51%)', // class="bg-brand-primary"
      DEFAULT: '#942192', // class="bg-brand"
    },
  },
}
```

### extendTheme

`extendTheme` edits the deeply merged theme to get the complete object. Mutate or return a new object:

```ts
extendTheme: (theme) => {
  theme.colors.veryCool = '#0000ff' // class="text-very-cool"
  theme.colors.brand = {
    primary: 'hsl(var(--hue, 217) 78% 51%)', // class="bg-brand-primary"
  }
}
```

### Breakpoints

Custom `breakpoints` override the default instead of merging. Use `extendTheme` to inherit defaults:

```ts
theme: {
  breakpoints: {
    sm: '320px',
    md: '640px',
  },
}
```

### Theme CSS file (HSL variables)

Define CSS variables in `:root` and `.dark` using the format `--color-{name}: hue saturation% lightness%`:

```css
:root {
  --color-primary: 221 83% 53%;
  --color-primary-hover: 221 83% 45%;
  --color-primary-active: 221 83% 37%;
  --color-primary-foreground: 0 0% 100%;
  --color-background: 0 0% 100%;
  --color-foreground: 220 13% 18%;
}
.dark {
  --color-primary: 221 83% 63%;
  --color-primary-hover: 221 83% 55%;
  --color-primary-active: 221 83% 47%;
  --color-primary-foreground: 0 0% 100%;
  --color-background: 220 13% 7%;
  --color-foreground: 220 13% 97%;
}
```

Import `theme.css` by framework:
- Nuxt: `app.vue` imports `./assets/theme.css`
- Next.js: `app/layout.tsx` imports `./theme.css`
- Vite: `main.ts` imports `./theme.css`

### Full featured config

```ts
import {
  defineConfig, presetAttributify, presetIcons, presetTypography,
  presetWebFonts, presetWind4, transformerDirectives, transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [/* ... */],
  theme: { colors: { /* ... */ } },
  presets: [
    presetWind4(), presetAttributify(), presetIcons(),
    presetTypography(), presetWebFonts({ fonts: { /* ... */ } }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
```

## CLI Commands

The CLI ships with the `unocss` package. Install `@unocss/cli` standalone if the binary is missing.

```bash
# Build CSS from glob patterns
unocss "site/{snippets,templates}/**/*.php"

# Watch mode
unocss "site/{snippets,templates}/**/*.php" --watch

# Output to a specific file
unocss "src/**/*.vue" -o dist/uno.css

# Write to stdout
unocss "src/**/*.vue" --stdout

# Use a custom config file
unocss "src/**/*.vue" -c uno.config.ts

# Rewrite source files with transformed utilities
unocss "src/**/*.vue" --rewrite

# Specify default preset when no config file
unocss "src/**/*.vue" --preset wind3|wind4

# Show version
unocss -v
```

package.json scripts:

```json
{
  "scripts": {
    "dev": "unocss \"site/{snippets,templates}/**/*.php\" --watch",
    "build": "unocss \"site/{snippets,templates}/**/*.php\""
  }
}
```

CLI entry config in `uno.config.ts`:

```ts
import { defineConfig } from 'unocss'

export default defineConfig({
  cli: {
    entry: { patterns: ['src/**/*.vue'], outFile: 'dist/uno.css' },
  },
})
```

## Source

- https://unocss.dev/guide/
- https://unocss.dev/guide/config-file
- https://unocss.dev/config/theme
- https://unocss.dev/integrations/vite
- https://unocss.dev/integrations/cli
- https://unocss.dev/presets/mini
- https://www.npmjs.com/package/unocss
