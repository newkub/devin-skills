# Use Case — Narrow Types With Guards Instead of Casts

> Remeda's type guards are predicates the compiler understands, so `filter(isDefined)` removes `undefined` from the element type and no `as` is needed anywhere in the chain. Source: https://remedajs.com/docs (accessed 2026-10-20)

## 1. Drop the holes once

```ts
import { filter, isDefined, isNonNullish, map, pipe } from "remeda";

const ids: (string | undefined)[] = rows.map((row) => row.userId);

const present: string[] = filter(ids, isDefined);
const strict: string[] = filter(ids as (string | null | undefined)[], isNonNullish);
```

`isDefined` removes only `undefined`; `isNonNullish` removes `null` and `undefined`. Both are headless — pass the guard itself, never `isDefined()`. After the call the element type is `string`, so `.map(id => id.trim())` type-checks without a non-null assertion.

## 2. Narrow a union with a predicate you write

```ts
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "submit"; formId: string }
  | { type: "unknown"; raw: string };

const isClick = (event: Event): event is Extract<Event, { type: "click" }> => event.type === "click";

const clicks = filter(events, isClick);
const totalX = map(clicks, (event) => event.x).reduce((a, b) => a + b, 0);
```

The predicate is the contract: the array type changes, not just the values. `filter` accepts it directly, and `partition` accepts the same shape when both halves are needed.

## 3. Validate unknown input by membership

```ts
import { isIncludedIn, isString } from "remeda";

const STATUSES = ["paid", "refunded", "pending"] as const;

const isStatus = (value: unknown) => isIncludedIn(value, STATUSES);

if (isStatus(payload.status)) {
  // payload.status is "paid" | "refunded" | "pending"
}
```

`isIncludedIn` returns a type predicate, so wrapping it in a small function gives a reusable guard with the literal union as its return type. Add `isString` first when the input may be a number — membership alone compares strictly and a numeric `1` will not match `"1"`.

## 4. Replace ternary chains with `when` and `conditional`

```ts
import { conditional, constant, isNumber, isString, when } from "remeda";

const label = when(raw, isString, (value) => value.trim().toLowerCase());

const formatted = conditional(
  value,
  [isString, (text) => text.trim()],
  [isNumber, (count) => count.toFixed(2)],
  constant("—"),
);
```

`when` narrows the value for `onTrue`. `conditional` takes predicate/handler pairs and a final fallback — and unlike Lodash, it throws when nothing matches, so `constant("—")` is not optional.

## 5. Prove a non-empty array before indexing

```ts
import { filter, hasAtLeast, isDefined, prop } from "remeda";

const emails = filter(users, (user) => user.optedIn).map(prop("email"));

if (hasAtLeast(emails, 1)) {
  const [first] = emails; // emails is a non-empty array here
  sendWelcome(first);
}
```

`hasAtLeast` narrows the array to a non-empty type, which is what lets destructuring return `string` instead of `string | undefined`. `first(emails)` does the same job when only the first element is needed.

## 6. Verify

1. `bun run typecheck` — no `as string`, no `!`, and no `@ts-expect-error` in the narrowed chain
2. Pass a list with `undefined` holes — the output array length equals the number of defined values
3. `isNonNullish` on `null` and `undefined` — both are removed; `isDefined` keeps `null` and narrows only `undefined`
4. A click event in the `filter` — inside the resulting array, `event.x` compiles without a cast
5. `isStatus("PAID")` — `false`; `isStatus("paid")` — `true`
6. `conditional` with a value that matches nothing — the fallback renders instead of throwing
7. `/run-test` — a type-level test with `expectTypeOf` for each narrowing

## Pitfalls

- Calling a headless guard (`isDefined()`) — it is already a function; invoking it passes `undefined` as the predicate result.
- Writing `(x) => isDefined(x)` inside `filter`, which loses the predicate type and leaves `(string | undefined)[]`.
- A predicate that lies (`event is ClickEvent` while returning true for submits), which moves the crash downstream.
- `isDefined` used where the data can also be `null` — use `isNonNullish`.
- `conditional` without a fallback case, which throws on the first unexpected value.
- `Number(payload.status)` before `isIncludedIn`, so the guard compares a number against string literals.
- Narrowing a property instead of the object (`payload.status is Status` used where `payload` should be narrowed), which does not help the rest of the code.

## Related

- `references/apis.md`
- `best-practices/remedajs.md`
- `usecases/data-pipeline-pipe.md`
- `usecases/group-aggregate-report.md`
