# VueUse — Best Practices

Composables collection — prefer using it over hand-rolling, cleanup discipline

## Recommended Patterns

- Reach for VueUse before writing your own: `useEventListener`, `useFetch`, `useLocalStorage`, `useResizeObserver`, `useIntersectionObserver` — auto-cleanup + already SSR-safe
- Composables return refs + cleanup functions — don't destructure until reactivity is lost (use `toRefs` or keep the object)
- `useEventListener` instead of manual `addEventListener` + `onUnmounted` — auto-removes on unmount
- The options object of each composable (`immediate`, `deep`, `throttle`) — read it before assuming defaults
- `@vueuse/core` = the base; `@vueuse/integrations` for wrappers (axios, focus-trap, etc.) — don't re-wrap

## Common Pitfalls

- Composables must be called in the setup scope (top-level `<script setup>` or `setup()`) — not inside callbacks/event handlers
- SSR: many composables access `window`/`document` — VueUse guards it, but check the returned `isSupported` ref
- `useFetch` ≠ a full query client — no real cache/dedup/retry; heavy work → TanStack Query
- Storage composables (`useLocalStorage`) sync via storage events — cross-tab for free, but mind serialization (objects = JSON)

## Perf Notes

- A `computed`/`watch` inside a composable = a shared reactive graph — create a composable instance per component, don't accidentally share an instance across components
- Event-based composables throttle/debounce via options — never leave scroll/resize/mouse raw
- `useVirtualList` for long lists — not a v-for over everything

## Do / Don't

| Do | Don't |
|----|-------|
| `useEventListener` auto-cleanup | manual add/remove listeners |
| check `isSupported` for SSR APIs | always assume browser globals |
| call composables in the setup scope | call them in event handlers/async |
| use VueUse before writing your own | re-implement useEventListener yourself |
