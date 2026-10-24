# Use Case — Reactive Title And Meta In An SPA

> Per-route head tags with no manual DOM writes. Source: https://unhead.unjs.io/ (accessed 2026-10-24)

## 1. Install and create the instance once

```ts
// src/lib/head.ts
import { createHead } from '@unhead/vue/client'

export const head = createHead()
```

One instance for the whole app. Register it with the framework (Vue `app.use(head)`, React provider, Svelte context).

## 2. Declare tags in the route component

```ts
<script setup lang="ts">
const props = defineProps<{ post: { title: string; summary: string; url: string } }>()

useHead({
  title: props.post.title,
  link: [{ rel: 'canonical', href: props.post.url }],
})

useSeoMeta({
  description: props.post.summary,
  ogTitle: props.post.title,
  ogType: 'article',
})
</script>
```

Both composables register reactive entries, so navigating to another route replaces title and meta without a manual cleanup call.

## 3. React to async data

```ts
const post = ref<Post | null>(null)
onMounted(async () => { post.value = await fetchPost() })

useHead({
  title: computed(() => post.value?.title ?? 'Loading…'),
})
```

Getters/computed values keep the entry live; no second `useHead` call when data arrives.

## 4. Override from a parent or plugin

```ts
useHead({ titleTemplate: '%s — My Site' }) // layout
useHead({ title: 'Checkout' })              // page
```

The page title resolves through the layout's template — decouple the suffix from each page.

## 5. Dispose imperative entries

```ts
const entry = head.push({ meta: [{ name: 'robots', content: 'noindex' }] })
onUnmounted(() => entry.dispose())
```

Composables clean up with their component scope; raw `head.push` calls do not.

## Pitfalls

- Creating `createHead()` inside a component creates a new core per mount and loses deduplication.
- Setting `document.title` directly after `useHead` — the next render overwrites it and leaves two sources of truth.
- Forgetting `key` on dynamic entries (e.g. multiple JSON-LD blocks) makes them stack instead of replace.
- Using `useHead` for SEO/social tags when `useSeoMeta` already maps the flat keys.

## Related

- `references/apis.md`
- `usecases/safe-user-content.md`
- `best-practices/unhead.md`
