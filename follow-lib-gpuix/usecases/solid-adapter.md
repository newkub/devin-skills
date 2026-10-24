# Use Case — Solid Adapter Instead Of React

> Swap the React reconciler for the Solid universal renderer without changing a single element or style name. Source: <https://gpuix.dev/docs> (accessed 2026-10-23).

## 1. Install Solid Instead Of React

```bash
bun add --exact @gpuix/solid @gpuix/native solid-js
bun add -d typescript
```

`solid-js` is a peer dep with the range `>=1.9 <2`. Keep `@gpuix/solid` and `@gpuix/native` on the same exact version — a floating range can pair a JS adapter with a mismatched native binding.

## 2. Configure JSX For Solid

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "@gpuix/solid",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

`jsx: "preserve"` leaves the JSX untouched and `jsxImportSource` names the adapter. Unlike React, Solid needs a compiler pass to turn JSX into fine-grained reactive DOM operations.

## 3. Preload The Solid Babel Preset In Bun

`bunfig.toml`:

```toml
preload = ["@gpuix/solid/preload"]
```

The preload registers `babel-preset-solid` so Bun compiles the JSX. Without it, `bun app.tsx` fails on unresolved JSX or renders a static tree that never updates.

## 4. Write The Entry File

```tsx
import { createSignal } from 'solid-js'
import { render } from '@gpuix/solid'

function App() {
  const [count, setCount] = createSignal(0)
  return (
    <div style={{ padding: 24, backgroundColor: '#1a1a1a', height: '100%' }}>
      <div
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: 12,
          borderRadius: 8,
          cursor: 'pointer',
          backgroundColor: '#232323',
          hover: { backgroundColor: '#2c2c2c' },
        }}
      >
        <text style={{ color: '#e2e2e2' }}>Count: {count()}</text>
      </div>
    </div>
  )
}

render(() => <App />, { title: 'Solid GPUIX', width: 800, height: 600 })
```

Two differences from React, both Solid's own idiom rather than GPUIX's:

- `render` takes a zero-argument component function, not a constructed element.
- Signals are read by calling them: `{count()}`, not `{count}`.

Everything inside the `return` — element names, style keys, event props — is identical to the React adapter.

## 5. Bundle With The Bun Plugin

When you build instead of run, register the Solid plugin so the JSX transform runs inside `Bun.build`:

```ts
import solidPlugin from '@gpuix/solid/bun-plugin'

await Bun.build({
  entrypoints: ['./app.tsx'],
  outdir: './dist',
  plugins: [solidPlugin],
})
```

`bun build --compile` with the plugin is the shortest path to a single binary.

## 6. Port A React Component

| React | Solid |
|-------|-------|
| `useState(0)` | `createSignal(0)` |
| `count` / `setCount(v)` | `count()` / `setCount(v)` |
| `useEffect(fn, [])` | `onMount(fn)` |
| `useMemo(fn, [deps])` | `createMemo(fn)` |
| `useCallback(fn, [])` | plain function (no re-identity churn) |
| `<App />` in `render` | `() => <App />` in `render` |
| children re-render on state change | only the reading expression updates |

Solid components run once. A component body that reads a signal outside a reactive context sees the initial value forever, so keep reads inside JSX or inside `createMemo`/`createEffect`.

## Pitfalls

- Destructuring props: `function Row({ label })` freezes the value. Use `props.label` so the getter stays live.
- Forgetting `preload` in `bunfig.toml`: JSX compiles to plain calls with no reactivity, and the UI looks frozen.
- Mixing adapters in one app: `@gpuix/react` and `@gpuix/solid` each own a renderer; one window = one adapter.
- Copying React hooks: there is no `useState` in this path, and `solid-js` will not provide React ones.
- Reading `count` instead of `count()`: renders the function object as text.
- Treating `render(() => ...)` as a factory you can call twice: one renderer drives exactly one root.

## Related

- [apis.md](../references/apis.md)
- [runtime-and-rendering.md](../best-practices/runtime-and-rendering.md)
- [desktop-quickstart.md](./desktop-quickstart.md)
- [agent-driven-verification.md](./agent-driven-verification.md)
