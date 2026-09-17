# Devframe API Surface

> Source: <https://devfra.me/raw/guide/rpc.md>, <https://devfra.me/raw/adapters.md> (verified 2026-09-18)

## Adapter Matrix

| Entry point | Module | Factory | Best for |
|-------------|--------|---------|----------|
| Standard Handler | `devframe/initiate` | `initDevframe(def, { base })` | Raw Web Standard handler |
| CLI (cac) | `devframe/adapters/cac` | `createCac(def)` | Standalone tools |
| Dev | `devframe/adapters/dev` | `createDevServer(def)` | Dev server only |
| Build | `devframe/adapters/build` | `createBuild(def, { outDir })` | Static snapshots |
| Vite | `@vitejs/devtools-kit/node` | `createPluginFromDevframe(def)` | Vite DevTools plugin |
| Embedded | `devframe/adapters/embedded` | `createEmbedded(def, { ctx })` | Runtime registration |
| MCP | `devframe/adapters/mcp` | `createMcpServer(def)` | Coding agents |

`initDevframe` returns `.handler` (`(request: Request) => Promise<Response>`) and `.nodeMiddleware` for Connect-style servers (Vite, Rsbuild). Mount paths: standalone (`cli`/`build`) → `/`; hosted (`vite`/`embedded`) → `/__<id>/`.

## Framework Kits

| Package | Subpaths | Purpose |
|---------|----------|---------|
| `@devframes/vite` | `/single`, `/hub` | dev-serve one SPA / mount a hub |
| `@devframes/nuxt` | `/single`, `/hub` | author one devframe / mount a hub |
| `@devframes/next` | route handler | host devframes via `serveStaticHandler` |

Bare imports of `@devframes/vite` and `@devframes/nuxt` throw — pick a subpath.

## RPC Function Types

| `type` | Caching | Static dump | Use for |
|--------|---------|-------------|---------|
| `query` | opt-in `cacheable` | explicit `dump` | reads that change over time |
| `static` | cached indefinitely | auto | data fixed per input |
| `action` | — | — | mutations |
| `event` | — | — | fire-and-forget notifications |

## `defineRpcFunction` Fields

```ts
defineRpcFunction({
  name: 'get-modules',        // scope prefixes → 'my-tool:get-modules'
  type: 'query',
  args: [v.object({ limit: v.number() })],   // Standard Schema
  returns: v.array(v.object({ id: v.string() })),
  jsonSerializable: true,     // strict JSON wire (vs structured-clone-es)
  cacheable: true,            // query caching opt-in
  snapshot: true,             // bake no-args result into static build
  agent: {                    // opt-in MCP exposure
    description: 'List the N largest modules. Safe to call freely.',
    title: 'List modules',
  },
  setup: ctx => ({
    handler: async ({ limit }) => loadModules().slice(0, limit),
    dump: { inputs: [['a']], fallback: null }, // pre-compute arg sets
  }),
})
```

`setup(ctx)` when the handler needs `DevframeNodeContext`; else `handler(...)` shorthand. Declared `args`/`returns` enforced at runtime.

## Serialization

| `jsonSerializable` | Encoder | Wire prefix | Round-trips |
|--------------------|---------|-------------|-------------|
| `false` (default) | `structured-clone-es` | `s:` | `Map`, `Set`, `Date`, `BigInt`, cycles, class instances |
| `true` | strict `JSON.stringify` | unprefixed | JSON-only |

`agent` field implies `jsonSerializable: true`.

## Node-Side Calls

```ts
const my = ctx.scope('my-tool')
await my.rpc.register(fn)
await my.rpc.call('get-modules', { limit: 10 })        // local, skips transport
await my.rpc.call('other-tool:fn', args)               // cross-devframe
void my.rpc.broadcast({ method: 'on-file-changed', args: [{ file }], optional: true, event: true, filter })
const state = await my.rpc.sharedState('version', { initialValue: { ts: 0 } })
state.mutate(draft => { draft.ts = Date.now() })
const channel = ctx.rpc.streaming.create<string>('my-tool:chat', { replayWindow: 256 })
const stream = channel.start()
sourceReadable.pipeTo(stream.writable)
```

## Browser Side

```ts
import { connectDevframe } from 'devframe/client'

const client = await connectDevframe()   // auto-resolves __connection.json
const my = client.scope('my-tool')
const modules = await my.rpc.call('get-modules', { limit: 10 })
const version = await my.rpc.sharedState('version')
version.on('updated', () => refetch())
```

`connectDevframe` works in dev (WebSocket/SSE) and static (dump) modes. Nuxt kit wires it as `$rpc` via `useNuxtApp()`.

## Typed RPC Registry

```ts
import type { RpcDefinitionsToFunctionsWithNamespace } from 'devframe/rpc'

const serverFunctions = [getModules, getFile] as const

declare module 'devframe' {
  interface DevframeRpcServerFunctions
    extends RpcDefinitionsToFunctionsWithNamespace<'my-tool', typeof serverFunctions> {}
}
```

Also `DevframeRpcClientFunctions` (server→client), `RpcDefinitionsToFunctions<typeof fns>` (pre-namespaced), `RpcFunctionDefinitionToFunction<typeof fn>` (one-off). Augment where the interfaces live (`devframe` or `devframe/types`).

## Hub

```ts
import { createUi } from '@devframes/hub-ui'
import { DEVFRAMES_HUB_BASE, initHub } from '@devframes/hub/initiate'

const hub = initHub({
  base: DEVFRAMES_HUB_BASE,
  devframes: [createDataInspectorDevframe(), createTerminalsDevframe()],
  ui: createUi(),
})
hub.handler // whole collection as Request → Response
```

Hub is headless: dock registry, terminal aggregation, message/toast queue, command palette. Mounted devframes share one RPC registry, state store, connection, auth gate, optional aggregate MCP endpoint. Hub UI providers are replaceable (`@devframes/hub-ui` is the reference).
