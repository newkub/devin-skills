# Lib Elysia API & Dependencies

## Install

```sh
bun add elysia            # core framework (runtime dependency)
bun add @elysia/eden      # type-safe client (optional)
bun add @elysia/openapi   # OpenAPI spec + docs UI (optional)
bun create elysia app     # scaffold new project
```

## Version

- Latest stable: `1.4.30` — v2.0.0-beta.14 ผ่าน `elysia@next` (verified 2026-09-13)
- [Package Registry](https://www.npmjs.com/package/elysia)
- [Repository](https://github.com/elysiajs/elysia)

## Dependencies

- ไม่มี peer dependencies — ต้องการ Bun runtime (รองรับ runtime อื่นผ่าน adapter)
- Validation ผ่าน `Elysia.t` (TypeBox built-in) หรือ Standard Schema libraries ที่ติดตั้งเอง

## Common API / Commands

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

## Source

- Official docs: https://elysiajs.com (LLM-friendly index: https://elysiajs.com/llms.txt)
- Description: Ergonomic Framework for Humans — Bun-first, end-to-end type safety.
