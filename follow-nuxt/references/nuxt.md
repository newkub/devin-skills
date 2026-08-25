# Nuxt 3/4 Reference

## Overview

Nuxt is a free and open-source framework for building type-safe, production-grade full-stack web applications with Vue.js. It provides file-based routing, auto-imports, and server-side rendering out of the box.

- Official site: https://nuxt.com
- Docs: https://nuxt.com/docs
- GitHub: https://github.com/nuxt/nuxt
- Nitro server engine: https://nitro.build / https://nitro.unjs.io

## Versions

- Nuxt 3.x: stable, uses root-level `pages/`, `components/`, `composables/` directories
- Nuxt 4.x: default, uses `app/` directory for application code (`app/pages/`, `app/components/`, `app/composables/`)
- Both versions share the same core APIs and Nitro server engine

## Installation

```sh
# Create a new Nuxt project (Nuxt CLI)
npx nuxi@latest init my-app

# Or with bun
bunx nuxi@latest init my-app
```

```sh
# Add a module (e.g. @nuxt/icon)
npx nuxi@latest module add icon

# Or manually
bun add @nuxt/icon
```

## Universal Rendering (SSR/SSG/Hybrid)

Nuxt ships with server-side rendering enabled by default. Configure rendering mode globally or per-route via `routeRules`:

```typescript
export default defineNuxtConfig({
  // Global: disable SSR
  // ssr: false,

  // Hybrid: per-route rendering
  routeRules: {
    '/': { prerender: true },        // SSG
    '/products/**': { swr: 3600 },   // ISR (stale-while-revalidate)
    '/blog': { isr: 3600 },          // ISR
    '/admin/**': { ssr: false },     // CSR
  },
})
```

- `nuxt build` — production SSR build
- `nuxt generate` — pre-render all routes to static HTML

## Nitro Server Engine

Nitro is Nuxt's server engine. It reads files in `server/api/` and `server/middleware/` to build the server API.

```typescript
// server/api/hello.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello World',
  }
})
```

```typescript
// server/api/items/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return { id }
})
```

```typescript
// server/plugins/myPlugin.ts
export default defineNitroPlugin((nitroApp) => {
  // Plugin logic at server startup
})
```

Nitro builds output into a universal `.output` directory deployable to Node.js, Serverless, Workers, or edge platforms.

- Nitro docs: https://nitro.build
- Nitro API: https://nitro.build/api

## File-Based Routing

Routes are defined by the structure of the `app/pages/` directory (Nuxt 4) or `pages/` (Nuxt 3):

```
app/
  pages/
    index.vue          → /
    about.vue          → /about
    blog/
      index.vue        → /blog
      [slug].vue       → /blog/:slug
```

```vue
<!-- app/pages/index.vue -->
<template>
  <h1>Index page</h1>
  <NuxtLink to="/blog/hello-world">
    Go to blog post
  </NuxtLink>
</template>
```

Dynamic routes use `[param]` syntax. Catch-all routes use `[...slug].vue`.

## Auto-Imports

Nuxt auto-imports Vue composables, components, and utilities without explicit import statements:

```vue
<!-- app/app.vue -->
<script setup>
const message = ref('Nuxt')       // ref is auto-imported
const hello = () => sayHello(message.value)  // sayHello from composables/
</script>
```

- `ref`, `computed`, `watch`, `useFetch`, `useAsyncData`, `useHead`, `useStorage` — all auto-imported
- Components in `app/components/` are auto-imported with their path as prefix
- Composables in `app/composables/` are auto-imported by function name

## Data Fetching

```typescript
// useFetch — SSR-compatible data fetching
const { data: page } = await useFetch('/api/cms/home')
```

```typescript
// useAsyncData — with explicit key for deduplication
const { data } = useAsyncData('tracks', () => fetch(`/tracks/${id}`))
```

Both composables handle SSR serialization, deduplication, and caching automatically.

## Key Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/icon', '@nuxt/ui'],
  extends: ['../shared-layer'],     // Layer composition
  nitro: {
    preset: 'cloudflare-pages',     // Deployment target
  },
  typescript: {
    strict: true,
  },
})
```

## Directory Structure (Nuxt 4)

```
app/
  components/       Auto-imported Vue components
  composables/      Auto-imported composables (use* prefix)
  pages/            File-based routes
  layouts/          Layout components
  plugins/          Client/server plugins
  middleware/       Route middleware
  assets/           Processed assets (images, fonts)
public/             Static files served as-is
server/
  api/              API routes (defineEventHandler)
  middleware/       Server middleware
  plugins/          Server plugins (defineNitroPlugin)
shared/
  types/            Shared TypeScript types
  utils/            Shared utilities
layers/             Feature-based reusable layers
```

## Source Links

- Installation: https://nuxt.com/docs/getting-started/installation
- Rendering modes: https://nuxt.com/docs/guide/concepts/rendering
- Server engine (Nitro): https://nuxt.com/docs/guide/concepts/server-engine
- Routing: https://nuxt.com/docs/4.x/directory-structure/app/pages
- Auto-imports: https://nuxt.com/docs/4.x/guide/directory-structure/composables
- Data fetching: https://nuxt.com/docs/4.x/api/composables/use-fetch
- Configuration: https://nuxt.com/docs/api/configuration/nuxt-config
- Modules: https://nuxt.com/modules
