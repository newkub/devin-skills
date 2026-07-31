# Key Concepts

## Core Concepts ของ Effect

Effect เป็น functional programming library ที่มี core concepts หลักดังนี้:

### 1. Effect

`Effect` คือ primitive หลักที่ represent การคำนวณที่อาจจะ fail และต้องการ environment

```typescript
import { Effect } from 'effect';

// Effect representing a successful computation
const success: Effect.Effect<string, never, never> = Effect.succeed('Hello');

// Effect representing a failed computation
const failure: Effect.Effect<never, Error, never> = Effect.fail(new Error('Oops'));

// Effect requiring some environment
const withEnv: Effect.Effect<string, never, { config: string }> = Effect.gen(
  function* () {
    const config = yield* Effect.service(Config); // ดึง config จาก environment
    return `Loaded: ${config}`;
  }
);
```

### 2. Layer

`Layer` ใช้สำหรับ define และ compose dependencies

```typescript
import { Effect, Layer } from 'effect';

// Define a service interface
interface DatabaseService {
  readonly query: (sql: string) => Effect.Effect<string, Error>;
}

// Create a tag for the service
const DatabaseService = Context.GenericTag<DatabaseService>('@services/Database');

// Create a live implementation
const databaseLayer = Layer.effect(
  DatabaseService,
  Effect.sync(() => ({
    query: (sql) => Effect.succeed(`Result: ${sql}`)
  }))
);

// Compose layers
const combinedLayer = Layer.provide(databaseLayer, otherLayer);
```

### 3. Context

`Context` ใช้สำหรับ dependency injection แบบ type-safe

```typescript
import { Effect, Context } from 'effect';

// Define service interface
interface Logger {
  readonly log: (message: string) => Effect.Effect<void>;
}

// Create a tag
const Logger = Context.GenericTag<Logger>('@services/Logger');

// Provide default implementation
const loggerImpl = Layer.succeed(Logger, {
  log: (message) => Effect.sync(() => console.log(message))
});
```

### 4. Scope

`Scope` ใช้สำหรับ manage resources ที่ต้อง cleanup

```typescript
import { Effect, Scope } from 'effect';

const withResource = Effect.gen(function* () {
  const scope = yield* Scope;
  
  // Acquire resource
  const connection = yield* acquireConnection;
  
  // Ensure cleanup
  yield* Scope.addFinalizer(() => Effect.sync(() => connection.close()));
  
  return connection;
});
```

## Key Operations

| Operation | Description |
|-----------|-------------|
| `Effect.succeed` | Create a successful effect |
| `Effect.fail` | Create a failed effect |
| `Effect.flatMap` | Chain effects together |
| `Effect.map` | Transform success value |
| `Effect.mapError` | Transform error |
| `Effect.gen` | Write effects using generator syntax |
| `Effect.provide` | Provide required services |

## Error Handling Pattern

```typescript
import { Effect, Cause } from 'effect';

const program = Effect.gen(function* () {
  const result = yield* riskyOperation;
  return result;
}).pipe(
  Effect.mapError((error) => new AppError(error.message)),
  Effect.catchAll((error) => Effect.succeed(fallbackValue))
);

// Run the program
Effect.runPromise(program).then(console.log);
```
