# Use Case — Extract Logic Into a Composable That Cleans Up

> Move a component's data flow into a composable whose watchers and listeners die with their owner. Source: https://vuejs.org/guide/reusability/composables.html (accessed 2026-10-20)

## 1. Start from the component's real needs

```ts
// composables/useOrders.ts
import { computed, ref, shallowRef, watch } from "vue";

export function useOrders(customerId: () => string) {
  const orders = shallowRef<Order[]>([]);
  const status = ref<"idle" | "loading" | "error">("idle");

  const total = computed(() => orders.value.reduce((sum, o) => sum + o.total, 0));

  watch(
    customerId,
    async (id, _previous, onCleanup) => {
      const controller = new AbortController();
      onCleanup(() => controller.abort());

      status.value = "loading";
      try {
        orders.value = await api.orders(id, { signal: controller.signal });
        status.value = "idle";
      } catch (error) {
        if (!controller.signal.aborted) status.value = "error";
      }
    },
    { immediate: true },
  );

  return { orders, status, total };
}
```

The parameter is a getter, not a `ref`. A getter accepts a computed, a prop, or a plain value, and the watch stays reactive without the composable owning the source.

## 2. Use `shallowRef` for arrays of records you replace wholesale

`orders.value = await api.orders(...)` assigns a new array, so deep reactivity buys nothing and costs a proxy per record. Use `ref` when you mutate individual items in place.

## 3. Clean up with `onWatcherCleanup`, not a second watcher

`onWatcherCleanup` runs before the next watch callback and on scope dispose. Aborting the previous request there is what stops out-of-order responses from overwriting the newest one.

## 4. Share state at the right level

Module-level refs are the simplest shared state — one instance for the whole app:

```ts
// composables/useFilters.ts
import { ref } from "vue";

const search = ref("");
const page = ref(1);

export function useFilters() {
  return { search, page };
}
```

For branch-level state, declare the refs inside the function so each caller gets its own. Reaching for a Pinia store or module state for a wizard's temporary step is how unrelated screens start sharing a filter.

When effects must outlive a component — a plugin, a service worker bridge — own them with an explicit scope:

```ts
// plugins/analytics.ts
import { effectScope, watch } from "vue";

export function startAnalytics(route: () => string) {
  const scope = effectScope();
  scope.run(() => {
    watch(route, (path) => trackPageView(path));
  });
  return () => scope.stop();
}
```

The returned function is the only way to stop the watcher. Without it, a plugin reload stacks another watcher on the same source.

## 5. Test the composable without a component

```ts
const scope = effectScope();
const { orders, total } = scope.run(() => useOrders(() => "cus_1"))!;
await flushPromises();
expect(total.value).toBe(1200);
scope.stop();
```

`scope.stop()` proves the cleanup path: after stopping, the watcher must not fire again.

## 6. Verify

1. `/run-typecheck` and `/run-test`
2. Change the source getter — exactly one request fires, not one per keystroke
3. Unmount the component mid-flight — the request is aborted and no state update warns
4. `/run-dev` with the computed total changing as items arrive

## Pitfalls

- Taking a `ref` parameter instead of a getter, so passing a `computed` silently loses reactivity.
- Watching a `reactive()` object without a deep option and expecting nested changes to trigger.
- Creating a detached `effectScope` and never calling `.stop()`, leaving watchers that never stop.
- Holding a large API response in a deep `ref` and paying proxy cost on every record access.

## Related

- `references/apis.md`
- `best-practices/vue.md`
- `usecases/typed-sfc-contract.md`
