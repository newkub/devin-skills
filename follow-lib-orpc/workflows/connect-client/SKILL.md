---
name: follow-lib-orpc-connect-client
description: oRPC client — createRouterClient, RPCLink, fetch config, TanStack Query integration
argument-hint: "[transport]"
related:
  - follow-lib-orpc
  - follow-lib-tanstack-ecosystem
  - run-test
  - resolve-errors
---

## Goal

ตั้งค่า oRPC client — `createRouterClient`, link transports (RPC/OpenAPI), headers/context, TanStack Query hooks

## Scope

client-side — `@orpc/client` (`createORPCClient`/`createRouterClient`), `RPCLink`/`OpenAPILink`, `client` helpers, `@orpc/tanstack-query` (orpc-query utils); server impl → `define-procedures`

## Execute

### 1. Create Client

```ts
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { ContractRouterClient } from '@orpc/contract'

const link = new RPCLink({
  url: 'http://localhost:3000/rpc',
  headers: async () => ({ Authorization: `Bearer ${getToken()}` }),
})
export const client: ContractRouterClient<typeof contract> = createORPCClient(link)
```

- `RPCLink` — compact RPC protocol (POST, batching-friendly)
- `OpenAPILink` — REST-style calls (ต้อง `.route()` metadata ใน contract)
- `headers` async fn — auth tokens ต่อ request; `fetch` override สำหรับ custom transport

### 2. Call Procedures

```ts
const user = await client.getUser({ id })
// typed errors: try/catch → ORPCError with .code matching contract errors
```

- Client methods mirror router paths — `client.users.list(...)`, `client.admin.users.create(...)`
- `safe()` variant (v1+): `const [err, data] = await client.getUser.safe(input)` — no throw

### 3. TanStack Query Integration

```ts
import { createORPCReactQueryUtils } from '@orpc/tanstack-query'  // หรือ orpc helper ล่าสุด

const orpc = createORPCReactQueryUtils(client)
useQuery(orpc.getUser.queryOptions({ input: { id } }))
useMutation(orpc.createUser.mutationOptions())
```

- `@orpc/tanstack-query` — `queryOptions`/`mutationOptions`/`infiniteOptions` per proc
- `queryKey` deterministic จาก procedure path + input — `client.key()`/`orpc.key()` invalidation
- React/Vue/Solid variants available (`@orpc/react-query`, `@orpc/vue-query`, `@orpc/solid-query` legacy paths — เช็ค docs ล่าสุด)

### 4. Server-Side Client

- `createRouterClient(router)` — call router in-process (SSR/tests/edge) โดยไม่มี HTTP hop

## Rules

- Client type จาก contract: `ContractRouterClient<typeof contract>` — ห้าม `any`
- Auth headers ผ่าน `headers` async fn — ไม่ bake token ตอน create
- TanStack Query = canonical reactive layer — อย่า manual state wrap client calls
- `RPCLink` default; `OpenAPILink` เมื่อต้องการ REST-compat/debuggable URLs

## Expected Outcome

- Client typed E2E, auth header flow ถูก
- TanStack Query options generated ทุก proc
