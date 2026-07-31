# Integration

## Framework Integration

### Express.js

```typescript
import { Effect, Layer } from 'effect';
import express from 'express';

const app = express();

// Effect handler for Express
const handleRequest = (req: express.Request, res: express.Response) => Effect.gen(function* () {
  const result = yield* processRequest(req.params.id);
  res.json(result);
});

// Convert Effect to Express handler
const toHandler = (effect: Effect.Effect<A, E, R>) => 
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Effect.runPromise(effect.pipe(
      Effect.catchAll(error => {
        next(error);
        return Effect.never;
      })
    ));

app.get('/users/:id', toHandler(handleRequest));
```

### Fastify

```typescript
import { Effect } from 'effect';
import fastify from 'fastify';

const server = fastify();

server.get('/users/:id', async (request, reply) => {
  const result = await Effect.runPromise(
    getUser(request.params.id).pipe(
      Effect.mapError(error => ({ status: 404, message: error.message }))
    )
  );
  return result;
});
```

### Hono

```typescript
import { Hono } from 'hono';
import { Effect } from 'effect';

const app = new Hono();

app.get('/users/:id', async (c) => {
  const user = await Effect.runPromise(getUser(c.req.param('id')));
  return c.json(user);
});
```

## Database Integration

### Drizzle ORM

```typescript
import { Effect, Layer, Context } from 'effect';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

interface Database {
  readonly query: <T>(query: ReturnType<typeof sql>`${string}`) => Effect.Effect<T, Error>;
}

const Database = Context.GenericTag<Database>('@services/Database');

const databaseLayer = Layer.effect(Database, Effect.sync(() => {
  const db = drizzle(process.env.DATABASE_URL);
  return {
    query: <T>(q: any) => Effect.tryPromise({
      try: () => db.execute(q) as Promise<T>,
      catch: (error) => new DatabaseError(error)
    })
  };
}));
```

### Prisma

```typescript
import { Effect, Layer, Context } from 'effect';
import { PrismaClient } from '@prisma/client';

interface Database {
  readonly prisma: PrismaClient;
}

const Database = Context.GenericTag<Database>('@services/Database');

const databaseLayer = Layer.effect(Database, Effect.sync(() => {
  const prisma = new PrismaClient();
  return { prisma };
}));
```

## Testing Integration

### Vitest

```typescript
import { Effect, Layer } from 'effect';
import { describe, it, expect } from 'vitest';

describe('User Service', () => {
  it('should fetch user by id', () => {
    const mockLogger = Layer.succeed(Logger, {
      log: (msg) => Effect.sync(() => {})
    });

    const program = getUser(1).pipe(
      Effect.provide(mockLogger),
      Effect.provide(databaseLayer)
    );

    const result = Effect.runSync(program);
    expect(result.name).toBe('John');
  });
});
```

### Test Doubles

```typescript
// Mock service for testing
const mockUserService = Layer.succeed(UserService, {
  getUser: (id) => Effect.succeed({ id, name: 'Mock User' }),
  createUser: (data) => Effect.succeed({ id: 1, ...data })
});

// Stub for network calls
const stubHttpClient = Layer.effect(HttpClient, Effect.sync(() => ({
  get: (url) => Effect.succeed({ data: stubData }),
  post: (url, body) => Effect.succeed({ data: { id: 1 } })
})));
```

## Build Tools

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "biome check ."
  }
}
```