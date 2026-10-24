# Use Case — Use Unhead Inside Nuxt

> Nuxt already ships Unhead — consume it, do not install a second copy. Source: https://unhead.unjs.io/ (accessed 2026-10-24)

## 1. Use the injected composables

```vue
<script setup lang="ts">
const route = useRoute()

useHead({
  title: route.meta.title as string,
  link: [{ rel: 'canonical', href: `https://example.com${route.path}` }],
})

useSeoMeta({
  description: 'Product page',
  ogType: 'website',
})
```

Nuxt auto-imports `useHead`, `useSeoMeta`, `useHeadSafe`, `useScript`, and `useServerSeoMeta`-replacement equivalents from its bundled Unhead. No `createHead`, no provider.

## 2. Do not install or create an instance

```bash
# wrong — Nuxt manages Unhead internally
bun add unhead
```

```ts
// wrong — a second core with its own deduplication
const head = createHead()
```

Adding the package or calling `createHead` gives the app two instances; tags render twice and priorities stop working.

## 3. Configure through Nuxt, not Unhead

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s — My Site',
      htmlAttrs: { lang: 'en' },
    },
  },
})
```

App-wide defaults belong to `app.head`; per-page tags belong to `useHead` in the page/layout.

## 4. Share state with `useSeoMeta` and route rules

```ts
useServerSeoMeta({ robots: 'noindex' }) // v2 name — use useSeoMeta in v3
```

In a v3 Nuxt version, `useSeoMeta` runs on both server and client; only reach for a server-only composable when a tag must never update client-side.

## 5. Check the Nuxt version before migrating

Nuxt pins the Unhead major it supports. Upgrade Nuxt first, then follow the renames in `references/migration-v3.md` — do not pin Unhead ahead of the Nuxt release that ships it.

## Pitfalls

- Installing `unhead` or `@unhead/vue` explicitly in a Nuxt app duplicates the core.
- Creating a head instance in a Nuxt plugin bypasses Nuxt's request-scoped instance.
- Hand-writing `<head>` tags in `app.vue` when `app.head`/`useHead` already owns them.
- Assuming v2 composable names (`useServerHead`, `useServerSeoMeta`) remain in a Nuxt release built on v3.

## Related

- `references/apis.md`
- `references/migration-v3.md`
- `follow-create-web-nuxt`
