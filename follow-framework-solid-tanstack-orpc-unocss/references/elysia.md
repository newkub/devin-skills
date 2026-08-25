# Elysia (Bun-optimized Backend Framework)

## Source

- Quick Start: https://elysiajs.com/quick-start
- At a Glance: https://elysiajs.com/at-glance
- Homepage: https://elysiajs.com

## Version

- `elysia`: `1.4.29` (latest stable)
- Runtime: Bun (optimized) — also supports Node.js via `@elysia/node`

## Installation

### Auto Installation (Recommended)

```bash
bun create elysia app
cd app
bun dev
```

### Manual Installation

```bash
bun add elysia
bun add -d @types/bun
```

### Eden Treaty (Type-safe Client)

```bash
bun add @elysia/eden
```

## Basic Server

```ts
import { Elysia } from 'elysia'

new Elysia()
  .get('/', 'Hello Elysia')
  .get('/user/:id', ({ params: { id } }) => id)
  .post('/form', ({ body }) => body)
  .listen(3000)
```

Navigate to `http://localhost:3000` to see "Hello Elysia".

## `package.json` Scripts

```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "build": "bun build src/index.ts --target bun --outdir ./dist",
    "start": "NODE_ENV=production bun dist/index.js",
    "test": "bun test"
  }
}
```

Use `bun --hot` for hot reload during development.

## Lifecycle Hooks

```ts
import { Elysia } from 'elysia'

new Elysia()
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`)
  })
  .onError(({ code, error }) => {
    console.error(`Error [${code}]: ${error.message}`)
    return new Response('Internal Server Error', { status: 500 })
  })
  .get('/', () => 'Hello')
  .listen(3000)
```

## Mounting oRPC Handler

```ts
import { Elysia } from 'elysia'
import { RPCHandler } from '@orpc/server/fetch'

const rpcHandler = new RPCHandler(router)

new Elysia()
  .all('/rpc/*', async ({ request }) => {
    const { matched, response } = await rpcHandler.handle(request, {
      prefix: '/rpc',
      context: { headers: request.headers },
    })
    if (matched) return response
    return new Response('Not found', { status: 404 })
  })
  .listen(3000)
```

## Streaming and WebSocket

```ts
import { Elysia, file } from 'elysia'

new Elysia()
  .get('/stream', function* () {
    yield 'Hello'
    yield 'World'
  })
  .get('/image', file('mika.webp'))
  .ws('/realtime', {
    message(ws, message) {
      ws.send('got:' + message)
    }
  })
  .listen(3000)
```

## Eden Treaty (Type-safe Client)

```ts
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
  .get('/hello', () => 'Hello World')
  .listen(3000)

export type App = typeof app
```

```ts
// client.ts
import { treaty } from '@elysia/eden'
import type { App } from './server'

const app = treaty<App>('http://localhost:3000')

const { data, error } = await app.hello.get()
console.log(data) // "Hello World"
```

## Key Features

- Optimized for Bun runtime with static code analysis
- Type-safe end-to-end with Eden Treaty
- WinterTC compliant — deployable on Bun, Node.js, Deno, Cloudflare Workers
- Built-in validation with `t` object schema
- Lifecycle hooks: `onRequest`, `onParse`, `onTransform`, `onBeforeHandle`, `onAfterHandle`, `onError`, `onResponse`
- File serving with `file()`
- Streaming responses with generators
- WebSocket support with `.ws()`
