# SolidJS — Reactivity and the Render-Once Mental Model

Best practices for signals, stores, effects, and props in Solid.js — where React migrants trip up most

## Recommended Patterns

### Render-Once Components

- The component function runs once to set up the view — there is no re-render like React; anything reactive must live in JSX, `createMemo`, or `createEffect`
- Always read signals in JSX: `<div>{count()}</div>` — reading outside JSX yields a snapshot at that moment, not reactive
- Code written in the component body = init logic only — never write logic expected to re-run

### Props — Never Destructure

```tsx
// wrong — destroys reactivity by destructuring at init
const { title } = props

// correct — preserves the getter chain
const { local, others } = splitProps(props, ['local'])
const merged = mergeProps({ size: 'md' }, props)
```

- Use `mergeProps` for default props, `splitProps` when props must be split and forwarded
- Access `props.title` directly in JSX/scope — props is already a reactive proxy object

### Signals vs Stores

| Situation | Use |
|---|---|
| primitive, flat state | `createSignal` |
| nested object/tree updated at specific fields | `createStore` from `solid-js/store` |
| interop with external libs that mutate directly | `createMutable` (careful — every mutation is reactive) |

- Update stores with path syntax: `setState('users', 0, 'name', 'x')` or `produce(draft => ...)`
- Use the signal setter's function form `setCount(c => c + 1)` when referencing the previous value — no need to read the signal outside the setter

### Derived State — Don't Use Effects

```ts
// wrong — an effect is not where derived state gets synced
createEffect(() => setFullName(`${first()} ${last()}`))

// correct — a memo or a plain function in JSX
const fullName = createMemo(() => `${first()} ${last()}`)
```

- Simple derived values → a plain function suffices (Solid tracks it inside the reactive scope automatically)
- `createMemo` only for genuinely expensive computations — memo caching has slight overhead
- `createEffect` is for side effects only: DOM mutation, third-party libs, logging, syncing with external systems

## Common Pitfalls

- Destructuring props → the UI silently stops updating — the most common bug from React migrants
- Reading a signal in the component body outside a reactive scope → the value never changes
- Calling `setState` in a `createEffect` that reads the same state → infinite loop (use `untrack` or move it to an event handler)
- Fetching data in `createEffect` → always use `createResource` instead
- Using `createMemo` everywhere "just in case" — plain derived values need no memo
- Nested reactivity through function components wrapping children — children re-run every time a parent signal changes if the scope isn't separated

## Do / Don't

| Do | Don't |
|---|---|
| Read signals in JSX/`createMemo`/`createEffect` | Read signals in the component body outside a reactive scope |
| Use `batch` to merge many updates into one tick | Set signals repeatedly in a handler without batching |
| Use `on(deps, fn)` when explicit deps are needed | Hope auto-tracking is always right in complex callbacks |
| Use `untrack` to read without creating a dependency | Kill tracking by copying the value into a plain variable |
| Keep non-serializable objects (DOM, class instances) in plain variables | Put them in a signal/store unnecessarily |
| Use `createRoot` + `dispose` when creating a reactive scope outside components | Create effects outside a root and forget to dispose |

## Performance Notes

- Fine-grained updates = no VDOM diff — but an oversized reactive graph has a cost too; split stores per feature, don't build a global mega-store
- `batch` cuts propagation rounds when several signals update together
- `untrack` prevents unintended dependencies in memos/effects — it skips needless recomputes
- `createDeferred` defers non-urgent updates (e.g. search results, heavy lists)
- Reactive reads inside big loops → hoist them into one memo or use the `mapArray`/`indexArray` helpers

## Ecosystem / Integration

- Router: `@solidjs/router` has its own primitives (`createAsync`, cache) — usable alongside `createResource`
- TanStack Query offers `@tanstack/solid-query` — use it instead of `createResource` when advanced caching/devtools are needed
- SSR/SolidStart: reactivity behaves the same but `onMount` doesn't run on the server — keep browser-only code in `onMount` always
- three.js/D3: keep instances in a closure + dispose via `onCleanup` — never store them in a store (the proxy breaks class internals)
- Testing: `@solidjs/testing-library` + `renderHook`/`testEffect` — wrap with `createRoot` when testing primitives outside components
