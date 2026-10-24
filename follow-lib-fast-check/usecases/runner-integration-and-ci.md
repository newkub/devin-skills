# Use Case — Runner Integration and CI

> Run properties through the same test runner as the unit tests, raise the run count in CI from your own environment knob, and replay a past failure with its seed and path. Source: https://fast-check.dev/docs/configuration/global-settings/ (accessed 2026-10-23)

## 1. Use the runner adapter, not a bare assert

```ts
// tests/money.prop.test.ts
import { test } from "@fast-check/vitest";
import fc from "fast-check";
import { expect } from "vitest";

test.prop([fc.integer(), fc.integer()])(
  "addition is commutative",
  (a, b) => {
    expect(a + b).toBe(b + a);
  },
);
```

The adapter registers a normal test that `vitest`/`jest` reports like any other. `test.prop` takes the arbitraries first and the predicate last, so the failure output shows the shrunk arguments inside the usual runner report. Keep one import for `test` in the file — a second `test` from the runner itself has no `.prop`.

Install the adapter that matches the runner:

```bash
bun add -D fast-check @fast-check/vitest
```

## 2. Set run counts in one place

```ts
// tests/setup/fast-check.ts
import fc from "fast-check";

fc.configureGlobal({
  numRuns: Number(process.env.PROPERTY_NUM_RUNS ?? 100),
  verbose: process.env.CI ? 2 : 0,
});
```

```ts
// vitest.config.ts
export default defineConfig({
  test: { setupFiles: ["tests/setup/fast-check.ts"] },
});
```

One global default keeps local runs fast and lets CI raise the count without touching test files. `PROPERTY_NUM_RUNS` is your own variable — fast-check reads no `FAST_CHECK_*` environment variable, so the setup file is the only bridge from the pipeline to `fc.configureGlobal`.

## 3. Raise the count in CI, keep the seed free

```yaml
- name: Test
  run: bun run test
  env:
    PROPERTY_NUM_RUNS: 1000
```

Do not pin a seed in the default job. A fixed `seed` makes every run explore the same path, which turns a property suite into one slow example. Pass `{ seed, path }` only in a replay job, copied from a failure log, and remove it once the regression test exists.

## 4. Guard against prototype pollution

```ts
import { test } from "@fast-check/poisoning";
import fc from "fast-check";

test.prop([fc.string(), fc.dictionary(fc.string(), fc.jsonValue())])(
  "reads survive polluted prototypes",
  (key, bag) => {
    expect(readBag(bag, key)).toBe(bag[key]);
  },
);
```

The `@fast-check/poisoning` helpers poison `Object.prototype`-style paths around each test and restore them afterwards. Run it in a dedicated suite, not against every test, and only where the code touches untrusted keyed data.

## 5. Keep the suite honest

```ts
test.prop([orderArb], { numRuns: 500 })("order total is finite", (order) => {
  expect(Number.isFinite(total(order))).toBe(true);
});
```

Per-test `numRuns` belongs on the tests that model size or arithmetic, where 100 samples rarely reach the interesting corners. Setting it on every property just makes the suite slower with no extra signal.

## 6. Verify

1. `/run-test` locally — properties appear as normal tests and the report names the shrunk arguments
2. Run once with `PROPERTY_NUM_RUNS=1000` — no new failure and an acceptable wall time
3. Replay a past failure with `{ seed, path }` in the failing test and confirm it fails identically
4. `/run-verify` — `fast-check` and the adapter are devDependencies only

## Pitfalls

- Installing `fast-check` in `dependencies`, so it ships to production bundles.
- Importing `test` from both the runner and the adapter in one file, so `.prop` is undefined.
- Raising `numRuns` only on a developer machine, leaving CI at the default 100.
- Setting a fixed `seed` on the default CI job, which stops the suite from exploring.
- Assuming fast-check reads `FAST_CHECK_*` variables — nothing in the library reads the environment, so an unforwarded variable silently does nothing.
- Turning on `@fast-check/poisoning` for the whole suite, where unrelated tests start failing on polluted globals.

## Related

- `references/apis.md`
- `best-practices/fast-check.md`
- `usecases/property-test-invariants.md`
- `usecases/custom-arbitraries-and-preconditions.md`
- `usecases/shrink-replay-and-regression.md`
