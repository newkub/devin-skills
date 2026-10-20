# Use Case — Morphs and Narrowing on the Way Out

> Turn validated strings into real domain values and add contextual constraints without duplicating the base schema. Source: https://arktype.io/docs/morphs (accessed 2026-10-20)

## 1. Parse into a domain value with `.pipe()`

```ts
import { type } from "arktype";

const IsoDate = type("string.date.iso").pipe((value) => new Date(value));
const Cents = type("string.integer").pipe((value) => Number(value));

export const Invoice = type({
  issuedAt: IsoDate,
  totalCents: Cents,
});
```

`.pipe()` runs only after the input passes the left side, so the transform can assume a well-formed string. The output type is what `.infer` reports — here `Date` and `number`, not `string`.

Keep the transform pure and total. A `.pipe()` that throws on an edge case turns a validation failure into a 500; put the constraint on the left side as a regex or `.narrow()` instead.

## 2. Add a rule without rewriting the base

```ts
const PositiveCents = Cents.narrow((n, ctx) => n > 0 || ctx.mustBe("greater than 0"));

const DateRange = type({
  from: IsoDate,
  to: IsoDate,
}).narrow(({ from, to }, ctx) => from <= to || ctx.mustBe("a range that ends after it starts"));
```

`.narrow()` changes the accepted set but not the inferred type. Use it for cross-field rules and bounds; use `.pipe()` only when the runtime value itself must change.

`ctx.mustBe()` produces a message anchored to the current path, so the error reads `to: a range that ends after it starts` instead of a generic failure.

## 3. Compose from the morphs

```ts
export const Receipt = type({
  id: "string.uuid",
  paidAt: IsoDate,
  amount: PositiveCents,
  refunds: type({ at: IsoDate, amount: PositiveCents }).array(),
});

const receipt = Receipt(input);
if (receipt instanceof type.errors) return badRequest(receipt.summary);
const newest = receipt.refunds.sort((a, b) => b.at.getTime() - a.at.getTime())[0];
```

Once validated, the nested values are `Date` and `number` at every depth — no re-parsing inside business logic, and no `new Date(string)` sprinkled through the codebase.

## 4. Verify

1. `/run-typecheck` — `receipt.paidAt` must be assignable to `Date`; a `string` assignment must fail
2. `/run-test` — `"2026-02-31"` is rejected by the left side, not by the pipe
3. `.pipe()` on optional fields — confirm the transform does not run for `undefined`
4. `/deep-test api` — an inverted range returns 422 with the message on `to`

## Pitfalls

- Doing validation inside `.pipe()`, which loses the path-aware error and reports a generic failure.
- Piping to a mutable object and sharing it across requests — the parsed value is per-call, but any cached instance is not.
- Re-parsing already-morphed output (`new Date(receipt.paidAt)`), which hides the fact that the schema already did the work.
- `.narrow()` after `.pipe()` when the rule is about the input; the constraint then checks the transformed value and reads incorrectly.

## Related

- `references/apis.md`
- `best-practices/arktype.md`
- `usecases/api-boundary-validation.md`
- `usecases/discriminated-union-narrowing.md`
