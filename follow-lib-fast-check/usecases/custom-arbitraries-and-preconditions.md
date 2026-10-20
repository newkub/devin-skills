# Use Case — Custom Arbitraries and Preconditions

> Model a domain object once as an arbitrary so every property reuses it, and state preconditions with `fc.pre` instead of hand-narrowing generators. Source: https://fast-check.dev/docs/core-blocks/arbitraries/ (accessed 2026-10-20)

## 1. Derive the arbitrary from the domain type

```ts
import fc from "fast-check";

export type Money = { amountCents: number; currency: "THB" | "USD" };

export const moneyArb: fc.Arbitrary<Money> = fc.record({
  amountCents: fc.integer({ min: 0, max: 10_000_000 }),
  currency: fc.constantFrom("THB", "USD"),
});
```

`fc.record` keeps the key names and gives each field its own arbitrary. `fc.constantFrom` picks from a literal list, so the field stays a union instead of widening to `string` and forcing a cast in the property.

## 2. Compose instead of generating by hand

```ts
const lineArb = fc.record({
  sku: fc.stringMatching(/^[A-Z]{3}-\d{4}$/),
  unit: moneyArb,
  qty: fc.integer({ min: 1, max: 99 }),
});

export const orderArb = fc.record({
  id: fc.uuid(),
  lines: fc.array(lineArb, { minLength: 1, maxLength: 10 }),
  discount: fc.option(fc.double({ min: 0, max: 1, noNaN: true }), {
    nil: undefined,
  }),
});
```

`fc.stringMatching` pins the format at generation time; the alternative — generate any string and reject it inside the property — spends most runs on inputs that can never be valid. `fc.option(..., { nil: undefined })` keeps the optional field aligned with the type the app actually handles, not `null`.

`.map()` transforms a value, `.chain()` makes the next arbitrary depend on the previous one:

```ts
const dateRangeArb = fc
  .date({ min: new Date("2020-01-01"), max: new Date("2030-01-01") })
  .chain((from) =>
    fc.record({
      from: fc.constant(from),
      to: fc.date({
        min: from,
        max: new Date(from.getTime() + 86_400_000),
      }),
    }),
  );
```

## 3. Skip irrelevant inputs with fc.pre

```ts
import assert from "node:assert/strict";

fc.assert(
  fc.property(orderArb, (order) => {
    fc.pre(order.lines.length > 1);

    const head = order.lines[0];
    const rest = { ...order, lines: order.lines.slice(1) };

    assert.equal(total(order), subtotal([head], order) + subtotal(rest.lines, rest));
  }),
);
```

`fc.pre` discards the run and reports it as filtered, so a precondition that almost never holds shows up as "too many skipped runs" instead of a quiet green suite. `.filter()` on the arbitrary hides that signal and also slows shrinking, because discarded values still come from the same generator.

## 4. Measure the input distribution

```ts
const report = fc.statistics(
  fc.property(orderArb, (order) => order.lines.length > 1),
  (multiLine) => (multiLine ? "multi-line" : "single-line"),
  { numRuns: 1000 },
);

console.log(report);            // percentage per label
console.log(fc.sample(orderArb, 3)); // eyeball actual values
```

A property that only ever sees single-line orders proves nothing about the multi-line branch. `fc.statistics` makes that visible; `fc.sample` shows whether the generated values look like data you would accept in production.

## 5. Verify

1. `/run-test` — the property passes and the run is not mostly filtered (precondition skips stay low)
2. `fc.sample(orderArb, 3)` prints shapes you would accept in production
3. One run at `{ numRuns: 1000 }` finds no new counterexample
4. `/run-verify` — `fc.constantFrom` kept the union narrow, no `string` cast needed

## Pitfalls

- Generating `fc.string()` for an ID and validating the format inside the property, so failures shrink to noise.
- `.filter()` on a narrow subset, so most generated values are thrown away and the suite times out.
- Rebuilding the `Money`/`Order` shape inline in five test files instead of exporting one shared arbitrary.
- `fc.option()` defaulting to `null` while the application type says `undefined`.
- Never running `fc.sample` — a generator that produces impossible inputs passes for weeks and proves nothing.

## Related

- `references/apis.md`
- `best-practices/fast-check.md`
- `usecases/property-test-invariants.md`
- `usecases/shrink-replay-and-regression.md`
- `usecases/runner-integration-and-ci.md`
