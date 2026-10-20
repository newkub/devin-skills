# Use Case — Shrink, Replay, and Regression

> Turn a failing property into a minimal counterexample you can replay exactly, then into a unit test that stays in the suite. Source: https://fast-check.dev/docs/configuration/ (accessed 2026-10-20)

## 1. Read the failure report

A failed run ends with a report shaped like this:

```text
Property failed after 3 tests
{ seed: 1234567890, path: "1:0:2", endOnFailure: true }
Counterexample: [{"id":"0f8f...","lines":[]}]
Shrunk 7 time(s)
Got error: Expected total to be 0, got NaN
```

Three fields matter: the `seed` names the run, the `path` names the exact value inside that run, and the counterexample is the shrunk, minimal input. Copy all three — a seed alone is not a reproduction.

## 2. Replay exactly

```ts
import fc from "fast-check";

await fc.assert(fc.property(orderArb, totalIsFinite), {
  seed: 1234567890,
  path: "1:0:2",
  endOnFailure: true,
});
```

`endOnFailure: true` stops at the first failure instead of continuing to look for others, which keeps the replay fast and the output identical. Passing the `path` is what pins the specific value; without it the seed reproduces the run, not the counterexample.

In CI, replay through the environment variable instead of editing the test:

```bash
FAST_CHECK_SEED=1234567890 bun run test
```

## 3. Force a known input while fixing

```ts
await fc.assert(fc.property(orderArb, totalIsFinite), {
  examples: [[{ id: "0f8f...", lines: [], discount: undefined }]],
});
```

`examples` injects a literal value before the generated runs, so the fix can be checked in seconds while the real generator keeps exploring. Keep `examples` in the test afterwards — it documents the bug permanently.

## 4. Promote the counterexample to a unit test

```ts
import { expect, it } from "vitest";

it("total is 0 for an order with no lines", () => {
  const order = { id: "0f8f...", lines: [], discount: undefined };

  expect(total(order)).toBe(0);
});
```

The property stays as the general check; the unit test names the specific case, runs in milliseconds, and fails with a readable diff when someone reintroduces it. Deleting the property after the fix removes the only thing that could find the next variant.

## 5. Bound a slow investigation

```ts
await fc.assert(fc.property(orderArb, totalIsFinite), {
  numRuns: 500,
  interruptAfterTimeLimit: 5_000,
  markInterruptAsFailure: false,
});
```

`interruptAfterTimeLimit` keeps a pathological generator from hanging a watch-mode run, and `markInterruptAsFailure: false` reports it as an interruption rather than a fake bug. Remove both once the generator is fixed — a silently interrupted property is not a passing one.

## 6. Verify

1. The replay with `seed` and `path` fails the same way before the fix and passes after
2. The new unit test fails if the fix is reverted (`git stash` the change once to confirm)
3. `/run-test` — the property and the unit test both pass in the normal suite
4. `/run-verify` — no leftover debug `console.log` or temporary `numRuns`

## Pitfalls

- Copying only the seed, then "reproducing" a different failure with a different path.
- Fixing the code and deleting the property, so the same class of bug returns unnoticed.
- Committing the seed and no regression test — the suite has to rediscover the case on every run.
- Pinning one seed in `fc.configureGlobal` for all environments, so CI never explores new inputs.
- Leaving `interruptAfterTimeLimit` in place permanently and calling a partial run green.

## Related

- `references/apis.md`
- `best-practices/fast-check.md`
- `usecases/property-test-invariants.md`
- `usecases/custom-arbitraries-and-preconditions.md`
- `usecases/runner-integration-and-ci.md`
