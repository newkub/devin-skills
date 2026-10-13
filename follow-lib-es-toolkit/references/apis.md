| key | value |
|---|---|
| package | `es-toolkit` |
| install | `bun add es-toolkit` (npm: `npm i es-toolkit`, deno: `deno add jsr:@es-toolkit/es-toolkit`) |
| stable version | 1.52.0 (verified 2026-10-12) |
| license | MIT © Viva Republica, Inc. (Toss) |
| requires | ไม่มี peer deps; TypeScript-first types; ESM + CJS dual |
| compat entry | `es-toolkit/compat` (Lodash 1:1 migration layer) |
| docs | https://es-toolkit.dev/ |
| api reference | https://es-toolkit.dev/reference/array/chunk.html (เปลี่ยน category/function) |
| compatibility guide | https://es-toolkit.dev/compatibility.html |
| performance | https://es-toolkit.dev/performance.html (2-3× vs lodash) |
| bundle size | https://es-toolkit.dev/bundle-size.html (เล็กกว่าถึง 97% ผ่าน tree-shaking) |
| repository | https://github.com/toss/es-toolkit |
| jsr | https://jsr.io/@es-toolkit/es-toolkit |

| api | description | signature/example |
|-----|-------------|-------------------|
| `chunk` | Split array into sized pieces | `chunk([1,2,3,4], 2)` → `[[1,2],[3,4]]` |
| `compact` | Remove falsy values | `compact([0, 1, false, 2])` → `[1, 2]` |
| `uniq` / `uniqBy` / `uniqWith` | Dedupe array | `uniqBy(users, u => u.id)` |
| `difference` / `differenceBy` / `differenceWith` | Items in a not in b | `difference([1,2,3], [2])` → `[1,3]` |
| `intersection` / `intersectionBy` / `intersectionWith` | Common items | `intersection([1,2], [2,3])` → `[2]` |
| `union` / `unionBy` / `unionWith` | Merge unique | `union([1,2], [2,3])` → `[1,2,3]` |
| `xor` / `xorBy` / `xorWith` | Symmetric difference | `xor([1,2], [2,3])` → `[1,3]` |
| `without` | Exclude given values | `without([1,2,1], 1, 2)` |
| `pull` / `pullAt` / `remove` | Mutating removal ops | `remove(arr, pred)` |
| `at` / `head` / `last` / `tail` / `initial` | Positional access | `head([1,2,3])` → `1` |
| `take` / `takeRight` / `takeWhile` / `takeRightWhile` | Prefix/suffix take | `takeWhile(arr, pred)` |
| `drop` / `dropRight` / `dropWhile` / `dropRightWhile` | Prefix/suffix drop | `drop(arr, 2)` |
| `windowed` | Sliding windows | `windowed([1,2,3], 2, {partialAccess: false})` |
| `flatten` / `flattenDeep` / `flatMap` / `flatMapDeep` | Flatten arrays | `flattenDeep([[1],[2,[3]]])` |
| `zip` / `zipWith` / `unzip` / `unzipWith` / `zipObject` | Pair arrays | `zip([1,2], ['a','b'])` |
| `groupBy` / `keyBy` / `countBy` / `partition` | Array → record/split | `groupBy(users, u => u.dept)` |
| `sortBy` / `orderBy` | Sort by criteria (asc; orders for mixed) | `sortBy(users, ['age', 'name'])` |
| `maxBy` / `minBy` | Extremum by selector | `maxBy(items, i => i.size)` |
| `sample` / `sampleSize` / `shuffle` / `fill` / `toFilled` | Random/mutate copies | `sample([1,2,3])` |
| `cartesianProduct` / `combinations` | Set math | `combinations([1,2,3], 2)` |
| `isSubset` / `isSubsetWith` | Subset check | `isSubset([1,2], [1,2,3])` |
| `mapAsync` / `filterAsync` / `forEachAsync` / `reduceAsync` / `flatMapAsync` | Async per-item with concurrency option | `mapAsync(arr, fn, {concurrency: 2})` |
| `pick` / `pickBy` / `omit` / `omitBy` | Key filtering (immutable) | `pick(obj, ['a', 'b'])` |
| `mapValues` / `mapKeys` (+ `*Async`) | Transform object entries | `mapValues(obj, v => v * 2)` |
| `invert` / `findKey` / `sortKeys` / `flattenObject` | Object derivation | `invert({a: 'x'})` → `{x: 'a'}` |
| `merge` / `mergeWith` | Deep merge — mutates target (lodash-style) | `merge(target, source)` |
| `toMerged` | Immutable deep merge variant | `toMerged(a, b)` |
| `clone` / `cloneDeep` / `cloneDeepWith` / `deepFreeze` | Clone/freeze helpers | `cloneDeep(nested)` |
| `toCamelCaseKeys` / `toSnakeCaseKeys` / `toKebabCaseKeys` / `toPascalCaseKeys` / `toConstantCaseKeys` | Convert all object keys (deep) | `toCamelCaseKeys({'foo-bar': 1})` |
| `camelCase` / `snakeCase` / `kebabCase` / `pascalCase` / `constantCase` / `startCase` / `sentenceCase` / `lowerCase` / `upperCase` | String case convert | `camelCase('Foo Bar')` → `'fooBar'` |
| `capitalize` / `upperFirst` / `lowerFirst` / `words` | Casing helpers | `words('fooBar')` → `['foo','Bar']` |
| `trim` / `trimStart` / `trimEnd` / `pad` | Whitespace/padding | `pad('hi', 6)` |
| `escape` / `unescape` / `escapeRegExp` / `deburr` / `dedent` / `reverseString` | Text ops | `escape('<b>&</b>')` |
| `sum` / `mean` / `median` / `medianBy` / `percentile` / `round` | Numeric aggregate (number) | `round(1.234, 2)` |
| `random` / `randomInt` / `range` / `rangeRight` | Number generation | `range(1, 5)` → `[1,2,3,4]` |
| `clamp` / `inRange` / `lerp` / `inverseLerp` / `sumBy` / `meanBy` | Interpolation/bounds | `clamp(5, 0, 3)` → `3` |
| `bigint.*` | BigInt twins (sum, min, max, range, clamp, percentile...) | `import { sum } from 'es-toolkit/bigint'` |
| `isEqual` / `isEqualWith` | Deep equality | `isEqual({a:1}, {a:1})` |
| `isNil` / `isNotNil` / `isNull` / `isUndefined` | Null guards; `isNotNil` narrows in filter | `users.filter(isNotNil)` |
| `isPlainObject` / `isPrimitive` / `isFunction` / `isDate` / `isRegExp` / `isPromise` / `isSymbol` | Type guards | `isPlainObject({})` |
| `isMap` / `isSet` / `isWeakMap` / `isWeakSet` / `isIterable` / `isLength` | Collection guards | `isMap(new Map())` |
| `isJSON` / `isJSONObject` / `isJSONArray` / `isJSONValue` | JSON shape guards | `isJSONObject '{}'` |
| `isBlob` / `isFile` / `isBuffer` / `isArrayBuffer` / `isTypedArray` | Binary/env guards | `isBuffer(buf)` |
| `isBrowser` / `isNode` / `isError` / `isBoolean` / `isNumber` / `isString` | Env/primitive guards | `isNode` |
| `debounce` | Debounce with `.cancel()`/`.flush()`, AbortSignal + retry options | `debounce(fn, 300, {signal})` |
| `throttle` | Throttle calls | `throttle(fn, 100)` |
| `memoize` | Cache function results (Map-backed) | `memoize(fn)` |
| `once` / `after` / `before` / `ary` / `unary` / `negate` | Call control | `once(fn)` |
| `curry` / `curryRight` / `partial` / `partialRight` / `rest` / `spread` | Arity manipulation | `curry(add3)` |
| `flow` / `flowRight` | Sync composition | `flow([f, g])` |
| `retry` | Retry async fn with backoff options | `retry(fn, {retries: 3})` |
| `identity` / `noop` / `asyncNoop` | Neutral functions | `identity(1)` |
| `delay` | Awaitable abortable sleep | `await delay(500, {signal})` |
| `timeout` / `withTimeout` | Race timeout, throws `TimeoutError` | `await withTimeout(p, 1000)` |
| `allKeyed` | `Promise.all` for object of promises | `allKeyed({a: p1, b: p2})` |
| `limitAsync` | Concurrency limiter factory | `limitAsync(2)(asyncFn)` |
| `Mutex` / `Semaphore` | In-process locks | `new Mutex().runExclusive(fn)` |
| `AbortError` / `TimeoutError` | Error classes from `es-toolkit/error` | `import { TimeoutError } from 'es-toolkit/error'` |
| `iterator.*` | Lazy iterables: `iterate`, `range`, `chunk`, `count`, `map`, `filter`, `uniqBy`, `zip`, `takeWhile`, `dropWhile`, `scan`, `head`, `partition`, `cartesianProduct` | `import { chunk } from 'es-toolkit/iterator'` |
| `map/*` (es-toolkit/map) | Helpers for `Map`: filter, map, mapValues, mapKeys, keyBy, countBy, reduce, every, some, find, findKey, findValue, hasValue, forEach, reduce | `filter(map, pred)` |
| `set/*` (es-toolkit/set) | Helpers for `Set`: filter, map, keyBy, countBy, reduce, every, some, find, forEach | `map(set, fn)` |
| `assert` / `invariant` / `attempt` / `attemptAsync` / `defer` / `deferAsync` / `hash` / `serialize` | Util helpers (from `es-toolkit/util`) | `assert(cond, msg)` |
| `fp/*` | Subpath `es-toolkit/fp` — functional variants (curried/data-last forms); check docs before use | `import { ... } from 'es-toolkit/fp'` |
| compat `*` | Lodash 1:1 names/behavior via `es-toolkit/compat`; ไม่มี `sortedUniq`, `mixin`, `noConflict`, `runInContext` | `import { isEmpty } from 'es-toolkit/compat'` |
