# Devframe Core Reference

> Source: <https://devfra.me/raw/guide.md>, <https://devfra.me/raw/guide/devframe-definition.md> (verified 2026-09-18)

## What It Is

Framework-neutral foundation for building a devtool once and running it everywhere — "unplugin for devtools". A devtool = anything that makes a program's implicit state visible and interactive (inspector, bundle analyzer, asset viewer, data explorer, terminal).

## DevframeDefinition

One `defineDevframe()` call returns a portable definition consumed by every adapter.

```ts
import { defineDevframe, defineRpcFunction } from 'devframe'

export default defineDevframe({
  id: 'my-tool',                  // kebab-case, unique per host
  name: 'My Tool',                // display label
  version: '1.0.0',
  packageName: 'my-tool',
  importMetaUrl: import.meta.url, // resolves clientAssets/services vs own deps
  homepage: 'https://github.com/me/my-tool',
  description: 'One-line summary.',
  icon: 'ph:gauge-duotone',       // Iconify
  clientAssets: 'client/dist',    // built SPA dir or { package, version }
  basePath: '/__my-tool/',        // optional override
  cli: { command: 'my-tool', port: 7777, open: true },
  setup(ctx) {
    const my = ctx.scope('my-tool')
    my.rpc.register(/* ... */)
  },
})
```

Required: `id`, `name`, `version`, `packageName`, `homepage`, `description`, `setup`. Pass `importMetaUrl` whenever assets/services resolve from the devframe's own dependency graph (pnpm strict safe).

## DevframeNodeContext (`setup(ctx)`)

| Member | Purpose |
|--------|---------|
| `cwd`, `workspaceRoot`, `mode` | `'dev'` watchers / `'build'` static-dump gating |
| `host` | `mountStatic`, `resolveOrigin`, `getStorageDir(scope)` |
| `rpc` | register, broadcast, sharedState, streaming, invokeLocal |
| `views` | `hostStatic` — programmatic static hosting |
| `diagnostics` | coded diagnostics over `nostics` |
| `agent` | expose tools/resources to coding agents |
| `services` | cross-devframe typed service registry |
| `staticConfig` | boot-time `ConnectionMeta.configs` (read-only at runtime) |
| `scope(id)` | namespaced view — preferred entry |

## Scoped Context

`ctx.scope('my-tool')` auto-prefixes every RPC id, shared-state key, streaming channel with `my-tool:` and adds a persisted `settings` store. Use it for all registrations.

## Storage Scopes

`ctx.host.getStorageDir(scope)`:

| Scope | Semantics |
|-------|-----------|
| `workspace` | committable, team-shared (saved presets, config) |
| `project` | per-checkout (caches, personal settings) |
| `global` | per-user, machine-wide (auth tokens) |

## Runtime Flags

```ts
setup(ctx) {
  if (ctx.mode === 'build') ctx.rpc.addFunctions(staticFunctions)
  else watchProject(ctx) // dev-only watchers
}
```

CLI dev server sets `mode: 'dev'`; `createBuild` sets `'build'`.

## Cross-Devframe Services

```ts
ctx.services.provide('my-plugin:sources', sources)
ctx.services.whenAvailable('my-plugin:sources', (s) => s.register(/* ... */))
```

Two tiers: in-process (`provide`/`get`, live objects) and wire services (also register RPC + advertise to RPC clients).

## Security Defaults

- Connections bind localhost; dev-mode RPC requires a trust handshake (OTP) before accepting a browser.
- CLI `open: true` embeds the current OTP so the opened tab lands authenticated.
- `auth: false` only for localhost-only, single-user tools.
- Transports: WebSocket + SSE fallback, identical birpc wire protocol.
