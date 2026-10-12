---
name: follow-lib-effect-ts-use-stream
description: Effect Stream — pull-based streams, sinks, channels, resource-safe processing, backpressure
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
---

## Goal

ใช้ `Stream` สำหรับ lazy/pull-based data processing — จาก collection/IO sources, transform, sink, resource-safe

## Scope

`Stream<A, E, R>` — streaming sources/transforms/sinks; backpressure built-in; ต่างจาก `Effect` (one-shot) ตรง emit หลายค่า lazily

## Execute

### 1. Create Streams

```ts
import { Stream } from "effect"

Stream.make(1, 2, 3)                  // values
Stream.fromIterable(list)             // collections
Stream.fromEffect(fetch())            // single effect
Stream.paginate(seed, fn)             // paginated APIs
Stream.fromReadableStream(() => rs, onError)  // Web streams interop
```

### 2. Transform

- `Stream.map`, `filter`, `mapEffect` (effectful element-wise), `filterMap`
- `Stream.mapConcat` (flatMap), `Stream.zip`, `merge`, `concat`
- `Stream.grouped`/`rechunk` — batch elements; `Stream.throttle`, `debounce`
- `Stream.take`/`takeWhile`/`drop`/`runHead` — bounded consumption

### 3. Consume With Sinks

```ts
Stream.runCollect(stream)             // Chunk<A>
Stream.runForEach(stream, fn)         // effectful per element
Stream.runDrain(stream)               // discard results, run effects
stream.pipe(Stream.toReadableStream)  // back to Web streams
```

- `Sink.fold`, `Sink.collectAll`, `Sink.forEach` — composable consumers
- `Channel` = lower-level pull/push primitive สำหรับ custom stream transforms

### 4. Resource Safety

- `Stream.unwrapScoped` / `Stream.acquireRelease` — resource per element/stream
- `Stream.run` ใน `Effect.scoped` — release guaranteed
- Error handling: `Stream.catchAll`, `catchTag`, `retry(Schedule)`

## Rules

- Stream = pull-based lazy — ไม่ run จนกว่าจะ consume (ต่างจาก `Effect.all` eager)
- Effectful per-element ops ใช้ `mapEffect`/`runForEach` — ไม่ใช่ collect แล้วค่อย forEach
- Bounded memory: ใช้ `grouped`/`buffer` capacity options — unbounded buffer = OOM
- Stream ที่มี resource (sockets, files) ต้อง acquireRelease/scoped

## Expected Outcome

- Streaming pipelines lazy + backpressured + resource-safe
- Interop กับ Web streams/iterables ถูกทิศทาง
