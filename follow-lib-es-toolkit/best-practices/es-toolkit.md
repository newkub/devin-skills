# es-toolkit Best Practices

## Import Hygiene

- do: named imports `import { chunk, pick } from 'es-toolkit'` — the bundler tree-shakes down to only the functions used (up to ~97% smaller than lodash)
- do: use submodule paths when you want explicitness or to avoid circular resolve: `es-toolkit/array`, `es-toolkit/function`, `es-toolkit/promise`, `es-toolkit/predicate`, `es-toolkit/object`, `es-toolkit/string`, `es-toolkit/math`, `es-toolkit/iterator`, `es-toolkit/map`, `es-toolkit/set`, `es-toolkit/error`, `es-toolkit/util`, `es-toolkit/bigint`, `es-toolkit/query-string`
- don't: `import * as _ from 'es-toolkit'` or importing the whole barrel into a runtime that doesn't bundle (plain Node ESM) unless necessary — needlessly loading the whole module
- note: supports ESM + CJS dual, no peer deps — works out of the box in Node, Bun, Deno (via JSR), and browser bundlers

## Core Vs Compat

- do: greenfield → core only; legacy lodash → swap the import path to `es-toolkit/compat` across the whole repo first (lower risk per commit), then migrate back to core file by file
- do: set a lint rule (no-restricted-imports) forbidding new `es-toolkit/compat` additions in new files during the migrate phase
- don't: mix core and compat in one file — some semantics differ (e.g. core `clone` knows Map/Set/TypedArray; compat focuses on lodash behavior)
- note: functions compat doesn't have: `sortedUniq`, `mixin`, `noConflict`, `runInContext` — these should be gone from the design anyway

## Performance

- do: check before expecting "faster at everything" — the strength is array/object where modern engines optimize (2-3× vs lodash per official benchmarks), but some functions have the same big-O as lodash; for hot paths run a real benchmark (`es-toolkit.dev/performance.html` has the source)
- do: use `limitAsync` / the concurrency options of `mapAsync` to control parallel fetch instead of `Promise.all` on large arrays
- do: large/streaming data → iterator API (`es-toolkit/iterator`) lazily instead of materializing an array then chaining map/filter
- don't: call `debounce`/`memoize` inside a render loop or repeatedly in a factory — a new instance each time loses the cache; create it once outside the loop

## Timing And Async

- do: `debounce` returns a function with `.cancel()` and `.flush()` — call `.cancel()` on unmount/cleanup; call `.flush()` when you must deliver a pending value before navigation
- do: use the `signal` option of `debounce`/`delay` bound to the AbortController lifecycle instead of manual cancel at many points
- do: for timeouts use `withTimeout(promise, ms)` then catch `TimeoutError` (import from `es-toolkit/error`) — cleanly separable from `AbortError`
- do: critical section in-process use `Mutex.runExclusive`; resource pool use `Semaphore` — don't try to lock across processes (not supported)
- note: `retry` supports backoff options — always set a total cap (caller-side timeout) to avoid unbounded retry

## Type Safety

- do: enable `strict` in tsconfig — `isNotNil` is a type predicate that actually narrows with `.filter(isNotNil)` (native filter)
- don't: repeatedly write `arr.filter(x => x != null)` when `isNotNil` exists — loses narrowing if not annotated
- do: `pick`/`omit` infer literal key types — pass keys as an array literal (`pick(obj, ['a', 'b'])`), not a variable widened to `string[]`
- do: transform API response keys with `toCamelCaseKeys`/`toSnakeCaseKeys` (deep, once at the boundary) instead of hand-mapping field by field

## Equality And Cloning

- do: `isEqual` deep comparison works on data primitives; for domain objects with `valueOf`/class instances, check semantics first (not recursive for arbitrary classes in all the same cases as lodash)
- do: immutable merge uses `toMerged`; if you intend mutation like lodash use `merge` — and write a comment saying why, because the name is the same but the behavior differs from what React/immutable developers expect
- don't: `clone` (shallow) on nested state thinking it decouples — use `cloneDeep`; for sentinels that must freeze the whole subtree use `deepFreeze`
- note: `sortKeys` is a shallow sort; key-case converters (`toCamelCaseKeys` etc.) work deeply and return a new object

## Migration From Lodash

1. Change all imports to `es-toolkit/compat` → run the whole test suite (behavior must be identical)
2. List the functions actually used (`rg "from 'lodash'"` / knip) → match them to the core API: exact-name matches move first (`chunk`, `debounce`, `pick`, `merge` — watch mutation semantics)
3. Different names / not in core → handle case by case: `_.isEmpty` → `isNotNil`+length checks or keep compat; `_.chain` → native method chaining; `_.template` → redesign
4. Remove lodash from package.json → measure the bundle with `/follow-tool-sonda` or node-modules-inspector, before/after comparison
5. Delete compat file by file once unreferenced → close the work with `/run-verify`

## Pitfalls

- `pull`, `remove`, `fill` (some overloads) mutate the source array — not everything is immutable as commonly assumed; check docs per function before using them in a state pipeline
- `range(0, n)` has an exclusive end like lodash, but `rangeRight`, `fill` semantics differ slightly — write controlling tests when migrating
- No `_.chain`/wrapper object — design as function calls layered on native methods
- es-toolkit is still major-version 1.x — new APIs keep arriving in minors; live-check with `/deep-research` when you find a docs function missing from the installed version
