# Solid Runtime Adapter

Vivari has no Solid binding. Wrap `@vivari/core` in one module that owns the singleton, status, and teardown.

## Adapter

```ts
// src/runtime/vivari-runtime.ts
import { createSignal, onCleanup } from "solid-js"

export type RuntimeStatus =
  | { kind: "idle" }
  | { kind: "booting" }
  | { kind: "ready"; vivari: import("@vivari/core").Vivari }
  | { kind: "unsupported"; reason: "not-cross-origin-isolated" | "no-web-workers" }
  | { kind: "error"; message: string }

let instance: import("@vivari/core").Vivari | null = null
let booting: Promise<void> | null = null
const [status, setStatus] = createSignal<RuntimeStatus>({ kind: "idle" })

export { status }

export async function bootRuntime() {
  if (status().kind === "ready" || booting) return booting

  const { Vivari, isCrossOriginIsolated } = await import("@vivari/core")

  if (!isCrossOriginIsolated()) {
    setStatus({ kind: "unsupported", reason: "not-cross-origin-isolated" })
    return
  }

  setStatus({ kind: "booting" })
  booting = (async () => {
    try {
      instance = await Vivari.boot({ timeout: 30_000 })
      setStatus({ kind: "ready", vivari: instance })
    } catch (err) {
      const code = (err as { code?: string }).code
      setStatus({ kind: "error", message: code ?? String(err) })
    } finally {
      booting = null
    }
  })()

  return booting
}

export async function shutdownRuntime() {
  await instance?.teardown?.()
  instance = null
  setStatus({ kind: "idle" })
}

export function useRuntime() {
  onCleanup(() => { /* ref-count in a real app; see below */ })
  return { status, bootRuntime }
}
```

Ref-count consumers so the kernel is torn down only when the last consumer unmounts:

```ts
let consumers = 0

export function acquireRuntime() {
  consumers++
  void bootRuntime()
  return () => {
    consumers--
    if (consumers === 0) void shutdownRuntime()
  }
}
```

## Preview Component

```tsx
import { createEffect, Show } from "solid-js"
import { status } from "./vivari-runtime"

export function RuntimePreview(props: { iframe: HTMLIFrameElement }) {
  createEffect(() => {
    const s = status()
    if (s.kind !== "ready") return
    s.vivari.attachPreview(props.iframe)
    void s.vivari.once("server-ready").then(([, url]) => {
      props.iframe.src = url
    })
  })

  return (
    <Show when={status().kind === "ready"} fallback={<p>Runtime not ready</p>}>
      <iframe ref={props.iframe} title="Preview" class="h-full w-full border-0" />
    </Show>
  )
}
```

## Notes

- `createSignal` holds a **class instance**, not a plain object. Keep it outside the reactive graph (module-level) and expose only a status signal, or wrap in `createStore` with `reconcile: false`.
- Boot on explicit intent: a Run button, a route, or `IntersectionObserver`.
- Mirror `VivariFailure.phase` into user-facing copy: `unsupported` means "your host is missing isolation headers", not "your code is broken".
- Teardown must kill spawned processes first, then close watchers, then tear down the kernel.
