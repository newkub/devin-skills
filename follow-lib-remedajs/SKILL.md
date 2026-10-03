---
name: follow-lib-remedajs
description: ใช้ Remeda สำหรับ type-safe utility functions — data-first/data-last + lazy pipe
argument-hint: "[target-or-scope]"
related:
  - follow-lang-typescript
  - follow-lang-bun
  - follow-lib-effect-ts
  - use-lib-effective
  - follow-best-practice
  - run-verify

---

## Goal

ใช้ Remeda เขียน data transformations ที่ type-safe ทั้ง compile-time และ runtime ด้วย dual-signature API (data-first/data-last) และ lazy `pipe` แทน Lodash/Ramda หรือ utils เขียนเอง

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `remeda` — ติดตั้ง, array/object/string/number/guard utilities, pipe composition, หรือ migrate Lodash/Ramda/v1 → v2

- ใช้ skill นี้สำหรับ Remeda v2 API เท่านั้น — v1 ใช้ variants (`*.indexed`, `*.strict`) และชื่อเก่า (`uniq`, `toPairs`, `compact`, `reject`, `flatten`, `maxBy`, `minBy`, `path`, `pathOr`)
- Latest: `remeda@2.50.0` (verified 2026-10-03) — v2 ต้อง TypeScript ≥5.1, compile target ES2022
- `debounce` deprecated → ใช้ `funnel`; `pathOr` deprecated → ใช้ `defaultTo(prop(obj, ...path), fallback)`
- ถ้าต้องการ full effect system (lazy programs, fibers, supervision) → `/follow-lib-effect-ts`; Remeda เป็น pure utility library ไม่มี async/effect primitives
- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Execute

### 1. Install And Check Version

> Goal: ติดตั้ง Remeda เวอร์ชันที่ถูกต้อง

1. รัน `bun add remeda` (ตาม package manager ของ project — deno ใช้ `deno add jsr:@remeda/remeda`)
2. ตรวจเวอร์ชันล่าสุดที่ `https://www.npmjs.com/package/remeda` (ปัจจุบัน 2.50.0, verified 2026-10-03)
3. ยืนยัน `typescript` ≥5.1 ใน devDependencies และ compile target ≥ES2022
4. ใช้ named imports `import { pipe, map, filter } from "remeda"` — tree-shakeable, รองรับ ESM+CJS
5. ตรวจ version ใน `package.json` — ถ้า v1 ให้ migrate ตาม `https://remedajs.com/migrate/v1/` ก่อนใช้ API ใหม่

### 2. Choose Data-First Or Data-Last

> Goal: เลือก invocation style ให้เหมาะกับ context

1. ทุก function มี 2 signatures: data-first `filter(users, (u) => u.active)` และ data-last `filter((u) => u.active)`
2. ใช้ data-first สำหรับ single call — ได้ IDE autocomplete บน data argument
3. ใช้ data-last ภายใน `pipe` เสมอ — อย่าผสม imperative calls เข้า pipes โดยไม่จำเป็น
4. zero-arg functions ต้อง invoke เพื่อได้ data-last impl: `entries()`, `keys()`, `values()`, `identity()`, `constant(v)`, `toLowerCase()`, `doNothing()`
5. type-guards ใช้ bare ได้โดยไม่ต้อง invoke (headless): `filter(isDefined)`, `when(isNullish, ...)`

### 3. Compose With pipe

> Goal: เขียน transformation pipelines ที่อ่าน top-to-bottom และ lazy อัตโนมัติ

1. ใช้ `pipe(data, fn1, fn2, ...)` สำหรับ left-to-right composition — อ่านตรงกับลำดับ execute
2. functions ที่ tag `lazy` (map, filter, take, drop, takeWhile, dropWhile, flat, flatMap, zip, unique, uniqueBy, difference, intersection, find, first, forEach, mapWithFeedback) fuse กันใน pipe — process item-by-item และ early-terminate
3. ปิด lazy เมื่อต้องการ full array ใน callback (3rd param) — wrap data-first ด้วย arrow: `($) => map($, fn)`
4. pipe รับ function อะไรก็ได้ ไม่จำกัดเฉพาะ Remeda — `pipe(input, toLowerCase(), ($) => validate($, CONFIG), split(","))`
5. ใช้ `piped(...fns)` เมื่อต้องส่ง pipeline เป็น callback: `map(items, piped(prop("a"), add(1)))` — ห้ามใช้เป็น function factory (TS infer input ไม่ได้) ให้ประกาศ function แล้วเรียก `pipe` ข้างในแทน

### 4. Work With Arrays

> Goal: เลือก array utilities ให้ตรง operation และ complexity

1. Transform: `map`, `flatMap`, `filter`, `partition`, `groupBy`, `groupByProp`, `indexBy`, `countBy`, `mapToObj`, `flat`
2. Slice: `take`, `drop`, `takeWhile`, `dropWhile`, `takeLast`, `dropLast`, `chunk`, `first`, `last`, `only`, `sample`, `shuffle`, `range`, `times`, `splice`, `splitAt`, `splitWhen`, `swapIndices`
3. Set ops: `unique`, `uniqueBy`, `uniqueWith`, `difference`, `differenceWith`, `intersection`, `intersectionWith`, `concat`, `zip`, `zipWith`
4. Sort: `sortBy(data, ...rules)` — rule คือ projection (`prop("a")`, `identity()`) หรือ `[projection, "desc"]` สำหรับ desc; `sort(data, comparator)` เมื่อต้องการ comparator ดิบ
5. Top-N โดยไม่ sort เต็ม (เร็วกว่า): `firstBy` = maxBy/minBy ที่ O(n), `nthBy` O(n), `takeFirstBy`/`dropFirstBy` O(nlogk), `rankBy`
6. Aggregate: `reduce`, `sumBy`, `meanBy`, `mergeAll`, `join`, `length`, `find`, `findIndex`, `findLast`, `findLastIndex`, `hasAtLeast`, `allPass`, `anyPass`

### 5. Work With Objects

> Goal: transform และ access objects อย่าง type-safe

1. Access: `prop(data, ...path)` รองรับ nested path variadic (`prop(obj, "a", "b")`) พร้อม type validation + autocomplete; `hasProp`, `hasSubObject` สำหรับเช็ค key
2. Filter/derive: `pick`, `pickBy`, `omit`, `omitBy`, `mapValues`, `mapKeys`, `forEachObj`, `evolve`
3. Convert: `entries()`, `keys()`, `values()`, `fromEntries`, `fromKeys`, `invert`, `objOf`, `pullObject`, `stringToPath`
4. Merge/mutate (immutable): `merge`, `mergeDeep`, `mergeAll`, `clone`, `set`, `setPath`, `addProp`, `swapProps`
5. `pathOr` deprecated — ใช้ `defaultTo(prop(obj, ...path), fallback)` แทน

### 6. Guards And Equality

> Goal: narrow types ที่ compile-time แทน runtime checks เขียนเอง

1. Nullability: `isDefined`, `isNonNullish`, `isNonNull`, `isNullish`, `isTruthy`
2. Type guards: `isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol`, `isFunction`, `isPromise`, `isDate`, `isError`, `isArray`, `isPlainObject`, `isObjectType`, `isEmpty`, `isEmptyish`, `isIncludedIn`, `isStrictEqual`
3. Negation/composition: `isNot(pred)`, `allPass`, `anyPass`
4. Equality: `isDeepEqual`, `isShallowEqual` — ใช้ใน `filter`/`find`/`uniqueWith`/`differenceWith`

### 7. Control Flow And Timing

> Goal: conditional logic และ rate-limiting ใน functional style

1. `when(data, pred, onTrue)` หรือ `when(data, pred, { onTrue, onFalse })` — คล้าย ternary, รองรับ type predicates ที่ narrow ทั้งสอง branch
2. `conditional(data, [pred, fn], ..., fallback)` — if-else chain; ระวัง throw เมื่อไม่มี case match (ต่างจาก Lodash/Ramda) ให้ใส่ fallback เสมอเช่น `constant(undefined)`
3. `tap(fn)` สำหรับ side-effects ใน pipe; `defaultTo(v)` สำหรับ fallback values
4. `once`, `partialBind`, `partialLastBind`, `doNothing()`, `identity()`, `constant(v)`
5. Rate-limiting: ใช้ `funnel(callback, options)` — `debounce` deprecated; debounce ใช้ `minQuietPeriodMs`, throttle ใช้ `minGapMs`, batching ดู reference impl ใน repo

### 8. Extend With purry

> Goal: สร้าง custom dual-signature functions เมื่อ library ไม่ครอบ

1. ใช้ `purry(fn, args, lazy?)` ภายใน wrapper ที่มี overload typings (`dataFirst`/`dataLast`)
2. อย่า expose `purry` ตรงๆ — ไม่ type-safe; return type ของ wrapper ที่เรียก purry เป็น `unknown`
3. ใช้ custom functions ใน pipe ได้ปกติ — ผ่าน lazy evaluator ถ้าให้ `lazy` param

### 9. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck และ tests
2. ตรวจ official docs ล่าสุดที่ `https://remedajs.com/docs` ก่อนใช้ API ที่ไม่แน่ใจ — functions ที่ทำงาน lazy มี tag `Lazy` ใน docs
3. ตรวจ migration guide `https://remedajs.com/migrate/v1/` เมื่อแก้ v1 code

## Rules

### 1. Signatures

- data-first สำหรับ single calls, data-last ภายใน `pipe` เท่านั้น — อย่าสลับกลับไปมาใน chain เดียว
- zero-arg data-last ต้อง invoke: `entries()` ไม่ใช่ `entries` (ยกเว้น type-guards ที่ headless)

### 2. Laziness

- ใช้ lazy functions ต่อเนื่องกันใน pipe เพื่อได้ early termination — อย่าแทรก non-lazy transforms ระหว่าง lazy runs ถ้าไม่จำเป็น
- callback 3rd param (input array) ใน lazy context เห็นเฉพาะ items ที่ process แล้ว ไม่ใช่ array เต็ม

### 3. Deprecations And Removals (v2)

- `debounce` → `funnel`, `pathOr` → `defaultTo(prop(...))`, `compact` → `filter(isTruthy)`, `reject` → `filter(isNot(pred))`
- `uniq`/`uniqBy`/`uniqWith` → `unique`/`uniqueBy`/`uniqueWith`, `toPairs`/`fromPairs` → `entries`/`fromEntries`, `flatten*` → `flat*`
- `maxBy`/`minBy` → `firstBy`/`nthBy`/`takeFirstBy`; `*.indexed`/`*.strict` variants ถูก merge เข้า base functions
- `conditional` ต้องมี fallback case เสมอ — throw ถ้าไม่ match (ต่างจาก Lodash/Ramda)

### 4. Type Safety

- เปิด `strict: true` ใน `tsconfig.json` — Remeda types แม่นกว่า built-in (tuple-aware `map`, literal inference)
- prefer `prop`/`sortBy` projections แทน inline lambdas เมื่อต้องการ type inference ที่ดีที่สุด

### 5. Cross-Skill References

- ใช้ `/use-lib-effective` เพื่อ prefer Remeda แทน hand-rolled utils
- ใช้ `/follow-lang-typescript` ถ้าจำเป็น
- ใช้ `/follow-lang-bun` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/follow-lib-effect-ts` ถ้าต้องการ effect system
- ใช้ `/run-verify` ถ้าจำเป็น

- References: [apis](references/apis.md) · ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `remeda` ติดตั้งเวอร์ชันล่าสุดและ import ถูกต้อง
- Data transformations ใช้ data-first/data-last ถูก context
- Pipes ใช้ lazy evaluation และ early termination อย่างมีประสิทธิภาพ
- ไม่มี deprecated APIs (`debounce`, `pathOr`) หรือ v1 renames คงค้าง
- Types narrow ถูกต้องผ่าน type-guards โดยไม่ต้อง cast
- Lint, typecheck, tests ผ่าน
