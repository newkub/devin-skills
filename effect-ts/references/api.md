# API Reference

## Core Modules

### Effect

The main module for creating and manipulating effects.

```typescript
import { Effect } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `succeed` | `(value: A) => Effect<A, never, never>` | Create successful effect |
| `fail` | `(error: E) => Effect<never, E, never>` | Create failed effect |
| `sync` | `(evaluate: () => A) => Effect<A>` | Create synchronous effect |
| `promise` | `(promise: () => Promise<A>) => Effect<A, Error>` | Create from Promise |
| `try` | `({ try, catch }) => Effect<A, E>` | Try/catch wrapper |
| `tryPromise` | `({ try, catch }) => Effect<A, E>` | Promise try/catch |
| `gen` | `(generator) => Effect<A, E, R>` | Generator syntax |
| `map` | `(effect, f) => Effect<B>` | Transform success |
| `flatMap` | `(effect, f) => Effect<B, E2>` | Chain effects |
| `mapError` | `(effect, f) => Effect<A, B>` | Transform error |
| `tap` | `(effect, f) => Effect<A, E>` | Side effect |
| `catchAll` | `(effect, f) => Effect<A, never>` | Catch all errors |
| `catchSome` | `(effect, f) => Effect<A, E>` | Catch specific errors |
| `pipe` | `(effect, ...ops) => Effect` | Compose operations |
| `provide` | `(effect, layer) => Effect` | Provide services |
| `runPromise` | `(effect) => Promise<A>` | Run as Promise |
| `runSync` | `(effect) => A` | Run synchronously |
| `runFork` | `(effect) => Fiber` | Fork to Fiber |
| `runExit` | `(effect) => Exit<A, E>` | Run with Exit |

### Layer

Module for dependency management.

```typescript
import { Layer } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `succeed` | `(tag, service) => Layer` | Create from service |
| `effect` | `(tag, effect) => Layer` | Create from effect |
| `merge` | `(layer1, layer2) => Layer` | Merge layers |
| `provide` | `(layer, other) => Layer` | Provide dependency |
| `fresh` | `(layer) => Layer` | Create fresh layer |
| `lazy` | `(evaluate) => Layer` | Lazy evaluation |
| `scoped` | `(effect) => Layer` | Scoped effect |
| `empty` | `() => Layer` | Empty layer |

### Context

Module for service tags and dependency injection.

```typescript
import { Context } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `GenericTag` | `(name) => Tag<A>` | Create generic tag |
| `Tag` | `() => Tag<A>` | Create empty tag |
| `get` | `(context, tag) => A` | Get service from context |
| `add` | `(context, tag, value) => Context` | Add service |
| `merge` | `(ctx1, ctx2) => Context` | Merge contexts |

### Stream

Module for reactive streaming.

```typescript
import { Stream } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `make` | `(...values) => Stream` | Create stream |
| `fromIterable` | `(iterable) => Stream` | From iterable |
| `map` | `(stream, f) => Stream` | Transform values |
| `flatMap` | `(stream, f) => Stream` | Chain streams |
| `filter` | `(stream, f) => Stream` | Filter values |
| `runCollect` | `(stream) => Effect<Array>` | Collect all |

### Channel

Module for bidirectional communication.

```typescript
import { Channel } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `succeed` | `(value) => Channel` | Successful channel |
| `fail` | `(error) => Channel` | Failed channel |
| `map` | `(channel, f) => Channel` | Transform value |
| `flatMap` | `(channel, f) => Channel` | Chain channels |

### Fiber

Module for fiber-based concurrency.

```typescript
import { Fiber } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `join` | `(fiber) => Effect<A, E>` | Wait for fiber |
| `interrupt` | `(fiber) => Effect<void>` | Interrupt fiber |
| `map` | `(fiber, f) => Fiber` | Transform result |
| `timeout` | `(fiber, duration) => Effect` | Add timeout |

### Ref

Module for mutable state.

```typescript
import { Ref } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `make` | `(value) => Ref<A>` | Create ref |
| `get` | `(ref) => Effect<A>` | Get value |
| `set` | `(ref, value) => Effect<void>` | Set value |
| `update` | `(ref, f) => Effect<A>` | Update value |

### Scope

Module for resource management.

```typescript
import { Scope } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `make` | `() => Effect<Scope>` | Create scope |
| `addFinalizer` | `(scope, finalizer) => Effect` | Add cleanup |
| `close` | `(scope, exit) => Effect<void>` | Close scope |

### Cause

Module for error cause tracking.

```typescript
import { Cause } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `fail` | `(error) => Cause` | Failure cause |
| `die` | `(defect) => Cause` | Defect cause |
| `interrupt` | `(fiberId) => Cause` | Interruption cause |
| `isFailure` | `(cause) => boolean` | Check failure |
| `isDie` | `(cause) => boolean` | Check defect |
| `isInterrupt` | `(cause) => boolean` | Check interrupt |
| `prettyPrint` | `(cause) => string` | Format cause |

### Exit

Module for execution results.

```typescript
import { Exit } from 'effect';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `succeed` | `(value) => Exit` | Success exit |
| `fail` | `(error) => Exit` | Failure exit |
| `isSuccess` | `(exit) => boolean` | Check success |
| `isFailure` | `(exit) => boolean` | Check failure |
| `map` | `(exit, f) => Exit` | Transform value |
| `flatMap` | `(exit, f) => Exit` | Chain exit |