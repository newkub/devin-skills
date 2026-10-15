| key | value |
|---|---|
| install | `bun add elysia            # core framework (runtime dependency)` |
| package registry | https://www.npmjs.com/package/elysia |
| repository | https://github.com/elysiajs/elysia |
| docs | https://elysiajs.com |

| api | description | default | options |
|---|---|---|---|
| `new Elysia()` | Create an app instance | - | config object (`prefix`, `name`, etc.) |
| `.get()` / `.post()` / `.put()` / `.patch()` / `.delete()` | HTTP verb routes | - | path, handler, schema options |
| `.route(method, path, handler)` | Custom HTTP method | - | - |
| `.group(prefix, fn)` | Route grouping with a prefix | - | - |
| `.listen(port)` | Start the server via `Bun.serve` | - | port/hostname |
| `.use(plugin)` | Register plugin/instance | - | - |
| `.decorate(name, value)` | Inject a property into the context | - | - |
| `.state(name, value)` | Inject mutable state | - | - |
| `.derive(fn)` / `.resolve(fn)` | Derive context values | - | - |
| `.guard(schema)` / `.scope()` | Scoped validation / merge control | - | - |
| `.model(name, schema)` | Reusable named schemas | - | - |
| `.onRequest` … `.onAfterResponse` | Lifecycle hooks | - | - |
| `context.status(code, value)` | Type-safe status codes (v1.4) | - | - |
| `t` (`Elysia.t`) | TypeBox schema builder | - | `t.Object`, `t.Number`, etc. |
| `treaty<App>(url)` (`@elysia/eden`) | Type-safe client | - | `{ data, error }` returns |
| `openapi()` (`@elysia/openapi`) | OpenAPI docs UI | - | `fromTypes()` for TS types |
