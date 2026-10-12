---
name: follow-lib-orpc-serve-openapi
description: oRPC serving + OpenAPI — RPCHandler/OpenAPIHandler, framework adapters, docs, spec generation
argument-hint: "[adapter]"
related:
  - follow-lib-orpc
  - run-dev
  - run-build
  - resolve-errors
---

## Goal

Serve oRPC routers — `RPCHandler`/`OpenAPIHandler`, framework adapters (fetch/Bun/Hono/Elysia/Next), OpenAPI spec + docs UI

## Scope

server exposure — handler adapters, CORS, OpenAPI spec generation (`OpenAPIGenerator`), API docs (Scalar/SwaggerUI), serverless/edge deploys; procedure impl → `define-procedures`

## Execute

### 1. Handlers And Adapters

```ts
import { RPCHandler } from '@orpc/server/fetch'
import { OpenAPIHandler } from '@orpc/openapi/fetch'

const rpcHandler = new RPCHandler(router)
const apiHandler = new OpenAPIHandler(router)

// Bun/fetch adapter
Bun.serve({
  fetch: async (req) => {
    const { matched, response } = await rpcHandler.handle(req, { prefix: '/rpc' })
    if (matched) return response
    return apiHandler.handle(req, { prefix: '/api' }).then(r => r.matched ? r.response : new Response('not found', { status: 404 }))
  },
})
```

- `RPCHandler` — protocol endpoint (`/rpc/*`); `OpenAPIHandler` — REST endpoints จาก `.route()` metadata
- Adapters: fetch (Bun/Deno/CF workers), Node http, Hono, Elysia, Next.js, Express, Fastify — pick per host
- `context` passed ที่ handle-time: `{ context: buildContext(req) }` — per-request context factory

### 2. CORS And Middleware Bridge

- `CORSPlugin` — `new RPCHandler(router, { plugins: [new CORSPlugin()] })`
- Request headers → context factory (`createContext({ headers })`) — auth/session extraction ตรงนี้

### 3. OpenAPI Spec + Docs

```ts
import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'  // converter per schema lib

const generator = new OpenAPIGenerator({ schemaConverters: [new ZodToJsonSchemaConverter()] })
const spec = await generator.generate(contract, { info: { title, version } })
```

- Serve spec at `/spec.json` + docs UI (Scalar preferred — `GET /api` returns Scalar UI)
- Contract `.route()` metadata → real REST paths in spec; `tags`/`summary` via `.meta()`

### 4. Deploy Notes

- Edge/serverless OK (fetch adapter); Bun/Node canonical dev path
- SSE/event iterators ต้อง connection-per-client infra (Workers durable, Node streams)
- Same router serve RPC + REST พร้อมกัน — dual handler pattern above

## Rules

- Dual handlers เมื่อต้องการทั้ง RPC client + public REST — `.route()` metadata ครบเท่านั้น
- Context factory per-request — ห้าม share mutable context ข้าม requests
- Schema converters ต้องตรง lib ที่ใช้ (`ZodToJsonSchemaConverter` v3/v4 variant, `ValibotToJsonSchemaConverter`)
- `prefix` routes ชัดเจน (`/rpc`, `/api`) — ห้ามทับ static routes ของ host framework

## Expected Outcome

- Router served ผ่าน adapter ที่ตรง runtime
- OpenAPI spec + docs UI เปิดใช้, CORS ตาม policy
