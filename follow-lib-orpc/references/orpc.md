# oRPC Reference

## Version Info

- Server Package: `@orpc/server` v1.14.1 (published May 4, 2026)
- Client Package: `@orpc/client` v1.14.0 (published Apr 22, 2026)
- Zod Adapter: `@orpc/zod` v1.14.2 (published May 6, 2026)
- TanStack Query: `@orpc/tanstack-query` (same version range)
- OpenAPI: `@orpc/openapi` (same version range)
- License: MIT
- Source: https://orpc.dev/docs/getting-started

## Install

```bash
# Core packages
bun add @orpc/server @orpc/client

# With Zod for schema validation
bun add zod

# TanStack Query integration (optional)
bun add @orpc/tanstack-query

# OpenAPI support (optional)
bun add @orpc/openapi
```

## Define Procedures and Router

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

// Procedure with optional fields
export const createPlanet = os
  .input(z.object({ name: z.string(), description: z.string().optional() }))
  .handler(async ({ input }) => {
    return { id: 3, ...input }
  })

// Router groups procedures into paths
export const router = {
  planet: {
    list: listPlanets,
    find: findPlanet,
    create: createPlanet,
  },
}

// Export type for client-side inference
export type Router = typeof router
```

## Create a Server (Node.js)

```ts
import { createServer } from 'node:http'
import { RPCHandler } from '@orpc/server/node'

const handler = new RPCHandler(router)

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, { prefix: '/rpc' })

  if (matched) {
    return
  }

  res.statusCode = 404
  res.end('Not found')
})

server.listen(3000, '127.0.0.1', () => console.log('Listening on 127.0.0.1:3000'))
```

## Create a Server (Fetch API — Bun, Deno, Cloudflare Workers)

```ts
import { RPCHandler } from '@orpc/server/fetch'

const handler = new RPCHandler(router)

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const { matched, response } = await handler.handle(req, {
      prefix: '/rpc',
      context: { headers: req.headers },
    })

    if (matched) {
      return response
    }

    return new Response('Not found', { status: 404 })
  },
})
```

## Create a Client

```ts
import type { RouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'

const link = new RPCLink({
  origin: 'http://127.0.0.1:3000',
  url: '/rpc', // must match server prefix
  headers: () => ({
    authorization: 'Bearer token',
  }),
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
```

## Call Procedures

```ts
// Call like local functions — fully typed
const planets = await orpc.planet.list()
const planet = await orpc.planet.find({ id: 1 })
const created = await orpc.planet.create({ name: 'Venus' })
```

## Error Handling

### Server-side — define typed errors

```ts
import { os } from '@orpc/server'
import * as z from 'zod'

export const findPlanet = os
  .errors({
    NOT_FOUND: { data: z.object({ id: z.number() }) },
  })
  .input(z.object({ id: z.number() }))
  .handler(async ({ input, errors }) => {
    const planet = await findInDb(input.id)
    if (!planet) {
      throw errors.NOT_FOUND({ data: { id: input.id } })
    }
    return planet
  })
```

### Client-side — use `safe()` instead of try/catch

```ts
import { safe, isDefinedError } from '@orpc/client'

const { data, error } = await safe(orpc.planet.find({ id: 999 }))

if (error && isDefinedError(error)) {
  // error is typed — narrow to NOT_FOUND etc.
  if (error.code === 'NOT_FOUND') {
    console.log(`Planet ${error.data.id} not found`)
  }
}
```

## Middleware

```ts
import { os } from '@orpc/server'

// Define middleware with context
const authMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ context, next }) => {
    const token = context.headers.get('authorization')
    if (!token) {
      throw new ORPCError('UNAUTHORIZED')
    }
    const user = await verifyToken(token)
    return next({ context: { user } })
  })

// Use in procedures
export const getProfile = os
  .use(authMiddleware)
  .handler(async ({ context }) => {
    return context.user
  })
```

## TanStack Query Integration

```ts
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { orpc } from './client'

const queryUtils = createTanstackQueryUtils(orpc)

// Use in components
queryUtils.planet.find.queryOptions({ input: { id: 1 } })
queryUtils.planet.create.mutationOptions()
```

## Sources

- Getting Started: https://orpc.dev/docs/getting-started
- Client-Side Clients: https://orpc.dev/docs/client/client-side
- Middleware: https://orpc.dev/docs/middleware
- Error Handling: https://orpc.dev/docs/error-handling
