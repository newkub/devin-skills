# Use Case — Pinia in Nuxt: SSR State Without Leaks

> On the server a store lives for one request; on the client it lives for the whole session. Every Nuxt bug around Pinia comes from confusing those two lifetimes. Source: https://pinia.vuejs.org/ssr/nuxt.html (accessed 2026-10-20)

## 1. Register the module and point it at your stores

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
```

`@pinia/nuxt` creates the Pinia instance per request, serializes its state into the Nuxt payload, and restores it on hydration. `storesDirs` is only needed when the stores live outside `stores/`; the module auto-imports `defineStore` and `storeToRefs` either way.

## 2. Instantiate stores inside setup, never at module scope

```ts
// composables/useTodoCount.ts
// BAD: runs once on the server and is shared by every request
// const todos = useTodos();
// export const useTodoCount = () => computed(() => todos.items.length);

import { computed } from "vue";
import { useTodos } from "~/stores/useTodos";

export const useTodoCount = () => {
  const todos = useTodos();
  return computed(() => todos.items.length);
};
```

A `useStore()` call at module scope captures the Pinia instance of whichever request imported the file first; every later request then reads that user's state. Call it inside `setup()`, inside a composable function, or inside a route middleware.

## 3. Load data once, on the server

```vue
<script setup lang="ts">
import { useTodos } from "~/stores/useTodos";

const todos = useTodos();

await callOnce("todos:load", () => todos.load());
</script>

<template>
  <ul>
    <li v-for="todo in todos.items" :key="todo.id">{{ todo.title }}</li>
  </ul>
</template>
```

`callOnce` runs the loader during SSR and skips it again on the first client render, so the HTML already contains the list and no duplicate request fires after hydration. Use `useAsyncData` instead when the template also needs `pending`/`error` state from the same call.

## 4. Keep state serializable

```ts
export const useOrder = defineStore("order", () => {
  const createdAt = ref<string | null>(null); // ISO string, not a Date

  const createdLabel = computed(() =>
    createdAt.value ? new Date(createdAt.value).toLocaleDateString() : "—",
  );

  return { createdAt, createdLabel };
});
```

State crosses the boundary as JSON: `Date`, `Map`, `Set`, and class instances lose their prototype, and a non-serializable value can break the payload entirely. Store primitives and plain objects, then rebuild the rich value in a getter or action. Reading `createdAt.value.getFullYear()` on the client is the usual hydration crash.

## 5. Persist only the fields the server does not own

```ts
export const usePreferences = defineStore(
  "preferences",
  () => {
    const theme = ref<"light" | "dark">("light");
    return { theme };
  },
  { persist: { key: "prefs:v1", pick: ["theme"] } },
);
```

With `@pinia-plugin-persistedstate/nuxt` the storage plugin skips the server and hydrates on the client. That means the first server-rendered paint cannot know the stored theme — apply it in `onMounted` or through an inline script that sets `data-theme` before hydration, otherwise the page flashes the default.

## 6. Verify

1. `nuxt build` then run the server — view-source of the first response contains the rendered list
2. Two parallel requests with different sessions — neither response contains the other user's items
3. Browser console after load — no "Hydration node mismatch" warnings
4. A field stored as a `Date` — it renders through the getter, not through a method call on the raw value
5. Reload with a stored theme — the preference survives, and the server log shows no `localStorage` access
6. Client-side navigation away and back — the store keeps its state, proving it is not re-created per route
7. `/run-test` — an e2e assertion that the SSR HTML contains the list items

## Pitfalls

- A store composable called at module scope, which shares one user's state across every request — the classic SSR data leak.
- `window`, `document`, or `localStorage` in a store body or at plugin top level, which returns a 500 on the server render.
- Assigning a `Date` or a class instance to state, then calling its methods after hydration.
- Persisting server-owned data (tokens, permissions) and trusting it on the client.
- Assuming `useAsyncData` and `callOnce` are interchangeable — `callOnce` has no pending/error state, `useAsyncData` re-runs on key changes.
- Fetching in `onMounted` only, which ships an empty first paint and defeats SSR.
- Forgetting that client-side navigation reuses the store — a `reset()` is required when the next page must start clean.
- Setting `storesDirs` and still importing stores by relative path in some files, producing two module instances of the same store id.

## Related

- `references/apis.md`
- `best-practices/stores.md`
- `usecases/setup-store-crud.md`
- `usecases/persist-store.md`
- `usecases/store-plugins-and-injection.md`
