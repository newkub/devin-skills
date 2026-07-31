# Features

## Core Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| Effect | Effect computation ที่ type-safe | จัดการ async operations และ error handling |
| Layer | Dependency injection และ service composition | จัดการ dependencies และ mock สำหรับ testing |
| Ref | Mutable state ที่ thread-safe | State management ใน concurrent environments |
| Context | Type-safe dependency injection | ส่ง services ผ่าน environment |
| Scope | Resource management และ cleanup | จัดการ resources ที่ต้อง cleanup เช่น database connections |
| Stream | Lazy async sequences | จัดการ data streams และ infinite sequences |
| Channel | Producer-consumer pattern | สื่อสารระหว่าง concurrent processes |
| Fiber | Lightweight async tasks | Parallel execution และ cancellation |
| Schedule | Time-based operations | Retry logic และ recurring tasks |
| Queue | Async queue operations | Rate limiting และ backpressure |

## Layer

```typescript
import { Layer } from 'effect';

const databaseLayer = Layer.effect(DB, Effect.sync(() => new DB()));
```

## Effect

```typescript
import { Effect } from 'effect';

const program = Effect.succeed(42);
const mapped = Effect.map(program, (n) => n * 2);
```

## Ref

```typescript
import { Ref } from 'effect';

const ref = Ref.make(0);
const updated = Effect.flatMap(ref, (r) => r.set(r + 1));
```

## Context

```typescript
import { Context } from 'effect';

interface Logger {
  readonly log: (message: string) => Effect.Effect<void>;
}

const Logger = Context.GenericTag<Logger>('@services/Logger');

const loggerImpl = Layer.effect(Logger, Effect.succeed({
  log: (message) => Effect.sync(() => console.log(message)),
}));
```

## Stream

```typescript
import { Stream } from 'effect';

const stream = Stream.make(1, 2, 3);
const mapped = Stream.map(stream, (n) => n * 2);
```

## Channel

```typescript
import { Channel } from 'effect';

const channel = Channel.succeed(42);
```

## Fiber

```typescript
import { Fiber } from 'effect';

const fiber = Effect.runFork(program);
Effect.runPromise(Fiber.join(fiber));
```

## Error Handling

```typescript
import { Cause } from 'effect';

Effect.catchAll(program, (error) => Effect.succeed(defaultValue));
Effect.mapError(program, (error) => new CustomError(error));
```