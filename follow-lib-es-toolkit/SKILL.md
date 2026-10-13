---
name: follow-lib-es-toolkit
description: ใช้ es-toolkit สำหรับ JS/TS utility functions — tree-shakeable, type-safe, เร็วกว่า Lodash, มี /compat
argument-hint: "[target-or-scope]"
related:
  - follow-lang-typescript
  - follow-lang-javascript
  - follow-lang-bun
  - follow-lib-remedajs
  - use-lib-effective
  - follow-best-practice
  - run-verify
---

## Goal

ใช้ es-toolkit เขียน JS/TS utilities แบบ modern, tree-shakeable และ type-safe แทน Lodash หรือ utils เขียนเอง — พร้อม migrate จาก Lodash ทีละขั้นด้วย `es-toolkit/compat`

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `es-toolkit` — ติดตั้ง, array/object/string/math/predicate/function/promise utilities, migrate จาก Lodash, หรือเลือก core vs compat

- Latest: `es-toolkit@1.52.0` (verified 2026-10-12) — MIT, ไม่มี peer deps, ใช้ได้ทั้ง ESM และ CJS
- Core API (`es-toolkit`) เร็วกว่า lodash 2-3× และ bundle เล็กกว่าถึง 97% ผ่าน tree-shaking — `es-toolkit/compat` mirror Lodash 1:1 เพื่อ migration เท่านั้น (ใหญ่และช้ากว่า core)
- ถ้าต้องการ functional composition แบบ data-first/data-last + `pipe` → `/follow-lib-remedajs`; es-toolkit เป็น imperative utility (signature แบบ lodash-style) ไม่มี pipe
- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Execute

### 1. Install And Check Version

> Goal: ติดตั้ง es-toolkit เวอร์ชันที่ถูกต้อง

1. รัน `bun add es-toolkit` (ตาม package manager ของ project — npm: `npm i es-toolkit`, deno: `deno add jsr:@es-toolkit/es-toolkit`)
2. ตรวจเวอร์ชันล่าสุดที่ `https://www.npmjs.com/package/es-toolkit` (ปัจจุบัน 1.52.0, verified 2026-10-12)
3. ใช้ named imports จาก barrel `import { chunk, debounce } from 'es-toolkit'` หรือจาก submodule `import { debounce } from 'es-toolkit/function'` — ทั้งสองแบบ tree-shake ได้
4. อย่า import ทั้ง library แบบ namespace (`import * as _ from 'es-toolkit'`) — เสียประโยชน์ tree-shaking ใน bundler ที่วิเคราะห์ไม่ได้

### 2. Choose Core Or Compat

> Goal: เลือก entry point ให้เหมาะกับสถานะ migration

1. project ใหม่ → ใช้ core (`es-toolkit`) เท่านั้น — API ทันสมัย, performance ดีที่สุด
2. project ที่ใช้ lodash อยู่ → เปลี่ยน import path เป็น `es-toolkit/compat` ก่อน (`import { chunk } from 'es-toolkit/compat'`) — behavior ตรงกับ lodash เพื่อปลด dependency ได้ทันที
3. หลังจากย้ายเข้า compat สำเร็จ → ค่อยๆ เปลี่ยน function ที่ core มีชื่อตรงกันกลับเข้า `es-toolkit` ทีละตัว แล้ววัด bundle size ซ้ำ
4. compat ไม่มี: `sortedUniq`, `mixin`, `noConflict`, `runInContext` — ต้องเขียนเองหรือ redesign
5. อย่าผสม import จาก `es-toolkit` และ `es-toolkit/compat` ในไฟล์เดียวโดยไม่จำเป็น — สอง implementation อาจให้ semantics ต่างกัน (เช่น clone แบบตื้น)

### 3. Work With Arrays

> Goal: เลือก array utilities ให้ตรง operation

1. Slice/dedupe: `chunk`, `uniq`/`uniqBy`/`uniqWith`, `differenceBy`, `intersection`, `union`, `xor`, `without`, `pull`, `remove`, `windowed`, `compact`
2. Group/aggregate: `groupBy`, `keyBy`, `countBy`, `partition`, `sumBy`/`meanBy` (math), `maxBy`/`minBy`, `sample`/`sampleSize`/`shuffle`
3. Order: `sortBy(arr, criteria)` — criteria เป็น array ของ property name หรือ mapping fn, เรียง ascending ตาม priority; `orderBy(arr, criteria, orders)` เมื่อต้องการ asc/desc ผสม
4. Flatten/zip: `flatten`, `flattenDeep`, `flatMap`, `flatMapDeep`, `zip`, `zipWith`, `zipObject`, `unzip`, `unzipWith`
5. Async per-item: `mapAsync`, `filterAsync`, `forEachAsync`, `reduceAsync`, `flatMapAsync` (มี concurrency option)
6. Set math: `cartesianProduct`, `combinations`

### 4. Work With Objects

> Goal: transform และ merge objects แบบ immutable

1. Pick/omit: `pick`, `pickBy`, `omit`, `omitBy`, `invert`, `findKey`, `sortKeys`
2. Map values/keys: `mapValues`, `mapKeys`, `mapValuesAsync`, `mapKeysAsync`
3. Merge: `merge`, `mergeWith` (mutates target แบบ lodash) — ใช้ `toMerged(a, b)` เมื่อต้องการ immutable result
4. Clone: `clone` (ตื้น, รองรับ array/plain object/Map/Set/Date/TypedArray), `cloneDeep`, `cloneDeepWith`, `deepFreeze`
5. Convert keys: `toCamelCaseKeys`, `toSnakeCaseKeys`, `toKebabCaseKeys`, `toPascalCaseKeys`, `toConstantCaseKeys`; `flattenObject` สำหรับ `{"a.b": 1}` style
6. Collection-aware helpers มีแยก namespace: `es-toolkit/map` (filter, mapValues, countBy, ...) และ `es-toolkit/set` — สำหรับ `Map`/`Set` โดยตรง ไม่ใช่ plain object

### 5. Strings, Math And Predicates

> Goal: ใช้ string casing, numeric helpers และ type guards ที่ type-safe

1. Case: `camelCase`, `snakeCase`, `kebabCase`, `pascalCase`, `constantCase`, `startCase`, `sentenceCase`, `lowerCase`, `upperCase`, `capitalize`, `upperFirst`/`lowerFirst`, `words`
2. Text: `trim`/`trimStart`/`trimEnd`, `pad`, `escape`/`unescape`, `escapeRegExp`, `deburr`, `dedent`, `reverseString`
3. Math: `sum`, `mean`, `median`, `percentile`, `round`, `clamp`, `inRange`, `random`, `randomInt`, `range`/`rangeRight`, `lerp`/`inverseLerp`, `sumBy`/`meanBy` — มีคู่ `bigint/*` สำหรับ BigInt
4. Predicates: `isNil`/`isNotNil` (ใช้กับ `filter` เพื่อ narrow type), `isEqual`/`isEqualWith`, `isPlainObject`, `isPrimitive`, `isJSON`/`isJSONObject`/`isJSONArray`, `isDate`, `isPromise`, `isMap`, `isSet`, `isBlob`, `isFile`, `isBuffer`, `isBrowser`/`isNode`, `isLength`, `isIterable`
5. ไม่มี `isEmpty` แบบ lodash ใน core predicate — ใช้ `isEqual(value, {})`, เช็ค length, หรือ import จาก `es-toolkit/compat`

### 6. Function Control And Timing

> Goal: จัดการ timing, caching และ composition

1. `debounce(fn, ms, options)` — result มี `.cancel()` และ `.flush()`; รองรับ `signal` (AbortSignal), `retries`/`abortOnSignal` สำหรับ async
2. `throttle(fn, ms)`, `once`, `after`, `before`, `ary`, `unary`, `negate`, `identity`, `noop`/`asyncNoop`
3. `memoize` — cache ด้วย `Map` เริ่มต้น, เช็ค docs ก่อนคาดหวัง behavior ต่างจาก lodash
4. Composition: `flow`, `flowRight`, `curry`, `curryRight`, `partial`, `partialRight`, `rest`, `spread`, `retry`
5. ถ้าต้องการ pipeline แบบ lazy/early-terminate → Remeda เหมาะกว่า (ดู `/follow-lib-remedajs`)

### 7. Async Primitives

> Goal: ใช้ promise helpers ที่ built-in

1. `delay(ms, { signal })` — awaitable sleep ที่ abort ได้
2. `timeout(ms)` สำหรับ race timeout และ `withTimeout(promise, ms)` — throw `TimeoutError`
3. `allKeyed({ a: p1, b: p2 })` — `Promise.all` สำหรับ object ของ promises
4. `limitAsync(concurrency)(fn)` — สร้าง wrapper คุมจำนวน async calls พร้อมกัน
5. Locking: `new Mutex()` (runExclusive) และ `new Semaphore(n)` — ใช้กับ critical section แบบ in-process
6. Errors จาก promise API เป็น `AbortError`/`TimeoutError` ที่ import จาก `es-toolkit/error` ได้

### 8. Use Iterator API

> Goal: lazy sequence สำหรับข้อมูลใหญ่/stream

1. import จาก `es-toolkit/iterator`: `iterate`, `range`, `chunk`, `count`, `uniqBy`, `zip`, `map`, `filter`, `takeWhile`, `dropWhile`, `scan`, `head`, `partition`, `cartesianProduct` — ทุกตัวทำงานกับ iterator แบบ lazy ไม่ materialize array

### 9. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck และ tests
2. ตรวจ official docs ล่าสุดที่ `https://es-toolkit.dev/reference/array/chunk.html` (เปลี่ยน category/function ตามตัวที่ใช้) และ performance/bundle docs ก่อนใช้ API ที่ไม่แน่ใจ
3. ตรวจ `https://es-toolkit.dev/compatibility.html` เมื่อ migrate lodash — รายชื่อฟังก์ชันที่ compat ไม่รองรับ

## Rules

### 1. Import Discipline

- named imports เท่านั้น — `import { chunk } from 'es-toolkit'` หรือ submodule `es-toolkit/<category>`; ห้าม namespace import ทั้ง library
- categories ที่ใช้ได้ (จาก exports ของ 1.52.0): `array`, `bigint`, `compat`, `error`, `fp`, `function`, `iterator`, `map`, `math`, `object`, `predicate`, `promise`, `server`, `set`, `string`, `types`, `util`

### 2. Core Vs Compat

- compat คือเส้นทาง migration เท่านั้น — code ใหม่ต้องเขียนด้วย core API
- ฟังก์ชันที่ชื่อ/behavior ต่างกันระหว่าง core กับ lodash ให้ตรวจ docs ของทั้งสองก่อน swap; `merge`/`mergeWith` mutates target เช่นเดียวกับ lodash — ใช้ `toMerged` ถ้าต้องการ immutable
- core ไม่มี `isEmpty`/`_.chain`/`_.template` — redesign หรือใช้ compat ชั่วคราว

### 3. Semantics And Types

- เปิด `strict: true` ใน `tsconfig.json` — type guards อย่าง `isNotNil` narrow type ใน `filter` ได้จริง
- `sortBy` รับ criteria เป็น array เดียว (`sortBy(users, ["age", "name"])` ไม่ใช่ variadic หลาย args แบบ Remeda) — desc ใช้ `orderBy` พร้อม orders
- ใช้ `cloneDeep` เมื่อต้อง decouple nested state; `clone` เป็นตื้นสำหรับ container ที่รู้จักเท่านั้น

### 4. Competitor Awareness

- ใช้ `/use-lib-effective` เพื่อ prefer es-toolkit แทน hand-rolled utils
- ใช้ `/follow-lib-remedajs` ถ้างานเป็น functional data transformation ที่ต้องการ pipe/lazy
- ใช้ `/follow-lang-typescript` และ `/follow-lang-javascript` ถ้าจำเป็น
- ใช้ `/follow-best-practice` และ `/run-verify` ถ้าจำเป็น

- References: [apis](references/apis.md) · ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `es-toolkit` ติดตั้งเวอร์ชันล่าสุดและ import แบบ tree-shakeable ถูกต้อง
- เลือก core/compat ถูกสถานะงาน — code ใหม่ไม่ค้างใน compat
- Array/object/string/promise utilities ใช้ตรง operation และ semantics ถูกระบุ (merge mutates, toMerged ไม่)
- Async primitives (`delay`, `withTimeout`, `limitAsync`, `Mutex`) ใช้แทน pattern เขียนเอง
- Type narrowing ผ่าน predicates โดยไม่ต้อง cast; ไม่มี lodash names ที่ไม่มีอยู่จริงใน core คงค้าง
- Lint, typecheck, tests ผ่าน
