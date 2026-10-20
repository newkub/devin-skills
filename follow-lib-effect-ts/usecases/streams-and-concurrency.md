# Use Case — Streams and Bounded Concurrency

> Process an unbounded source with a concurrency cap, batch the writes, and keep resource use flat. Source: https://effect.website/docs/stream/introduction (accessed 2026-10-20)

## 1. Cap concurrency on a stream

```ts
import { Chunk, Effect, Stream } from "effect";

const fetchItem = (id: number) =>
  Effect.tryPromise(() => fetch(`/api/items/${id}`).then((r) => r.json()));

export const loadAll = (ids: ReadonlyArray<number>) =>
  Stream.fromIterable(ids).pipe(
    Stream.mapEffect(fetchItem, { concurrency: 5 }),
    Stream.tap((item) => Effect.logDebug("fetched", { id: item.id })),
    Stream.runCollect,
    Effect.map(Chunk.toReadonlyArray),
  );
```

`concurrency: 5` keeps at most five requests in flight. Unbounded concurrency (`{ concurrency: "unbounded" }`) turns a 10k-id import into 10k simultaneous connections — the most common way a stream job takes down the upstream.

`runCollect` materialises everything in memory; use `runDrain` or `runForEach` for results you are not returning.

## 2. Batch the writes

```ts
export const importItems = (ids: ReadonlyArray<number>) =>
  Stream.fromIterable(ids).pipe(
    Stream.grouped(50),
    Stream.mapEffect(
      (batch) => saveBatch(Chunk.toReadonlyArray(batch)),
      { concurrency: 2 },
    ),
    Stream.runDrain,
  );
```

`Stream.grouped(50)` yields `Chunk`s of at most fifty ids, so the downstream effect sees a constant batch size instead of one call per row. Two concurrent batches keep the database busy without a lock convoy.

## 3. Keep failures per item

```ts
export const resilient = (ids: ReadonlyArray<number>) =>
  Stream.fromIterable(ids).pipe(
    Stream.mapEffect(
      (id) =>
        fetchItem(id).pipe(
          Effect.either,
          Effect.map((result) => ({ id, result })),
        ),
      { concurrency: 5 },
    ),
    Stream.tap(({ id, result }) =>
      result._tag === "Left" ? Effect.logWarning("failed", { id }) : Effect.void,
    ),
    Stream.runDrain,
  );
```

`Effect.either` turns a failure into a value, so one bad id does not stop the stream. Without it, the first `Left` interrupts the whole pipeline and the remaining ids never run.

Use `Effect.all(items, { concurrency: n })` instead when the input is already an array and you need all results — it short-circuits on the first failure unless you wrap each element in `Effect.either`.

## 4. Verify

1. `/run-test` with a fake effect — at most five concurrent calls are observed
2. An id that always fails does not stop the other ids from completing
3. Memory stays flat on a 100k-id input (batched mode)
4. `Effect.withSpan` shows the stream span with the per-item children

## Pitfalls

- Leaving concurrency unbounded on a network stream, exhausting sockets or the upstream's rate limit.
- `runCollect` on an unbounded stream, which is an out-of-memory bug waiting for volume.
- Batching after the side effect instead of before it, so the database still sees one call per row.
- Catching errors outside the stream, losing the id that failed.
- Using `Stream` for a fixed ten-element array where `Effect.forEach` is simpler.

## Related

- `references/apis.md`
- `best-practices/effect.md`
- `usecases/typed-error-pipeline.md`
- `usecases/layer-composition-and-context.md`
