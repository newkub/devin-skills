# Framework SolidJS API & Dependencies

## Install

```sh
# Create new project with Vite template (recommended)
bun create vite@latest my-app --template solid-ts
# or
npx degit solidjs/templates/ts my-app

# SolidStart (meta-framework)
npm create solid@latest my-app

# Manual install
bun add solid-js
bun add -D babel-preset-solid vite-plugin-solid
```

## Version

- Latest: 1.9.15 (`solid-js`); Solid 2.0 in beta/rc
- [Package Registry](https://www.npmjs.com/package/solid-js)
- [Repository](https://github.com/solidjs/solid)

## Dependencies

- Runtime deps: `csstype`, `seroval`, `seroval-plugins`.
- JSX compilation requires `babel-preset-solid` (or `vite-plugin-solid` which includes it); TypeScript uses `"jsx": "preserve"` + `"jsxImportSource": "solid-js"`.
- Router: `@solidjs/router`; meta-framework: `@solidjs/start`.
- Fine-grained reactivity — no virtual DOM; components run once.

## Common API / Commands

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

## Source

- Official docs: https://docs.solidjs.com/
- Website: https://www.solidjs.com/
- Description: SolidJS — a declarative JavaScript library for building UIs with fine-grained reactivity and no virtual DOM.
