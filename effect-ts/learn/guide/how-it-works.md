# How It Works

## Effect Runtime Architecture

Effect ใช้ runtime ที่ implement ด้วย Fiber สำหรับ concurrent execution:

```
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Effect.gen / Effect.pipeline               │
│                                                         │
│   ┌──────────────┐    ┌──────────────┐                 │
│   │ yield* op1   │───▶│ yield* op2   │                 │
│   └──────────────┘    └──────────────┘                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Runtime                              │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              Fiber Scheduler                     │   │
│   │                                                 │   │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐        │   │
│   │   │ Fiber 1 │  │ Fiber 2 │  │ Fiber 3 │        │   │
│   │   └─────────┘  └─────────┘  └─────────┘        │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              Cause Handler                       │   │
│   │     (Error, Interruption, Defect, Die)          │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Context (Dependency Injection)             │
│                                                         │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐         │
│   │  Logger   │  │Database   │  │   Config  │         │
│   └───────────┘  └───────────┘  └───────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Effect Type Signature

Effect มี 3 type parameters:

```typescript
Effect<Success, Error, Environment>
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `Success` | ชนิดของค่าที่ return เมื่อสำเร็จ | `string`, `User`, `number` |
| `Error` | ชนิดของ error ที่อาจเกิดขึ้น | `Error`, `HttpError` |
| `Environment` | dependencies ที่ต้องการ | `Logger`, `Database` |

## Creating Effects

```typescript
// Success value only (never = no errors, never = no env)
const success: Effect<string, never, never> = Effect.succeed('hello');

// Error only (no success value)
const failure: Effect<never, Error, never> = Effect.fail(new Error('oops'));

// Sync operation
const sync: Effect<number, never, never> = Effect.sync(() => 42);

// Async operation
const async: Effect<string, Error, never> = Effect.promise(() => 
  fetch('/api').then(r => r.text())
);
```

## Running Effects

| Function | Description |
|----------|-------------|
| `Effect.runPromise` | Run และ return Promise |
| `Effect.runSync` | Run synchronous effect |
| `Effect.runFork` | Fork เป็น Fiber |
| `Effect.runExit` | Run และ return Exit |

## Fiber Model

```
┌─────────────────────────────────────────────────────────┐
│                      Fiber                               │
│                                                         │
│   State: Running │ Suspended │ Suspended                 │
│                                                         │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐            │
│   │ Effect1 │───▶│ Effect2 │───▶│ Effect3 │            │
│   └─────────┘    └─────────┘    └─────────┘            │
│        │              │              │                  │
│        ▼              ▼              ▼                  │
│   ┌─────────────────────────────────────────┐         │
│   │                 Resume                    │         │
│   └─────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Layer Composition

Layers compose dependencies แบบ declarative:

```typescript
// Define services
const Database = Context.GenericTag<DatabaseService>('@services/Database');
const Logger = Context.GenericTag<LoggerService>('@services/Logger');

// Create layers
const databaseLayer = Layer.effect(Database, Effect.sync(() => createDb()));
const loggerLayer = Layer.provideServiceEffect(Logger, Effect.sync(() => createLogger()));

// Compose
const appLayer = Layer.merge(databaseLayer, loggerLayer);

// Provide to effect
const program = myEffect.pipe(Effect.provide(appLayer));
```

## Error Channel

Errors ใน Effect เป็น type-safe:

```typescript
// กำหนด error types
type AppError = DatabaseError | HttpError | ValidationError;

// Effect ที่มี typed errors
const program: Effect<User, AppError, Logger> = Effect.gen(function* () {
  const db = yield* Database;
  const user = yield* db.findUser(id);
  return user;
});
```

## Pipeline Pattern

ใช้ pipe เพื่อ compose operations:

```typescript
const program = Effect.succeed(42).pipe(
  Effect.map(x => x * 2),           // Transform success
  Effect.mapError(e => new AppError(e)), // Transform error
  Effect.tap(log),                  // Side effect without changing value
  Effect.flatMap(x => fetchUser(x)) // Chain with new effect
);
```