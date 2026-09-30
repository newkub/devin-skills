| key | value |
|---|---|
| version | 1.9.15 |
| package registry | https://www.npmjs.com/package/solid-js |
| repository | https://github.com/solidjs/solid |
| docs | https://docs.solidjs.com/ |
| website | https://www.solidjs.com/ |

| commands | description | default | options |
|---|---|---|---|
| `import { createSignal }` | Reactive state primitive | lazy recompute | `createSignal<T>(value, { equals, name })` → `[get, set]` |
| `import { createEffect }` | Side-effect tracking primitive | runs after render | `createEffect(fn)` |
| `import { createMemo }` | Cached derived value | lazy | `createMemo(fn, initialValue?, { equals })` |
| `import { createResource }` | Async data fetching | non-blocking | `createResource(source, fetcher, { initialValue, ssrLoadFrom })` → `[data, { refetch, mutate }]` |
| `import { createStore }` | Nested reactive state | `solid-js/store` | `createStore(obj)` → `[state, setState]`; `produce`, `reconcile`, `unwrap` |
| `import { render }` | Mount app to DOM | `solid-js/web` | `render(() => <App/>, element)` |
| Control flow components | JSX control flow | tree-shakable | `<For>`, `<Show>`, `<Switch>`/`<Match>`, `<Index>`, `<Portal>`, `<Suspense>`, `<ErrorBoundary>`, `<Dynamic>` |
| `createContext` / `useContext` | Dependency injection | component scope | `createContext<T>(defaultValue)`, `useContext(ctx)` |
| `lazy` / `Suspense` | Code-split components | named export | `lazy(() => import('./Comp'))` |
| `onMount` / `onCleanup` | Lifecycle hooks | component scope | `onMount(fn)`, `onCleanup(fn)` |
| Utilities | Reactivity helpers | `solid-js` | `batch`, `untrack`, `createRoot`, `mergeProps`, `splitProps`, `createUniqueId`, `on`, `startTransition` |
| `use:` directives | Custom element directives | element attr | `use:directiveName` maps to `function(el, accessor)` |
| `import 'solid-js/h'` | Hyperscript runtime (no JSX) | `h()` calls | `import 'solid-js/h/jsx-runtime'` |
| `import 'solid-js/html'` | Tagged-template runtime | `` html`...` `` | lit-html style templates |
| `bun run dev` / `vite` | Dev server (Vite-based) | localhost:5173 | `--port`, `--host`, `--open` |
| `bun run build` / `vite build` | Production build | `dist/` | `--mode`, `--outDir`, `--watch` |
