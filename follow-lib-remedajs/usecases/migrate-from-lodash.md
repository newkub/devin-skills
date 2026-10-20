# Use Case — Migrate Lodash Calls to Remeda v2

> Swap utility imports without changing behaviour, using the v2 names that replaced the v1 and Lodash ones. Source: https://remedajs.com/migrate/v1/ (accessed 2026-10-20)

## 1. Map the names before touching code

| Before | After |
|--------|-------|
| `compact(list)` | `filter(list, isTruthy)` |
| `reject(list, fn)` | `filter(list, isNot(fn))` |
| `uniq` / `uniqBy` / `uniqWith` | `unique` / `uniqueBy` / `uniqueWith` |
| `toPairs` / `fromPairs` | `entries()` / `fromEntries` |
| `flatten` / `flattenDeep` | `flat` / `flat(Infinity)` |
| `maxBy` / `minBy` | `firstBy` / `nthBy` |
| `get(obj, "a.b")` | `prop(obj, "a", "b")` |
| `get(obj, "a.b", fallback)` | `defaultTo(prop(obj, "a", "b"), fallback)` |
| `debounce(fn, ms)` | `funnel(fn, { minQuietPeriodMs: ms })` |

## 2. Replace a Lodash chain with a pipe

```ts
// before
import { chain } from "lodash";
const names = chain(users).filter("active").map("name").uniq().value();

// after
import { pipe, filter, map, unique, prop } from "remeda";
const names = pipe(users, filter(prop("active")), map(prop("name")), unique());
```

## 3. Handle the two behaviour changes

```ts
// debounce → funnel: same intent, explicit mode
import { funnel } from "remeda";
const save = funnel(() => persist(draft), { minQuietPeriodMs: 500 });

// conditional now throws when nothing matches — always pass a fallback
import { conditional, constant } from "remeda";
const fee = conditional(
  order,
  [(o) => o.total > 100, () => 0],
  [(o) => o.vip, () => 5],
  constant(10),
);
```

`funnel` covers both debounce (`minQuietPeriodMs`) and throttle (`minGapMs`) — the intent is now in the option name rather than the helper name.

## 4. Verify the runtime behaviour, not just the types

```ts
import { expect, test } from "bun:test";
import { pipe, filter, isTruthy, unique } from "remeda";

test("compact + uniq behaves like the Lodash version", () => {
  const input = [0, 1, "", "a", null, undefined, "a"];
  expect(pipe(input, filter(isTruthy), unique())).toEqual([1, "a"]);
});
```

Porting a call site without a test is how `compact` quietly starts keeping `0` or dropping `false` in a different order.

## 5. Remove the dependency last

```sh
grep -rn "from \"lodash" src | wc -l   # expect 0
bun remove lodash @types/lodash
```

## Pitfalls

- `debounce` is deprecated in Remeda v2 — using it still works today but leaves a warning and will be removed.
- `pathOr` is gone; replacing it with `prop(...) ?? fallback` differs from `defaultTo` when the value is `null` but not `undefined`.
- `conditional` throws on no match, unlike Lodash's `cond` — a missing fallback turns a data case into a crash.
- `filter(isTruthy)` drops `0` and `""`, exactly like `compact` — do not use it for numeric arrays where zero is valid.
- Type-guards can be passed bare (`filter(isDefined)`), zero-arg helpers cannot (`entries()`).
- v2 needs TypeScript ≥5.1 and ES2022; compiling to an older target still "works" until the first tuple inference fails.

## Related

- `references/apis.md`
- `best-practices/remedajs.md`
- `usecases/data-pipeline-pipe.md`
