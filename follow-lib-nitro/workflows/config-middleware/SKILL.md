---
name: follow-lib-nitro-config-middleware
description: Configure Nitro middleware/plugins/hooks — request pipeline, auth guards, event hooks
argument-hint: "[middleware|plugin|hook]"
related:
  - follow-lib-nitro
  - run-test
  - resolve-errors
  - learn-from-web
---

## Goal

Configure the Nitro request pipeline — middleware, plugins, nitroApp hooks for auth/logging/CORS/request lifecycle

## Scope

cross-cutting concerns on the server side — middleware (`middleware/`), plugins (`plugins/`), runtime hooks (`nitroApp.hooks()`)

Not covered: route handlers themselves (`workflows/config-routes` if present) and deploy — use `/follow-lib-nitro` for the rest

## Execute

### 1. Middleware

> Goal: run before every request — auth, logging, headers

```ts
// middleware/auth.ts — global middleware (auto-registered)
import { defineEventHandler, createError, getRequestHeader } from 'nitro/h3'

export default defineEventHandler((event) => {
  const token = getRequestHeader(event, 'authorization')
  if (!token && event.path.startsWith('/api/private')) {
    throw createError({ statusCode: 401 })
  }
  event.context.user = decodeToken(token)   // attach context for handlers
})
```

- Order = filename/`middleware/` registration — check execution order when there are several
- Scoped middleware: `middleware/` in subdirs or check `event.path` in the handler
- Pass data forward via `event.context.<key>`, read it in handlers with `event.context.<key>`
- Throw `createError({ statusCode })` to short-circuit — never return a bare string for errors

### 2. Plugins

> Goal: startup logic + app-level state, once per server instance

```ts
// plugins/db.ts — runs once at startup
import { defineNitroPlugin } from 'nitro/runtime'

export default defineNitroPlugin((nitroApp) => {
  const db = createDb(process.env.DATABASE_URL!)
  nitroApp.hooks.hook('close', async () => { await db.close() })
  ;(globalThis as any).__db = db
})
```

- Plugins run once when the server starts — never per request
- Use them for DB/redis clients, config validation, and registering hooks
- Close resources in the `close` hook so restarts and tests do not leak handles

### 3. Hooks

> Goal: observe/modify the request lifecycle without touching every handler

| Hook | When it runs | Typical use |
|------|--------------|-------------|
| `request` | before routing, per request | timing start, request id, early auth guard |
| `beforeResponse` | before the body is sent | add headers, normalize errors |
| `afterResponse` | after the response is sent | metrics, logging |
| `error` | when a handler throws | error logging/reporting |
| `close` | server shutdown | release clients/timers |

```ts
nitroApp.hooks.hook('request', (event) => {
  event.context.startedAt = Date.now()
})

nitroApp.hooks.hook('beforeResponse', (event) => {
  setResponseHeader(event, 'x-duration-ms', String(Date.now() - event.context.startedAt))
})
```

- Hooks are fire-and-forget — keep them fast and never block the response
- Prefer middleware for auth/short-circuit logic and hooks for observation
- Register hooks in a plugin or in `nitro.config.ts` `hooks` — not in a route handler

### 4. Config Wiring

> Goal: make registration explicit when the directory convention is not used

```ts
// nitro.config.ts
export default defineNitroConfig({
  middleware: ['middleware/auth.ts', 'middleware/cors.ts'],
  plugins: ['plugins/db.ts'],
  hooks: { close: () => console.log('nitro closed') },
})
```

- Directory convention (`middleware/`, `plugins/`) is enough — add explicit arrays only for ordering or non-standard paths
- The order of `middleware` in config overrides the filename order — keep auth last so it sees parsed context if other middleware sets it
- CORS handled in middleware must answer `OPTIONS` with 204 and the `Access-Control-*` headers

### 5. Verify

> Goal: confirm the pipeline behaves as configured

1. Call a protected route without a token → expect the thrown status code, not a 500
2. Call it with a token → expect `event.context.user` to reach the handler
3. Check the response headers added by `beforeResponse`
4. Do `/run-test` for the affected suites, `/run-verify` for lint/typecheck
5. If a hook or option is unclear → confirm against the current docs with `/learn-from-web` before shipping

## Rules

- Middleware order is behavior — document the intended order and verify it with a test
- Never do per-request work in a plugin and never hold request state in module scope (concurrency)
- Prefer `event.context` over globals for per-request data; reserve globals for startup singletons
- Every resource opened in a plugin gets a `close` hook
- No silent catch: log through the `error` hook and return the right status code
- Confirm hook names/options with `/learn-from-web` — Nitro evolves; do not guess

## Expected Outcome

- Middleware guards the intended routes and passes data via `event.context`
- Plugins initialize and dispose startup resources once per instance
- Hooks add the needed headers/metrics without blocking responses
- Order and behavior proven by a request test, lint/typecheck pass
