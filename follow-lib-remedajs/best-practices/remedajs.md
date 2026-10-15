# Remeda — Best Practices

Type-safe functional utilities — data-first/data-last dual signatures, lazy `pipe`, and compile-time narrowing

## Recommended Patterns

- Always data-first for a single call (`filter(users, pred)`) — gets IDE autocomplete + readable; data-last only inside `pipe` or when passed as a callback
- Compose as `pipe(data, ...)` when there are 2+ transforms — readable top-to-bottom and gets lazy fusion automatically
- Keep lazy functions consecutive (`map` → `filter` → `take`) for early termination on large arrays — don't insert `sortBy`/`groupBy` (non-lazy) between lazy runs
- Use `prop("a")`/`identity()` projections instead of inline lambdas in `sortBy`/`firstBy`/`groupByProp` — more accurate and shorter types
- Use `firstBy`/`nthBy`/`takeFirstBy` instead of `sortBy` + `first`/`take` when you only need top-k — O(n) instead of O(nlogn)
- Use type-guards (`isDefined`, `isNonNullish`, `isString`) in `filter`/`find` — narrows the type automatically, no cast needed
- `when`/`conditional` instead of ternary chains in a pipe — `conditional` must always have a fallback case (`constant(undefined)` or a callback)

## Common Pitfalls

- `entries`/`keys`/`values`/`identity`/`constant`/`toLowerCase` must be invoked with `()` to get the data-last form — bare `entries` is the function, not the result; except type-guards, which are headless
- `conditional` throws when no case matches — unlike Lodash/Ramda, which return `undefined`
- In a lazy pipe, the callback's 3rd param (source array) only sees items already processed — wrap `($) => map($, fn)` if you need the full array
- `piped(...)` cannot be used as a function factory — TS can't infer the input type; declare a wrapper function that calls `pipe` inside instead
- `purry` is not type-safe — use only inside wrappers with overload signatures; never export it directly
- `forEach` data-last returns the same input array (by reference) — not a copy
- `debounce` deprecated → `funnel`; `pathOr` deprecated → `defaultTo(prop(obj, ...path), fallback)`

## Migration Notes (v1 → v2, Lodash/Ramda → Remeda)

- The `*.indexed`/`*.strict` variants were removed — merged into the base functions (callbacks always get `(item, index, data)`)
- Renames: `uniq*` → `unique*`, `toPairs`/`fromPairs` → `entries`/`fromEntries`, `flatten*` → `flat*`, `path`/`pathOr` → `prop(obj, ...path)` + `defaultTo`
- Removals: `compact` → `filter(isTruthy)`, `reject` → `filter(isNot(pred))`, `maxBy`/`minBy` → `firstBy`/`nthBy`/`takeFirstBy`, `debounce` → `funnel`
- Lodash chain `_(x).filter(f).value()` → `pipe(x, filter(f))`; Ramda `R.pipe(...)(x)` → `pipe(x, ...)`
- `difference`/`intersection` have multi-set (bag) semantics — duplicates count as separate items

## Perf Notes

- Lazy fusion only works when the data-last form is used directly in the pipe — an arrow wrapper disables lazy immediately
- `sort`/`sortBy` clone the array first (never mutate the input) — watch for double-clone when sorting again inside a pipe
- `isDeepEqual` is more expensive than `isShallowEqual`/`isStrictEqual` — pick according to the real structural depth
- `purry`-based custom fns accept a `lazy` evaluator to join the lazy pipeline

## Do / Don't

| Do | Don't |
|----|-------|
| `pipe(data, map(f), take(3))` | `take(map(data, f), 3)` nesting |
| `filter(isDefined)` | `filter((x) => x !== undefined)` + cast |
| `firstBy(arr, [prop("x"), "desc"])` | `first(sortBy(arr, [prop("x"), "desc"]))` when you only need the first item |
| `sortBy(users, prop("name"))` | `sortBy(users, (u) => u.name)` when `prop` works |
| `conditional(x, [p, f], constant(undefined))` | `conditional` without a fallback |
| `funnel(cb, {minGapMs})` | `debounce` (deprecated) |
| `map(items, piped(prop("a"), add(1)))` | `piped` as a standalone function factory |
