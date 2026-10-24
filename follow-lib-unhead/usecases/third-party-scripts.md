# Use Case — Load A Third-Party SDK With `useScript`

> One loader, queued API calls, explicit load state. Source: https://unhead.unjs.io/ (accessed 2026-10-24)

## 1. Declare the script once

```ts
import { useScript } from '@unhead/vue'

const analytics = useScript('https://cdn.example.com/analytics.js', {
  use: () => window.analytics,
})
```

`use` returns the global the SDK installs. Every component calling `useScript` with the same URL shares one network request and one instance.

## 2. Call the API immediately

```ts
analytics.proxy.page()
analytics.proxy.track('signup', { plan: 'pro' })
```

`proxy` queues calls until the SDK exists, then replays them. Checking `window.analytics` yourself reintroduces the race the loader removes.

## 3. React to load state

```vue
<script setup lang="ts">
const { status, onLoaded } = useScript('https://cdn.example.com/chat.js', {
  use: () => window.ChatWidget,
})

onLoaded(() => window.ChatWidget?.open())
</script>

<template>
  <button :disabled="status.value !== 'loaded'">Open chat</button>
</template>
```

`status` is reactive (`idle` → `loading` → `loaded`/`error`); use it to gate UI that depends on the SDK.

## 4. Control loading behaviour when needed

```ts
useScript('https://cdn.example.com/heavy.js', {
  use: () => window.Heavy,
  trigger: 'manual',   // load on demand
})
```

Deferred loading for heavy widgets keeps the critical path free; trigger explicitly rather than adding another `<script>` tag.

## 5. Handle failure explicitly

```ts
const script = useScript(url, { use: () => window.Sdk })

watch(script.status, (value) => {
  if (value === 'error') reportMissingSdk(url)
})
```

A blocked corporate proxy or an ad blocker is a normal outcome — surface it, do not throw.

## Pitfalls

- Adding `<script src=...>` beside `useScript` loads the SDK twice.
- Reading `window.sdk` directly instead of `proxy` before load returns `undefined`.
- Passing user input as the script URL — script sources are constants you control.
- Assuming `useScript` waits: it triggers loading, it does not block rendering.
- Duplicating options across call sites (different `use` resolvers for the same URL) splits the cached instance.

## Related

- `references/apis.md`
- `best-practices/unhead.md`
- `usecases/spa-head-setup.md`
