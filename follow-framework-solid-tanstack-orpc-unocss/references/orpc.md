# oRPC (Type-safe API Layer)

## Source

- Official Docs: https://orpc.dev/docs/getting-started
- GitHub: https://github.com/unnoq/orpc
- npm: https://www.npmjs.com/package/@orpc/server

## Version

- `@orpc/server`: `1.14.1` (latest stable, May 2026)
- `@orpc/client`: `1.14.0` (latest stable, Apr 2026)
- Peer: `zod` for schema validation (also supports Valibot, ArkType, any Standard Schema library)

## Installation

```bash
# Server and client
npm install @orpc/server @orpc/client zod

# With bun
bun add @orpc/server @orpc/client zod

# Optional: TanStack Query integration
bun add @orpc/tanstack-query

# Optional: OpenAPI support
bun add @orpc/openapi
```

## Define a Router (Server)

```ts
import { os } from '@orpc/server'
import * as z from 'zod'

// Procedure without input
export const listPlanets = os
  .handler(async () => {
    return [
      { id: 1, name: 'Earth' },
      { id: 2, name: 'Mars' },
    ]
  })

// Procedure with input validation
export const findPlanet = os
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    return { id: input.id, name: 'Earth' }
  })

// Procedure with context and middleware
export const createPlanet = os
  .$context<{ headers: Headers }>()
  .use(({ context, next }) => {
    // Auth check
    return next({ context: { user: { id: 1 } } })
  })
  .input(z.object({ name: z.string(), description: z.string().optional() }))
  .handler(async ({ input }) => {
    return { id: 3, ...input }
  })

export const router = {
  planet: {
    list: listPlanets,
    find: findPlanet,
    create: createPlanet,
  },
}
```

## Create a Server (Node.js)

```ts
import { createServer } from 'node:http'
import { RPCHandler } from '@orpc/server/node'

const handler = new RPCHandler(router)

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, { prefix: '/rpc' })
  if (matched) return
  res.statusCode = 404
  res.end('Not found')
})

server.listen(3000, '127.0.0.1', () => console.log('Listening on 127.0.0.1:3000'))
```

oRPC supports Node.js, Bun, Deno, and Cloudflare Workers via Fetch API adapter.

## Create a Client

```ts
import type { RouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'

const link = new RPCLink({
  origin: 'http://127.0.0.1:3000',
  url: '/rpc', // must match server prefix
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
```

## Call Procedures

```ts
import { orpc } from './client'

const planets = await orpc.planet.list()
const planet = await orpc.planet.find({ id: 1 })
await orpc.planet.create({ name: 'Venus' })
```

Types flow end-to-end with no code generation. Invalid input is rejected before the handler runs.

## Error Handling

```ts
import { ORPCError } from '@orpc/server'

// Throw typed errors in middleware/handlers
throw new ORPCError('UNAUTHORIZED')

// With data
throw new ORPCError('NOT_FOUND', { data: { resourceId: input.id } })

// Define custom errors
const os = initORPC({
  errors: {
    INVALID_CREDENTIALS: { data: z.object({ message: z.string() }) },
  },
})
```

Common error codes available without schema: `UNAUTHORIZED`, `NOT_FOUND`, `FORBIDDEN`, etc.

## Context and Middleware

```ts
// Initial context
const os = initORPC().$context<{ headers: Headers }>()

// Middleware injects execution context
const authMiddleware = os
  .use(({ context, next }) => {
    const user = parseAuth(context.headers)
    if (!user) throw new ORPCError('UNAUTHORIZED')
    return next({ context: { user } })
  })
```

## Key Concepts

- `RouterClient<typeof router>`: Export this type from server for client-side type inference
- `safe()`: Use instead of try/catch in client code for typed error handling
- `isDefinedError(error)`: Narrow typed errors on client
- `createSafeClient`: Get `safe()` on every procedure
- `createTanstackQueryUtils`: Integrate with TanStack Query
