# Use Case — An SFC With a Fully Typed Contract

> Declare props, emits, slots, and two-way binding with types so the template and the parent cannot drift. Source: https://vuejs.org/guide/typescript/composition-api.html (accessed 2026-10-20)

## 1. Props with `defineProps<T>()`

```vue
<!-- components/order/OrderCard.vue -->
<script setup lang="ts">
import type { Order } from "~/types/order";

const props = defineProps<{
  order: Order;
  compact?: boolean;
}>();
</script>
```

A generic type argument is the whole definition. `withDefaults` is only needed when a runtime default cannot be expressed by `?`:

```ts
const props = withDefaults(defineProps<{ order: Order; currency?: string }>(), {
  currency: "USD",
});
```

## 2. Emits with `defineEmits<T>()`

```ts
const emit = defineEmits<{
  select: [id: string];
  "update:status": [status: Order["status"]];
}>();
```

Tuple syntax gives each event a typed payload. The string-literal overload (`{ select: (id: string) => void }`) does the same job; pick one style per repo, not both.

## 3. Two-way binding with `defineModel()`

```ts
const status = defineModel<Order["status"]>("status", { required: true });

// in the template
// <select v-model="status"> ...
```

`defineModel` writes back to `update:status` automatically, so the parent uses `v-model:status="order.status"` and the child needs no manual emit. Do not also declare `"update:status"` in `defineEmits` — that duplicates the same channel.

## 4. Slots with `defineSlots<T>()`

```ts
defineSlots<{
  default: (props: { order: Order }) => unknown;
  actions: (props: { disabled: boolean }) => unknown;
}>();
```

Typed slots are what let the parent's slot props autocomplete inside the template instead of arriving as `any`.

## 5. Template refs and SSR-safe IDs

```ts
const input = useTemplateRef<HTMLInputElement>("searchInput");
const fieldId = useId();
```

`useTemplateRef` replaces a plain `ref` plus a same-named variable; `useId` gives a stable ID across server and client so the label's `for` matches after hydration.

## 6. Verify

1. `/run-typecheck` — pass a wrong prop type on purpose and confirm the parent fails to compile
2. Emit with the wrong payload — the child must fail to compile, not silently drop the call
3. `/run-test` with a mount that omits a required model — the test must fail at compile time
4. Server render one page and confirm no hydration mismatch warning about IDs
5. First rule of the file: the component name is multi-word (`OrderCard`, never `Card`)

## Pitfalls

- Declaring `update:` in both `defineModel` and `defineEmits`, producing duplicate emits.
- `v-if` and `v-for` on the same element, where the `v-if` cannot see the loop variable.
- A missing `key` in a `v-for` over a list that reorders, causing stale DOM state to travel with the wrong row.
- Reading props into a `ref` at setup time (`const o = ref(props.order)`), which freezes the first value.

## Related

- `references/apis.md`
- `best-practices/vue.md`
- `usecases/composable-with-effect-scope.md`
