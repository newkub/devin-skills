# Architecture

## Core Architecture

Effect ใช้ functional programming architecture:
- **Effect System** - manage side effects ด้วย effects
- **Type-safe** - TypeScript support ครบถ้วน
- **Composable** - compose effects ได้
- **Immutable** - immutable data structures

## Architecture Layers

```text
┌─────────────────────────────────────┐
│         Application Layer          │
│  (Business Logic & Effects)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer               │
│  (Dependency Injection & Context)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Runtime Layer               │
│  (Effect Execution & Fiber Mgmt)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Error Layer                 │
│  (Error Handling & Recovery)        │
└─────────────────────────────────────┘
```

## Component Overview

| Layer | Responsibility | Key Types |
|-------|---------------|-----------|
| Effect Layer | Define computations | `Effect<E, A, R>` |
| Service Layer | Provide dependencies | `Layer<R, E, A>` |
| Runtime Layer | Execute effects | `Runtime<R>` |
| Error Layer | Handle failures | `Cause<E>` |

## Data Flow

```typescript
// 1. Define effect with requirements
const program: Effect.Effect<string, Error, Database> = Effect.gen(function* () {
  const db = yield* Effect.service(Database);
  return yield* db.query('SELECT * FROM users');
});

// 2. Provide services via layers
const databaseLayer = Layer.effect(Database, createDatabase);

// 3. Run with runtime
Effect.runPromise(program.pipe(Effect.provide(databaseLayer)));
```
