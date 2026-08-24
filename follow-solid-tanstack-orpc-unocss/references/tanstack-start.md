# TanStack Start (SolidJS)

## Source

- Getting Started: https://tanstack.com/start/latest/docs/framework/solid/getting-started
- Build from Scratch: https://tanstack.com/start/latest/docs/framework/solid/build-from-scratch
- Solid Libraries: https://tanstack.com/libraries/solid

## Version

- `@tanstack/solid-start`: `1.168.47` (latest stable)
- `@tanstack/solid-router`: `1.170.30` (latest stable)
- `solid-js`: `1.9.15` (latest stable)

## Installation

### Using CLI

```bash
npx @tanstack/cli@latest create --framework solid
```

You will be prompted to choose package manager and optional add-ons (Tailwind CSS, ESLint).

### Manual Installation

```bash
# Core
npm i @tanstack/solid-start @tanstack/solid-router solid-js

# Vite build tool
npm i -D vite vite-plugin-solid typescript @types/node

# Rsbuild (alternative)
npm i -D @rsbuild/core @rsbuild/plugin-babel @rsbuild/plugin-solid
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

Do NOT enable `verbatimModuleSyntax` — it can cause server bundles to leak into client bundles.

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import viteSolid from 'vite-plugin-solid'

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
    // solid's vite plugin must come after start's vite plugin
    viteSolid({ ssr: true }),
  ],
})
```

## `package.json` Scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

## Router Configuration

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}
```

## Root Route

```tsx
// src/routes/__root.tsx
import * as Solid from 'solid-js'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/solid-router'
import { HydrationScript } from 'solid-js/web'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: Solid.JSX.Element }>) {
  return (
    <html>
      <head><HydrationScript /></head>
      <body>
        <HeadContent />
        <Solid.Suspense>{children}</Solid.Suspense>
        <Scripts />
      </body>
    </html>
  )
}
```

## Server Functions

```tsx
import { createServerFn } from '@tanstack/solid-start'
import { createFileRoute } from '@tanstack/solid-router'

const getCount = createServerFn({ method: 'GET' }).handler(() => {
  return 42
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})
```

## Project Structure

```
.
├── src/
│   ├── routes/
│   │   └── __root.tsx
│   ├── router.tsx
│   ├── routeTree.gen.ts    # auto-generated
├── vite.config.ts
├── package.json
└── tsconfig.json
```
