# es-toolkit Best Practices

## Import Hygiene

- do: named imports `import { chunk, pick } from 'es-toolkit'` — bundler tree-shakes เหลือเฉพาะฟังก์ชันที่ใช้ (เล็กกว่า lodash ถึง ~97%)
- do: ใช้ submodule path เมื่อต้องการชัดเจนหรือกัน circular resolve: `es-toolkit/array`, `es-toolkit/function`, `es-toolkit/promise`, `es-toolkit/predicate`, `es-toolkit/object`, `es-toolkit/string`, `es-toolkit/math`, `es-toolkit/iterator`, `es-toolkit/map`, `es-toolkit/set`, `es-toolkit/error`, `es-toolkit/util`, `es-toolkit/bigint`, `es-toolkit/query-string`
- don't: `import * as _ from 'es-toolkit'` หรือ import ทั้ง barrel เข้า runtime ที่ไม่ bundle (Node ESM ตรงๆ) ถ้าไม่จำเป็น — ยอมโหลดทั้งโมดูลโดยไม่จำเป็น
- note: รองรับ ESM + CJS dual, ไม่มี peer deps — ใช้งานใน Node, Bun, Deno (ผ่าน JSR), browser bundlers ได้ทันที

## Core Vs Compat

- do: greenfield → core เท่านั้น; legacy lodash → swap import path เป็น `es-toolkit/compat` ก่อนทั้ง repo (ลด risk ต่อ commit), แล้วค่อย migrate กลับ core ทีละไฟล์
- do: ตั้ง lint rule (no-restricted-imports) ห้าม add `es-toolkit/compat` ในไฟล์ใหม่ระหว่าง phase migrate
- don't: ผสม core กับ compat ในไฟล์เดียว — semantics บางตัวต่างกัน (เช่น `clone` ของ core รู้จัก Map/Set/TypedArray; compat เน้นพฤติกรรม lodash)
- note: ฟังก์ชันที่ compat ไม่มี: `sortedUniq`, `mixin`, `noConflict`, `runInContext` — พวกนี้ควรหายไปจากการออกแบบอยู่แล้ว

## Performance

- do: เชคก่อนคาดหวังว่า "เร็วทุกตัว" — จุดแข็งคือ array/object ที่ modern engine optimize (2-3× vs lodash ตาม official benchmark) แต่ big-O บางฟังก์ชันเท่ากับ lodash; งาน hot path ให้รัน benchmark จริง (`es-toolkit.dev/performance.html` มี source)
- do: ใช้ `limitAsync` / concurrency options ของ `mapAsync` ควบคุม parallel fetch แทน `Promise.all` บน array ใหญ่
- do: ข้อมูลเยอะ/stream → iterator API (`es-toolkit/iterator`) แบบ lazy แทน materialize array แล้ว map/filter chain
- don't: เรียก `debounce`/`memoize` ใน render loop หรือ factory ซ้ำๆ — ได้ instance ใหม่每次都เสีย cache; สร้างครั้งเดียวอยู่นอก loop

## Timing And Async

- do: `debounce` คืนฟังก์ชันมี `.cancel()` และ `.flush()` — เรียก `.cancel()` ตอน unmount/cleanup; เรียก `.flush()` เมื่อต้องการส่งค่าค้างก่อนนำทาง
- do: ใช้ `signal` option ของ `debounce`/`delay` ผูกกับ AbortController lifecycle แทน manual cancel หลายจุด
- do: timeout ใช้ `withTimeout(promise, ms)` แล้ว catch `TimeoutError` (import จาก `es-toolkit/error`) — แยกจาก `AbortError` ได้ชัดเจน
- do: critical section in-process ใช้ `Mutex.runExclusive`; resource pool ใช้ `Semaphore` — อย่า lock ข้าม process (ไม่ทำได้)
- note: `retry` รองรับ backoff options — ตั้ง cap รวม (timeout ฝั่ง caller) เสมอเพื่อ avoid unbounded retry

## Type Safety

- do: เปิด `strict` ใน tsconfig — `isNotNil` เป็น type predicate ที่ narrow กับ `.filter(isNotNil)` (native filter) ได้จริง
- don't: เขียน `arr.filter(x => x != null)` ซ้ำๆ เมื่อมี `isNotNil` — loses narrowing ถ้าไม่ annotate
- do: `pick`/`omit` infer literal key types — ส่ง keys เป็น array literal (`pick(obj, ['a', 'b'])`) ไม่ใช่ variable ที่ widen เป็น `string[]`
- do: แปลง API response keys ด้วย `toCamelCaseKeys`/`toSnakeCaseKeys` (deep, ครั้งเดียวที่ boundary) แทน map เองทีละ field

## Equality And Cloning

- do: `isEqual` เทียบลึกใช้กับ data primitives; สำหรับ domain object ที่มี `valueOf`/class instances ให้ตรวจ semantics ก่อน (ไม่ recursive แบบ arbitrary class เท่ากับ lodash ทุกกรณี)
- do: immutable merge ใช้ `toMerged`; ถ้าตั้งใจ mutation เหมือน lodash ใช้ `merge` — และเขียน comment ระบุเพราะชื่อ same แต่ behavior ต่างจากที่นักพัฒนา React/immutable คาด
- don't: `clone` (ตื้น) กับ nested state แล้วคิดว่าจะ decouple — ใช้ `cloneDeep`; sentinel ที่ต้อง freeze ทั้ง subtree ใช้ `deepFreeze`
- note: `sortKeys` เป็น shallow sort; key-case converters (`toCamelCaseKeys` ฯลฯ) ทำงานลึกและคืน object ใหม่

## Migration From Lodash

1. เปลี่ยน import ทั้งหมดเป็น `es-toolkit/compat` → รัน test ทั้ง suite (behavior ต้องเท่าเดิม)
2. ลิสต์ฟังก์ชันที่ใช้จริง (`rg "from 'lodash'"` / knip) → จับคู่กับ core API: ชื่อตรงกันย้ายก่อน (`chunk`, `debounce`, `pick`, `merge` — ระวัง mutation semantics)
3. ชื่อต่าง/ไม่มีใน core → จัดการรายตัว: `_.isEmpty` → `isNotNil`+length checks หรือคง compat; `_.chain` → native method chaining; `_.template` → redesign
4. เอา lodash ออกจาก package.json → วัด bundle ด้วย `/follow-tool-sonda` หรือ node-modules-inspector เทียบก่อน-หลัง
5. ลบ compat ทีละไฟล์เมื่อไม่อ้างถึง → ปิดงานด้วย `/run-verify`

## Pitfalls

- `pull`, `remove`, `fill` (บาง overload) mutate array ต้นทาง — ไม่ใช่ immutable ทุกตัวเหมือนเข้าใจผิดทั่วไป; ตรวจ docs รายฟังก์ชันก่อนใช้ใน state pipeline
- `range(0, n)` แบบ lodash มี exclusive end เหมือนกัน แต่ `rangeRight`, `fill` semantics เล็กน้อยต่าง — เขียน test คุมตอนย้าย
- ไม่มี `_.chain`/wrapper object — ออกแบบเป็น function calls ทาบ native methods
- es-toolkit ยัง major-version 1.x — API ใหม่เพิ่มได้เรื่อย ๆ ด้วย minor; live-check `/deep-research` เมื่อเจอฟังก์ชันใน docs ที่ไม่มีในเวอร์ชันติดตั้ง
