# Use Case — Property Tests for Serializers and Sorters

> Replace a handful of example-based tests with one invariant that runs on a hundred generated inputs. Source: https://fast-check.dev (accessed 2026-10-20)

## 1. Install and integrate with the runner

```bash
bun add -D fast-check @fast-check/vitest
```

```ts
import { test } from "@fast-check/vitest"
import fc from "fast-check"
```

## 2. Encode/decode round trip

```ts
type Order = { id: string; total: number; tags: string[] }

const orderArb: fc.Arbitrary<Order> = fc.record({
  id: fc.uuid(),
  total: fc.double({ noNaN: true, min: 0 }),
  tags: fc.array(fc.string(), { maxLength: 5 }),
})

test.prop([orderArb])("decode(encode(order)) equals order", (order) => {
  expect(decode(encode(order))).toEqual(order)
})
```

The arbitrary describes the input space; the property asserts one rule for all of it.

## 3. Idempotence and ordering invariants

```ts
test.prop([fc.array(fc.integer())])("sort is idempotent", (xs) => {
  const once = sortNumbers(xs)
  expect(sortNumbers(once)).toEqual(once)
})

test.prop([fc.array(fc.integer())])("sort preserves the elements", (xs) => {
  expect(sortNumbers(xs)).toHaveLength(xs.length)
  expect([...sortNumbers(xs)].sort((a, b) => a - b)).toEqual(sortNumbers(xs))
})
```

## 4. Skip irrelevant inputs with preconditions

```ts
fc.assert(
  fc.property(fc.string(), fc.string(), (raw, separator) => {
    fc.pre(separator.length > 0)
    expect(splitJoin(raw, separator)).toBe(raw)
  }),
)
```

`fc.pre` discards the case instead of failing it, so a filter never masks a real bug as an exception.

## 5. Replay the shrunk counterexample

On failure fast-check prints a minimal input with `seed` and `path`. Reproduce with:

```ts
fc.assert(property, { seed: 1234567890, path: "0:1:2" })
```

Then write that concrete input as a normal unit test before fixing the bug, so the regression is locked in.

## Pitfalls

- Asserting an implementation detail instead of an invariant → the property breaks on every refactor; assert round-trip, idempotence, length, or ordering.
- Using `.filter()` for preconditions → failure rates hide bad generators; use `fc.pre`.
- Raising `numRuns` in the local loop → slow feedback; keep 100 locally, raise via `FAST_CHECK_NUM_RUNS` in CI.
- Leaving a failing seed unrecorded → the counterexample cannot be reproduced; commit the concrete unit test.

## Related

- `references/apis.md`
- `best-practices/fast-check.md`
- `usecases/race-and-model-based.md`
