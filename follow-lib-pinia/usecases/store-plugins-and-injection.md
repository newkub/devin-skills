# Use Case — Extend Every Store With a Plugin

> A plugin is the one place to add a shared API client, a working `$reset`, and action logging to every store — as long as it is registered before the first store is created. Source: https://pinia.vuejs.org/core-concepts/plugins.html (accessed 2026-10-20)

## 1. Register plugins before mounting

```ts
// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import { apiPlugin, resetPlugin, actionLogger } from "@/plugins/pinia";
import App from "./App.vue";

const pinia = createPinia();
pinia.use(apiPlugin);
pinia.use(resetPlugin);
pinia.use(actionLogger);

createApp(App).use(pinia).mount("#app");
```

A plugin only applies to stores created after `pinia.use()` runs. Registering after `app.use(pinia)` leaves any store that was already instantiated — during app setup or a router guard — without the plugin.

## 2. Inject a shared dependency

```ts
// plugins/pinia.ts
import type { PiniaPluginContext } from "pinia";
import { api } from "@/lib/api";

export function apiPlugin(_context: PiniaPluginContext) {
  return { api };
}

declare module "pinia" {
  export interface PiniaCustomProperties {
    api: typeof api;
  }
}
```

The object a plugin returns is merged into the store, so `useTodos().api.list("/todos")` is typed without a cast. Injection reaches the store instance and options stores' `this`, but not the body of a setup store — inside `defineStore("todos", () => { ... })` import `api` directly, or take it as an argument. Use the injected copy from components and from actions that receive the store.

## 3. Give setup stores a working `$reset`

```ts
export function resetPlugin({ store }: PiniaPluginContext) {
  const initial = JSON.parse(JSON.stringify(store.$state));

  return {
    $reset() {
      store.$patch((state) => Object.assign(state, JSON.parse(JSON.stringify(initial))));
    },
  };
}
```

Setup stores ship a `$reset()` that throws "does not implement $reset()". Returning one from the plugin replaces it and snapshots the state at creation time. State must be JSON-serializable — a `Date` comes back as a string unless the store keeps dates as ISO strings anyway (which SSR requires).

## 4. Log every action centrally

```ts
export function actionLogger({ store }: PiniaPluginContext) {
  store.$onAction(({ name, args, after, onError }) => {
    const started = performance.now();

    after((result) => {
      console.debug(`[${store.$id}] ${name} ${Math.round(performance.now() - started)}ms`, args, result);
    });

    onError((error) => {
      console.error(`[${store.$id}] ${name} failed`, error);
    });
  });
}
```

`$onAction` fires for every action call; `after` runs on success and `onError` on a thrown error. Both hooks are registered per call, so nothing has to be cleaned up between requests — `store.$dispose()` drops the subscription when the store goes away.

## 5. Keep browser-only plugins out of the server render

```ts
export function draftPlugin({ store }: PiniaPluginContext) {
  if (typeof window === "undefined") return {};

  const key = `draft:${store.$id}`;
  const saved = window.localStorage.getItem(key);
  if (saved) store.$patch(JSON.parse(saved));

  store.$subscribe((_mutation, state) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, { detached: true });
}
```

A plugin runs during SSR too. Touch `window`/`document`/`localStorage` only after the guard, or the server render fails with `window is not defined`. `{ detached: true }` keeps the subscription alive outside a component scope — appropriate here, because the plugin is not owned by a component.

## 6. Verify

1. Create a store after `createPinia()` but before `use(pinia)` — the injected property is missing, proving registration order matters
2. Call `useTodos().$reset()` on a setup store — state returns to its initial values instead of throwing
3. Trigger an action and a failing action — one debug line with a duration, one error line
4. Render the app with SSR enabled — no `window is not defined`, and no draft is written during the server render
5. Reload a page with a saved draft — the store starts from the stored values on the client
6. `vue-tsc` — `store.api` and `store.$reset()` type-check without casts
7. `/run-test` — a test registering the same plugins on a fresh `createPinia()`

## Pitfalls

- Calling `pinia.use()` after the first store was created — the plugin silently misses it.
- Expecting `this.api` inside a setup store body; `this` is not the store there.
- Snapshotting `store.$state` without cloning — the "initial" object mutates along with the store, so `$reset()` restores nothing.
- Reading `localStorage` at plugin top level, which throws during SSR.
- Leaving `$subscribe` attached without `{ detached: true }` outside a component — it is cleaned up when the owning scope unmounts, so the draft stops saving.
- Using a plugin for what a single store action should do — a plugin is for cross-cutting concerns, not for hiding business logic.
- Registering the same plugin twice in HMR — guard with a flag or expect duplicate logging.

## Related

- `references/apis.md`
- `best-practices/stores.md`
- `usecases/setup-store-crud.md`
- `usecases/nuxt-ssr-and-hydration.md`
