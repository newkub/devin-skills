| key | value |
|---|---|
| install | `bun add elysia            # core framework (runtime dependency)` |
| package registry | https://www.npmjs.com/package/elysia |
| repository | https://github.com/elysiajs/elysia |
| docs | https://elysiajs.com |

| api | description | default | options |
|---|---|---|---|
| `new Elysia()` | สร้าง app instance | - | config object (`prefix`, `name`, ฯลฯ) |
| `.get()` / `.post()` / `.put()` / `.patch()` / `.delete()` | HTTP verb routes | - | path, handler, schema options |
| `.route(method, path, handler)` | Custom HTTP method | - | - |
| `.group(prefix, fn)` | Route grouping พร้อม prefix | - | - |
| `.listen(port)` | Start server ผ่าน `Bun.serve` | - | port/hostname |
| `.use(plugin)` | Register plugin/instance | - | - |
| `.decorate(name, value)` | Inject property เข้า context | - | - |
| `.state(name, value)` | Inject mutable state | - | - |
| `.derive(fn)` / `.resolve(fn)` | Derive context values | - | - |
| `.guard(schema)` / `.scope()` | Scoped validation / merge control | - | - |
| `.model(name, schema)` | Reusable named schemas | - | - |
| `.onRequest` … `.onAfterResponse` | Lifecycle hooks | - | - |
| `context.status(code, value)` | Type-safe status codes (v1.4) | - | - |
| `t` (`Elysia.t`) | TypeBox schema builder | - | `t.Object`, `t.Number`, ฯลฯ |
| `treaty<App>(url)` (`@elysia/eden`) | Type-safe client | - | `{ data, error }` returns |
| `openapi()` (`@elysia/openapi`) | OpenAPI docs UI | - | `fromTypes()` สำหรับ TS types |
