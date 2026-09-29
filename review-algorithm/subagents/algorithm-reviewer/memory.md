# Memory And Allocation Checklist — review-algorithm

## Allocation In Loops

- [ ] temp objects per iteration — `{...}`, `[]`, closures ใน hot loops → GC pressure
- [ ] string building — `+=` vs `join()`/`StringBuilder`/template accumulation
- [ ] array operations — `map`+`filter`+`reduce` chains → intermediate arrays per step
- [ ] boxing/primitives — wrapper objects ใน loops (`new Number`, `new String`)
- [ ] regex creation — `new RegExp` หรือ literal ใน loop (recompile ทุกครั้ง)

## Large Copies

- [ ] `slice`/`clone`/`structuredClone` ของ structures ใหญ่ — copy-on-write หรือ reference แทน
- [ ] spread chains — `[...arr, x]` ใน loop = O(n²) copies
- [ ] `JSON.parse(JSON.stringify(obj))` — deep clone cost + loses types (Date, Map, undefined)
- [ ] serialization round-trips — serialize→deserialize ทุก call vs shared reference

## Unbounded Growth

- [ ] caches ไม่มี cap — `Map`/`Object` ที่เติมตลอดไม่ลบ → memory leak
- [ ] event listeners — add แต่ไม่ remove, accumulate across renders
- [ ] buffers/accumulators — grow ตลอด process lifetime
- [ ] memoization unbounded — cache ทุก input ไม่มี eviction
- [ ] closure capture — ตัวแปรใหญ่ captured ใน closure ที่ live นาน

## GC Pressure

- [ ] allocation rate vs GC — short-lived objects สร้างเร็วกว่า GC collect
- [ ] generational hypothesis — young objects cheap, long-lived promoted → expensive
- [ ] memory leaks — detached DOM, timers, subscriptions ที่ไม่ cleanup
- [ ] object pooling — hot objects reuse แทน allocate-new (ถ้า GC-bound)

## Streaming Vs Buffering

- [ ] load-all vs stream — file/response ใหญ่ควร stream ไม่ใช่ buffer ทั้งหมด
- [ ] pagination — fetch ทีละหน้า vs query ทั้ง table
- [ ] lazy iteration — generators/iterators vs materialize array ก่อน
- [ ] backpressure — producer เร็วกว่า consumer → buffer ล้น

## Data Structure Memory

- [ ] contiguous vs linked — arrays (cache-friendly) vs linked lists (pointer overhead)
- [ ] hash table load factor — 70%+ → resize thrashing, collisions
- [ ] sparse vs dense — `[]` holes vs `Map` สำหรับ sparse keys
- [ ] typed arrays — `Uint8Array`/`Float64Array` vs regular arrays สำหรับ numeric data

## Detection

- memory profiler — heap snapshots, allocation timeline, retained objects
- grep `new`/`[]`/`{}`/spread in loops, `JSON.parse(JSON.stringify`
- monitor GC metrics — heap growth, GC frequency, pause times

Severity: memory leak on hot path = Critical, unbounded cache = High, O(n²) copies = High, allocation churn = Medium
