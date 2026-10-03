| key | value |
|---|---|
| package | `remeda` |
| install | `bun add remeda` (deno: `deno add jsr:@remeda/remeda`) |
| stable version | 2.50.0 (verified 2026-10-03) |
| license | MIT |
| requires | TypeScript ≥5.1, ES2022 target |
| docs | https://remedajs.com/docs |
| migration | https://remedajs.com/migrate/v1/ |
| repository | https://github.com/remeda/remeda |

| api | description | signature/example |
|-----|-------------|-------------------|
| `pipe` | Left-to-right composition; lazy functions fuse, early-terminate | `pipe(data, map(f), take(3))` |
| `piped` | Data-last `pipe` for use as callback | `map(items, piped(prop("a"), add(1)))` |
| `purry` | Create dual dataFirst/dataLast signature function | `purry(fn, args, lazy?)` |
| `map` / `filter` / `flatMap` | Transform/filter array (lazy) | `map(arr, fn)` / `map(fn)(arr)` |
| `filter` | Filter array (lazy); accepts type-guards | `filter(arr, isDefined)` |
| `groupBy` / `groupByProp` | Group array into record | `groupBy(arr, (x) => x.age)` / `groupByProp(users, "dept")` |
| `indexBy` / `countBy` / `mapToObj` | Build records from arrays | `indexBy(arr, (x) => x.id)` |
| `partition` | Split into [accepted, rejected] | `partition(arr, pred)` |
| `chunk` / `take` / `drop` / `takeWhile` / `dropWhile` / `takeLast` / `dropLast` | Slice operations (mostly lazy) | `chunk(arr, 2)` |
| `first` / `last` / `only` / `find` / `findIndex` / `findLast` | Element access/search | `first(arr)`, `find(arr, pred)` |
| `hasAtLeast` | Check length + narrow nonEmpty type | `hasAtLeast(arr, 2)` |
| `sort` / `sortBy` | Sort; rules = projections or `[proj, "desc"]` | `sortBy(users, [prop("age"), "desc"], prop("name"))` |
| `firstBy` / `nthBy` / `takeFirstBy` / `dropFirstBy` / `rankBy` | Order-based select O(n)/O(nlogk), no full sort (replaces maxBy/minBy) | `firstBy(arr, [prop("size"), "desc"])` |
| `unique` / `uniqueBy` / `uniqueWith` | Dedupe (lazy) | `uniqueBy(arr, prop("id"))` |
| `difference` / `differenceWith` / `intersection` / `intersectionWith` | Multi-set set ops (lazy) | `difference(a, b)` |
| `concat` / `zip` / `zipWith` / `flat` | Combine/flatten arrays | `zip(a, b)`, `flat(arr)` |
| `reduce` / `sumBy` / `meanBy` / `mergeAll` / `join` / `length` | Aggregation | `reduce(arr, add, 0)` |
| `range` / `times` / `sample` / `shuffle` / `reverse` / `splice` / `splitAt` / `splitWhen` / `swapIndices` | Generate/mutate copies | `range(0, 10)`, `times(3, fn)` |
| `sortedIndex` / `sortedIndexBy` / `sortedIndexWith` / `sortedLastIndex` | Binary-search insert index | `sortedIndex(arr, item)` |
| `pick` / `omit` / `pickBy` / `omitBy` | Object key filtering | `pick(obj, ["a","b"])` |
| `prop` | Typed path accessor (variadic) | `prop(obj, "a", "b")`, `prop("a")(obj)` |
| `entries` / `keys` / `values` | Object iterators; call `()` for data-last | `entries(obj)` / `entries()(obj)` |
| `fromEntries` / `fromKeys` / `objOf` / `pullObject` / `invert` | Build objects | `pullObject(arr, prop("id"), prop("name"))` |
| `mapValues` / `mapKeys` / `forEachObj` / `evolve` | Transform objects | `mapValues(rec, length())` |
| `merge` / `mergeDeep` / `clone` / `set` / `setPath` / `addProp` / `swapProps` | Immutable object ops | `mergeDeep(a, b)`, `setPath(obj, ["a","b"], v)` |
| `stringToPath` | Parse "a.b[0].c" → path array | `stringToPath("a.b[0]")` |
| `isDefined` / `isNonNullish` / `isNonNull` / `isNullish` / `isTruthy` | Nullability guards (headless) | `filter(isDefined)` |
| `isString`/`isNumber`/`isBoolean`/`isBigInt`/`isSymbol`/`isFunction`/`isPromise`/`isDate`/`isError`/`isArray`/`isPlainObject`/`isObjectType` | Type guards | `filter(isString)` |
| `isNot` / `allPass` / `anyPass` | Compose predicates | `filter(isNot(isNullish))` |
| `isDeepEqual` / `isShallowEqual` / `isStrictEqual` / `isIncludedIn` / `isEmpty` / `isEmptyish` / `hasProp` / `hasSubObject` | Equality/membership guards | `isDeepEqual(a, b)` |
| `add` / `subtract` / `multiply` / `divide` / `clamp` / `ceil` / `floor` / `round` / `sum` / `mean` / `median` / `product` / `randomInteger` / `randomBigInt` | Math ops (curryable) | `map(arr, add(1))`, `clamp(v, {min, max})` |
| `capitalize`/`uncapitalize`/`toLowerCase`/`toUpperCase`/`toCamelCase`/`toKebabCase`/`toSnakeCase`/`toTitleCase`/`startsWith`/`endsWith`/`split`/`sliceString`/`truncate`/`randomString` | String ops | `countBy(arr, toLowerCase())` |
| `when` | Ternary-like; `{onTrue, onFalse}` or `onTrue` only | `when(x, isNullish, constant(42))` |
| `conditional` | If-else chain; throws w/o match — always add fallback | `conditional(x, [isString, f], constant(undefined))` |
| `tap` / `defaultTo` / `identity` / `constant` / `doNothing` / `once` / `partialBind` / `partialLastBind` | Flow helpers | `tap(console.log)`, `defaultTo(v)` |
| `funnel` | Rate-limit: debounce (`minQuietPeriodMs`), throttle (`minGapMs`), batch — replaces deprecated `debounce` | `funnel(cb, {minGapMs: 100})` |
| `forEach` / `mapWithFeedback` | Iteration (lazy; `forEach` data-last returns same ref) | `pipe(arr, forEach(log), take(3))` |
