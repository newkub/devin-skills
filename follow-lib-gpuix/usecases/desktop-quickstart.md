# Use Case — First Window, Entry File, And Dev Loop

> Stand up a GPUIX window from an empty folder: install the adapter, point TypeScript at it, boot with one `render()`, then iterate under `bun --hot`. Source: <https://gpuix.dev/docs> (accessed 2026-10-23).

## 1. Install The Adapter And The Native Binding

```bash
bun init -y
bun add --exact @gpuix/react @gpuix/native react
bun add -d @types/react typescript
```

`@gpuix/native` resolves the platform binary from its optional deps. If the matching package (`native-darwin-arm64`, `native-win32-x64-msvc`, `native-win32-arm64-msvc`, `native-linux-x64-gnu`) did not install, the failure appears at import time, not at install time.

## 2. Point TypeScript At The Adapter

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@gpuix/react",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

`jsxImportSource` is what makes `<div>` and `<text>` resolve to GPUIX host elements instead of DOM intrinsics. Drop it and React renders React DOM components against a tree that has no DOM.

## 3. Write One Entry File

```tsx
import { useState } from 'react'
import { render } from '@gpuix/react'

function App() {
  const [count, setCount] = useState(0)
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
        <text style={{ color: '#e2e2e2' }}>Count: {count}</text>
      </div>
    </div>
  )
}

render(<App />, { title: 'My App', width: 800, height: 600 })
```

`render()` is the whole boot sequence: it creates the window, the renderer, the retained tree, and the frame loop. It is idempotent, so a hot reload can call it again. Do not call `createRenderer()`, `createRoot()`, or `startFrameLoop()` in the entry file.

## 4. Run Under Hot Reload

```bash
bun --hot app.tsx
```

What survives a save: the window, the GPU context, the loaded `.node` binding, and scroll physics. What resets: `useState` values, focus, and closures. Put state you want to keep across reloads outside the component, or accept the reset.

Plain `bun app.tsx` and `node app.tsx` both run the app, but neither reloads the window on save.

## 5. Style For GPUI, Not For The Browser

The rules that bite first:

- `div` is block by default. Set `display: 'flex'` before `flexDirection`, `gap`, or `alignItems` do anything.
- A flex child that must shrink below its content needs `minWidth: 0`.
- No shorthands: write `padding` and `paddingLeft` separately, `borderWidth` and `borderColor` separately.
- No `calc()`, no `z-index`, no `<button>`.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  <text style={{ color: '#e2e2e2' }}>Title</text>
  <div
    style={{
      display: 'flex',
      minWidth: 0,
      padding: 8,
      backgroundColor: '#1e293b',
      borderWidth: 1,
      borderColor: '#334155',
    }}
  >
    <text style={{ color: '#94a3b8' }}>Body</text>
  </div>
</div>
```

## 6. Build A Binary When You Need One

```bash
bun build --compile app.tsx --outfile dist/app
```

That produces a single executable that still needs the platform `.node` next to it — or compiled in, depending on how you ship. Wrapping it in a Dock-visible `.app` with an icon is a cargo-packager step: see `usecases/distribution-and-updates.md`.

## Pitfalls

- Reaching for CSS muscle memory: shorthand strings are ignored, not parsed. `padding: '8px 12px'` silently does nothing.
- Forgetting `height: '100%'` on the root `div`: the window paints empty because the tree has no height.
- Calling `createRoot()` a second time: one renderer drives exactly one root and the second mount throws.
- Adding `z-index` for stacking: tree order is paint order; overlays go through `<anchored>`.
- Expecting `console.log` output from the native side: JS-side logs appear, Rust-side errors surface as thrown napi errors.
- Assuming Node.js hot reload: Node runs the app but gives no `--hot` equivalent.

## Related

- [apis.md](../references/apis.md)
- [runtime-and-rendering.md](../best-practices/runtime-and-rendering.md)
- [styling-and-events.md](../best-practices/styling-and-events.md)
- [shipping-and-hot-reload.md](../best-practices/shipping-and-hot-reload.md)
- [solid-adapter.md](./solid-adapter.md)
