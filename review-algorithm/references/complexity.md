# Complexity Checklist — review-algorithm

## Time Complexity

- [ ] big-O ระบุชัดต่อ hot function — best/average/worst case
- [ ] nested loops — 2+ levels ที่ iterate ข้อมูลเดียวกัน = สงสัย O(n²)
- [ ] hidden O(n) — `includes`, `indexOf`, `find`, `splice`, `slice` ใน loops
- [ ] sorting ซ้ำ — `sort()` ทุก iteration vs sort ครั้งเดียว
- [ ] recursion depth — linear vs exponential (naive Fibonacci = O(2^n))
- [ ] string concat ใน loop — O(n²) ใน languages ที่ strings immutable

## Space Complexity

- [ ] allocation ต่อ call — temp arrays/objects ใน hot path
- [ ] recursion stack — depth × frame size, tail-call optimization ไม่พึ่ง (JS ไม่รองรับ)
- [ ] memoization — cache size bounded, key space ไม่ explode
- [ ] streaming vs buffering — process ทีละ chunk vs load ทั้งหมดเข้า memory

## Lower-Bound Analysis

- [ ] current vs optimal — O(n log n) sort vs O(n) counting/bucket
- [ ] preprocessing trade — build index once vs query หลายครั้ง
- [ ] early exit — found target → return, ไม่ iterate ต่อ
- [ ] lazy evaluation — compute เฉพาะที่ consume จริง

## Common Anti-Patterns

- [ ] array scan ใน loop → `Set`/`Map` lookup
- [ ] re-filter ทุก render/call → memoize หรือ pre-filter
- [ ] deep clone ทุก update → structural sharing
- [ ] sequential awaits → parallel `Promise.all` เมื่อ independent
- [ ] recompute ทุก access → cache/memoize deterministic results

## Benchmark Evidence

- [ ] ไม่ optimize โดยไม่มี profile — measure ก่อน fix
- [ ] benchmark input สมจริง — size/distribution ตรง production
- [ ] compare before/after — complexity improvement ยืนยันด้วย timing

## Detection

- grep `for`/`while` nested, `.includes`/`.indexOf`/`.find` in loops
- grep `sort()` inside loops/conditionals
- grep recursive calls without memoization

Severity: O(n²)+ on hot path = High, exponential = Critical, unnecessary O(n) lookup = Medium, missing memoization = Low–Medium
