# Integration

## Purpose

แนะนำการ integrate Vite กับ frameworks และ tools ต่างๆ

## Scope

- React
- Vue
- Svelte
- Tailwind CSS
- TypeScript
- Testing Tools
- Other Tools

## React

### Install

```bash
bun install -D @vitejs/plugin-react
```

### Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Features

- Fast Refresh for React components
- JSX transformation
- TypeScript decorators support

## Vue

### Install

```bash
bun install -D @vitejs/plugin-vue
```

### Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### Features

- SFC (Single File Component) support
- HMR for Vue components
- TypeScript in SFC

## Svelte

### Install

```bash
bun install -D @sveltejs/vite-plugin-svelte svelte
```

### Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})
```

### svelte.config.js

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}
```

## Tailwind CSS

### Install

```bash
bun install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```typescript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```typescript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```typescript
// src/main.ts หรือ App.vue
import './style.css'
```

## TypeScript

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

## Testing Tools

### Vitest

```bash
bun install -D vitest @vitejs/plugin-react jsdom
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitest from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    vitest({
      environment: 'jsdom',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

### Playwright

```bash
bun install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'bun run dev',
    port: 5173,
  },
})
```

## Other Tools

### UnoCSS

```bash
bun install -D unocss
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})
```

### Sass/SCSS

```bash
bun install -D sass-embedded
```

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
})
```

### SVG as Components

```bash
bun install -D vite-plugin-svg
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import viteSvg from 'vite-plugin-svg'

export default defineConfig({
  plugins: [
    viteSvg(),
  ],
})
```

## Summary

| Framework/Tool | Package | Plugin |
|---------------|---------|--------|
| **React** | `@vitejs/plugin-react` | Built-in |
| **Vue** | `@vitejs/plugin-vue` | Built-in |
| **Svelte** | `@sveltejs/vite-plugin-svelte` | Built-in |
| **Tailwind** | `tailwindcss` | PostCSS |
| **Testing** | `vitest` | `vitest/config` |
| **UnoCSS** | `unocss` | `unocss/vite` |
| **SCSS** | `sass-embedded` | Built-in |
