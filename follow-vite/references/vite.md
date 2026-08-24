# Vite 7+ Reference

## Install

```bash
# Scaffold new project
bun create vite@latest my-app --template solid-ts

# Manual install
bun add -D vite
```

## Version Info

- Latest stable: `7.3.x` (Vite 7 series, as of 2026)
- Node.js >= 20.19+ or >= 22.12+
- Vite 7 is ESM-only
- Build tool: Rolldown (default bundler in Vite 8+; Vite 7 via `experimental.rolldown`)
- Templates: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-compiler-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`

## CLI Commands

```bash
bunx vite              # Start dev server (aliases: vite dev, vite serve)
bunx vite build        # Build for production
bunx vite preview      # Preview production build
bunx vite build --watch # Rebuild on file changes
bunx vite --profile     # CPU profiling
```

Default `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Configuration

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // config options
})
```

### Conditional Config

```ts
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    return {
      // build-specific config
    }
  }
  return {
    // dev config
  }
})
```

### Server Options

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    warmup: {
      clientFiles: ['./src/main.ts', './src/components/*.tsx'],
    },
    fs: {
      allow: ['../shared'],
    },
  },
})
```

### Build Options

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'baseline-widely-available', // Vite 7 default
    minify: 'esbuild', // 'terser' for smaller output
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Chunking strategy
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // Production only
  },
})
```

### Resolve Options

```ts
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
    tsconfigPaths: true, // Auto-resolve tsconfig paths
  },
})
```

### Environment Variables

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['VITE_', 'APP_'],
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

Access in code:

```ts
const apiKey = import.meta.env.VITE_API_KEY
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const isSSR = import.meta.env.SSR
```

`.env` files: `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`

## Rolldown (Experimental in Vite 7)

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    rolldown: true,
  },
})
```

## SSR

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: ['some-esm-pkg'],
    external: ['express'],
  },
})
```

File structure: `entry-client.js`, `entry-server.js`, `server.js`

Use `import.meta.env.SSR` for conditional logic.

## Multi-Page App

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
      },
    },
  },
})
```

## Library Mode

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.ts'),
      name: 'MyLib',
      fileName: 'my-lib',
    },
    rolldownOptions: {
      external: ['react'],
      output: {
        globals: { react: 'React' },
      },
    },
  },
})
```

## Preload Error Handling

```ts
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload()
})
```

## Browser Support (Production)

Default target (`baseline-widely-available`): Chrome >= 111, Edge >= 111, Firefox >= 114, Safari >= 16.4.

## Source

- https://vite.dev/guide/
- https://vite.dev/guide/build
- https://vite.dev/guide/env-and-mode
- https://vite.dev/config/
