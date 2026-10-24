# Unhead — Best Practices

> Source: https://unhead.unjs.io/ (accessed 2026-10-24), `unhead@3.4.3`

## Recommended Patterns

### One instance, created at the edge

```ts
import { createHead } from '@unhead/vue/client'

export const head = createHead({
  plugins: [UnheadSchemaOrg()],
})
```

Create it once per app — and once per request on the server. Components only call composables.

### Declare tags through composables, key everything

```ts
useHead({
  title: computed(() => post.title),
  link: [{ rel: 'canonical', href: computed(() => post.url) }],
  meta: [
    { name: 'description', content: computed(() => post.summary), key: 'description' },
  ],
})
```

Reactive values are tracked automatically; `key` gives the entry stable identity so later overrides replace instead of stacking.

### Prefer `useSeoMeta` for social tags

```ts
useSeoMeta({
  title: post.title,
  description: post.summary,
  ogTitle: post.title,
  ogImage: post.cover,
  twitterCard: 'summary_large_image',
})
```

Flat keys map to the correct `name`/`property` attributes — hand-written `og:*` arrays drift.

### Render SSR payload exactly as produced

```ts
const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(head)
```

`renderSSRHead` is synchronous in v3. Inject the strings verbatim; the payload already handles escaping, deduplication, and priority.

### Use `useScript` for third-party SDKs

```ts
const script = useScript('https://cdn.example.com/analytics.js', {
  use: () => window.analytics,
})
script.proxy.track('signup')
```

Calls through `proxy` queue until the SDK resolves, and repeated `useScript` calls share one load.

## Common Pitfalls

- **Module-level head in SSR** — a shared singleton leaks entries between requests. Create per request.
- **`await renderSSRHead()`** — v3 is synchronous; awaiting a plain object works by accident but hides the real API.
- **Un-keyed dynamic tags** — a tag without `key` (or a stable identity attribute) duplicates on every navigation.
- **Manual `document.title` next to Unhead** — the next render overwrites it and hydration mismatches.
- **`useHead` with user input** — untrusted values must go through `useHeadSafe`; raw meta can inject attributes.
- **Secrets in head** — everything in the head is public HTML.
- **Mixed package versions** — one v2 `@unhead/*` package next to a v3 core breaks the shared types at runtime.
- **Expecting `%param%` templates or alias ordering to work** — both plugins are opt-in in v3.
- **Hand-merging SSR strings** — reordering `headTags` breaks priority and deduplication.
- **Installing Unhead in Nuxt** — Nuxt already provides the composables; a second copy loads two cores.

## Related

- `references/apis.md`
- `references/migration-v3.md`
- `usecases/spa-head-setup.md`
- `usecases/ssr-render.md`
