# Use Case — Persist a Slice of the Store

> Keep user preferences across reloads without persisting tokens, caches, or anything that must stay server-owned. Source: https://prazdevs.github.io/pinia-plugin-persistedstate/ (accessed 2026-10-20)

## 1. Install and register the plugin

```ts
// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).mount("#app");
```

With Nuxt, add `@pinia/nuxt` plus `@pinia-plugin-persistedstate/nuxt` to `modules` — the module registers the plugin for you.

## 2. Persist an explicit slice

```ts
// stores/usePreferences.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const usePreferences = defineStore(
  "preferences",
  () => {
    const theme = ref<"light" | "dark">("light");
    const density = ref<"comfortable" | "compact">("comfortable");
    const sidebarOpen = ref(true);

    const setTheme = (next: "light" | "dark") => {
      theme.value = next;
    };

    return { theme, density, sidebarOpen, setTheme };
  },
  {
    persist: {
      key: "prefs:v1",
      pick: ["theme", "density"], // sidebarOpen stays session-only
    },
  },
);
```

`pick` is the allow-list. Listing what to persist is safer than `omit`, because a new field is then opt-in rather than silently written to storage.

## 3. Restrict what a custom serializer can see

```ts
persist: {
  key: "prefs:v1",
  pick: ["theme", "density"],
  serializer: {
    serialize: (state) => JSON.stringify(state),
    deserialize: (raw) => JSON.parse(raw),
  },
}
```

For `localStorage`, values are strings — the serializer is the single place to change the encoding when you migrate formats.

## 4. Hydrate deliberately on the server

```ts
onMounted(() => {
  preferences.theme = document.documentElement.dataset.theme as "light" | "dark";
});
```

SSR renders without storage access, so the first client render can differ. Apply persisted values in a lifecycle hook or a plugin `afterHydrate`, not during module evaluation.

## 5. Version the key when the shape changes

```ts
persist: { key: "prefs:v2", pick: ["theme", "density"] }
```

Bumping the key discards incompatible old data — a deliberate reset beats a runtime error from a stale shape.

## Pitfalls

- Persisting the whole store by default writes tokens and API responses to `localStorage`, where any script can read them.
- Reading storage during module evaluation breaks SSR and produces a hydration mismatch.
- Changing a persisted shape without bumping `key` throws on deserialize for every returning user.
- Storing large blobs (lists, images) hits the 5 MB quota and fails silently in most browsers.
- Assuming `sessionStorage` survives a new tab — it is per-tab by design.
- Treating persisted state as authoritative for permissions; the server must still check every request.

## Related

- `references/apis.md`
- `best-practices/stores.md`
- `usecases/setup-store-crud.md`
- `usecases/test-store.md`
