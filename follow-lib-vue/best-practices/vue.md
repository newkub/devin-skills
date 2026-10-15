# Vue — Best Practices

Composition API, reactivity, and component discipline for Vue 3

## Recommended Patterns

- The Composition API + `<script setup>` is the default — the Options API only for legacy codebases
- `ref()` for primitives/scalars, `reactive()` for objects that aren't reassigned — understand `.value` vs unwrapping in the template
- `computed()` for derived state — cached by deps; don't use methods for pure derivations
- Typed `defineProps`/`defineEmits` (TS generics) — `withDefaults` for defaults
- Use `watch` only when you need a side effect on dep changes; `watchEffect` when auto-tracking deps is enough
- Composables (`use*`) for shared stateful logic — return refs, not raw values

## Common Pitfalls

- Destructuring `reactive()` = reactivity lost — use `toRefs`/`toRef` when extracting
- `v-if` vs `v-show`: `v-if` actually unmounts (state is lost), `v-show` toggles display — choose by intent
- Async components + Suspense boundaries — don't assume the component mounts immediately
- `provide`/`inject` for deep trees — but beware the implicit contract; use Pinia for real shared state
- Template refs: a `ref` on a DOM element vs `defineExpose` — component refs don't expose raw internals

## Perf Notes

- `v-memo`/`v-once` for static subtrees — skip diffing
- `shallowRef`/`shallowReactive` when deep tracking isn't needed (large objects, 3rd-party instances)
- `keep-alive` for expensive components that toggle often

## Do / Don't

| Do | Don't |
|----|-------|
| `<script setup>` + typed props/emits | the Options API in new code |
| `computed` derived state | methods that recompute every render |
| `toRefs` when destructuring reactive | destructuring `reactive()` directly |
| composables `use*` for shared logic | mixins / global mutable state |
