# Remeda — Best Practices

Type-safe functional utilities — data-first/data-last dual signatures, lazy `pipe` และ compile-time narrowing

## Recommended Patterns

- data-first สำหรับ single call เสมอ (`filter(users, pred)`) — ได้ IDE autocomplete + readable; data-last เฉพาะใน `pipe` หรือส่งเป็น callback
- compose เป็น `pipe(data, ...)` เมื่อมี 2+ transforms — อ่าน top-to-bottom และได้ lazy fusion อัตโนมัติ
- จัด lazy functions ต่อเนื่องกัน (`map` → `filter` → `take`) เพื่อ early termination บน large arrays — อย่าแทรก `sortBy`/`groupBy` (non-lazy) ระหว่าง lazy runs
- ใช้ `prop("a")`/`identity()` projections แทน inline lambda ใน `sortBy`/`firstBy`/`groupByProp` — types แม่นกว่าและสั้นกว่า
- ใช้ `firstBy`/`nthBy`/`takeFirstBy` แทน `sortBy` + `first`/`take` เมื่อต้องการแค่ top-k — O(n) แทน O(nlogn)
- ใช้ type-guards (`isDefined`, `isNonNullish`, `isString`) ใน `filter`/`find` — narrow type อัตโนมัติ ไม่ต้อง cast
- `when`/`conditional` แทน ternary chains ใน pipe — `conditional` ต้องมี fallback case เสมอ (`constant(undefined)` หรือ callback)

## Common Pitfalls

- `entries`/`keys`/`values`/`identity`/`constant`/`toLowerCase` ต้อง invoke `()` เพื่อได้ data-last — `entries` เฉยๆ คือ function ไม่ใช่ผลลัพธ์; ยกเว้น type-guards ที่ headless
- `conditional` throw เมื่อไม่มี case match — ต่างจาก Lodash/Ramda ที่คืน `undefined`
- ใน lazy pipe, callback 3rd param (source array) เห็นเฉพาะ items ที่ process แล้ว — wrap `($) => map($, fn)` ถ้าต้องการ full array
- `piped(...)` ใช้เป็น function factory ไม่ได้ — TS infer input type ไม่ได้; ประกาศ wrapper function ที่เรียก `pipe` ข้างในแทน
- `purry` ไม่ type-safe — ใช้ภายใน wrapper ที่มี overload signatures เท่านั้น อย่า export ตรงๆ
- `forEach` data-last คืน input array ตัวเดิม (by reference) — ไม่ใช่ copy
- `debounce` deprecated → `funnel`; `pathOr` deprecated → `defaultTo(prop(obj, ...path), fallback)`

## Migration Notes (v1 → v2, Lodash/Ramda → Remeda)

- `*.indexed`/`*.strict` variants ถูกลบ — merged เข้า base functions (callbacks ได้ `(item, index, data)` เสมอ)
- Renames: `uniq*` → `unique*`, `toPairs`/`fromPairs` → `entries`/`fromEntries`, `flatten*` → `flat*`, `path`/`pathOr` → `prop(obj, ...path)` + `defaultTo`
- Removals: `compact` → `filter(isTruthy)`, `reject` → `filter(isNot(pred))`, `maxBy`/`minBy` → `firstBy`/`nthBy`/`takeFirstBy`, `debounce` → `funnel`
- Lodash chain `_(x).filter(f).value()` → `pipe(x, filter(f))`; Ramda `R.pipe(...)(x)` → `pipe(x, ...)`
- `difference`/`intersection` เป็น multi-set (bag) semantics — duplicates ถือเป็น items แยกกัน

## Perf Notes

- Lazy fusion ทำงานเฉพาะ data-last form ตรงๆ ใน pipe — arrow wrapper ปิด lazy ทันที
- `sort`/`sortBy` clone array ก่อน (ไม่ mutate input) — ระวัง double-clone ถ้า sort ซ้ำใน pipe
- `isDeepEqual` แพงกว่า `isShallowEqual`/`isStrictEqual` — เลือกตาม structural depth จริง
- `purry`-based custom fns รับ `lazy` evaluator เพื่อเข้าร่วม lazy pipeline ได้

## Do / Don't

| Do | Don't |
|----|-------|
| `pipe(data, map(f), take(3))` | `take(map(data, f), 3)` nesting |
| `filter(isDefined)` | `filter((x) => x !== undefined)` + cast |
| `firstBy(arr, [prop("x"), "desc"])` | `first(sortBy(arr, [prop("x"), "desc"]))` ถ้าต้องการแค่ตัวแรก |
| `sortBy(users, prop("name"))` | `sortBy(users, (u) => u.name)` เมื่อ prop ใช้ได้ |
| `conditional(x, [p, f], constant(undefined))` | `conditional` โดยไม่มี fallback |
| `funnel(cb, {minGapMs})` | `debounce` (deprecated) |
| `map(items, piped(prop("a"), add(1)))` | `piped` เป็น standalone function factory |
