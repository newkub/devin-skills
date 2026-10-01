# fast-check — Best Practices

Property-based testing — arbitraries, invariants และ shrink discipline

## Recommended Patterns

- เขียน properties ที่เป็น invariant จริง — `fc.assert(fc.property(arb, (x) => pred(x)))` — ไม่ใช่แค่ "ไม่ throw"
- Arbitraries เลือกให้ cover edge space: `fc.integer()`, `fc.string()`, `fc.array()`, `fc.record()` + compose ด้วย `fc.tuple`/`fc.oneof`/`fc.constantFrom`
- ใช้ `fc.pre(condition)` เมื่อต้อง filter inputs — อย่า generate แล้วทิ้งเยอะ (skew distribution)
- `fc.asyncProperty` สำหรับ async code — อย่า wrap async ใน sync property
- Reproduce failures ด้วย `seed` + `path` ที่ fast-check print — log ไว้ใน CI artifacts

## Common Pitfalls

- Properties ต้อง pure — side effects ใน property → non-deterministic shrinks
- Shrinking คือจุดแข็ง — ถ้า custom arbitrary ไม่ shrink (built via `.map` หนักๆ) ใช้ `.filter`+`fc.base64String` ฯลฯ หรือ `fc.constant` bounds
- `fc.date()`/`fc.object()` default กว้างมาก — constrain ranges (`min`, `max`, `size`) ให้ตรง domain
- อย่าสร้าง arbitraries ภายใน test loop — hoist ออกมา const เดียว
- `numRuns` default 100 พอ smoke; CI regression ขึ้น 1000+ สำหรับ critical invariants

## Integration

- เขียน property spec เมื่อ function มี invariant (roundtrip, idempotent, ordering, bounds) — ไม่ใช่ทุก function
- ใช้ร่วม unit tests — example-based สำหรับ known cases + property สำหรับ edge coverage
- Failure output ให้ minimal counterexample — copy ลง test เดิมเป็น regression example

## Do / Don't

| Do | Don't |
|----|-------|
| invariants (roundtrip, idempotent, sorted) | properties ที่ assert trivial (`x === x`) |
| `fc.pre` / constrained arbs | reject 90% inputs |
| seed+path reproduce | ignore failure logs |
| composed arbitraries (`oneof`, `tuple`) | generate เองด้วย Math.random |
