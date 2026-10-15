# Best Practices: Pinia (Vue 3 State Management)

Guidance for designing stores, state, actions, persistence, and testing to be predictable and type-safe

## Recommended Patterns

- Prefer the setup function pattern `defineStore('id', () => {...})` — Composition API style, easier to write than an options store
- Split stores by domain/feature (`useUserStore`, `useCartStore`) — not one global dump holding everything
- State with `ref`/`reactive`, derived values with `computed`, side effects in actions
- Actions are plain async functions — handle errors inside, return a value when needed
- Destructure state in components with `storeToRefs(store)` — never destructure directly or reactivity is lost
- Batch updates with `store.$patch({...})` or `store.$patch(fn)` — reduces re-triggered subscriptions
- Persist only necessary fields via `pinia-plugin-persistedstate` `pick`/`paths` — don't persist the whole store without thinking

## Do / Don't

| Do | Don't |
|---|---|
| use `storeToRefs` when destructuring reactive state | `const {count} = store` — reactivity is gone |
| mutate state only in actions | edit state directly from a component (hard to debug) |
| expose only the state/methods actually used | expose all internal refs |
| use `setActivePinia(createPinia())` in test setup | reuse one pinia instance across tests |
| persist with `pick` naming explicit fields | persist sensitive data (tokens, PII) into localStorage |
| clean up with `store.$dispose()` when a store is no longer used | leave subscriptions dangling in memory |

## Common Pitfalls

- Setup stores have no built-in `$reset()` — implement a reset action yourself (or use an Options store if you need it)
- `storeToRefs` is for state/getters only — actions destructure fine directly since they're functions
- SSR/Nuxt: state must be serializable — functions/class instances in state break hydration
- Persist + async hydration mismatch — configure `persist` strategies to wait for the client side
- Plugin: forgot `pinia.use(plugin)` before `app.use(pinia)` — persistence silently does nothing
- Watching store state in a component via `watch(store.field)` — use the getter ref from `storeToRefs` or `store.$subscribe` instead

## Performance Notes

- A huge store = lots of re-renders — split stores by feature to cut cross-dependencies
- Getters are `computed` — cached automatically; don't recompute the same thing in components
- `$subscribe` receives every mutation — use `{detached: true}` or filter in the callback on hot paths
- Persistence writes on every state change — throttle/serialize only the fields you need
- Lazy store loading: `defineStore` doesn't instantiate until called — defining many stores is safe

## Ecosystem / Integration

- Nuxt: `@pinia/nuxt` auto-imports `defineStore`, `storeToRefs` — set `pinia.storesDirs` if your paths differ from the default
- Testing: Vitest + `setActivePinia` — mock external services inside actions
- Persistence: `pinia-plugin-persistedstate` supports `storage`, `serializer`, `pick`
- Devtools: the Pinia tab in Vue DevTools — debug the state timeline
