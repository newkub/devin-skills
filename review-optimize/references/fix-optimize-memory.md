# Fix Guide — Memory

## Goal

bound heap growth — evict caches, cleanup listeners, release retention

## Scope

ใช้กับ unbounded stores, listener/timer leaks, large retention, allocation churn — JS/TS และ native sides

## Execute

### 1. Bound Long-Lived Stores

> Goal: maps/caches ไม่โตไม่รู้จบ

1. เพิ่ม capacity + eviction — LRU (Map insertion-order trick: `set` → `delete`+`set` ให้หัว, `delete` ตัวแรกเมื่อเกิน cap), TTL, หรือ size cap
2. history/dedup buffers → ring buffer ขนาดคงที่
3. session/tab-scoped data → cleanup เมื่อ scope ตาย (onCleanup, unmount, disconnect)
4. ค่า cap ให้สมเหตุสมผลกับ UX — เช่น undo history 50-100 entries, message cache ต่อ conversation

### 2. Fix Listener And Timer Leaks

> Goal: mount/unmount symmetry ครบ

1. audit ทุก `addEventListener`/`listen`/`on`/`setInterval`/`setTimeout` — ต้องมี removal ใน cleanup เดียวกัน
2. Solid: `onCleanup`; React: effect return; นอก component: explicit `destroy()`/unlisten handle
3. listeners ที่ mount ต่อ reconnect → dedup หรือ teardown ก่อน re-register
4. ตรวจ leak ด้วย mount/unmount loop — count listeners/handlers ก่อนและหลัง

### 3. Release Retention

> Goal: hidden/inactive views ไม่ถือข้อมูลหนัก

1. suspended/hidden tabs → drop parsed content เก็บเฉพาะ state ที่ต้อง restore (ใช้ WeakRef/WeakMap เมื่อ GC ตัดสินได้)
2. detached DOM refs → null out ใน cleanup
3. closures ใน registries → เก็บ id/lookup แทน capture object ทั้งก้อน
4. webview pools → reuse instance แทนสร้างใหม่, drop buffers เมื่อ suspend

### 4. Reduce Allocation Churn

> Goal: hot paths ไม่ allocate ต่อ event

1. hoist literals/formatters/regex ออกจาก render/tick bodies → module scope
2. reuse buffers แทน spread/copy — in-place update เมื่อ semantics อนุญาต
3. string concat ใน loop → array join หรือ incremental write
4. เช็ค reactive state shape — store flat แทน deep clone ต่อ update (Solid `produce`, normalized entities)

### 5. Verify

> Goal: heap plateau แทน sawtooth growth

1. mount/unmount cycle ×N → heap/listener count กลับมาใกล้เดิม
2. long session → memory นิ่งหลัง warm-up (ไม่ linear growth)
3. hidden views → retained size ลดเมื่อ suspend
4. typecheck + tests ผ่าน — behavior เหมือนเดิม

## Rules

- เลือก cap ตาม semantics ไม่ใช่ตัวเลขสวย — ระบุเหตุผลใน code comment
- WeakRef/WeakMap เมื่อ "nice to have" เท่านั้น — ห้ามใช้กับ required data (GC ไม่ deterministic)
- cleanup ต้องครบทุก exit path — unmount, error, abort, reconnect
- อย่า drop data ที่ restore ไม่ได้ (unsaved state, in-flight work)
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- heap นิ่งหลัง warm-up — ไม่มี linear growth ต่อ session
- listeners/timers กลับสู่ baseline หลัง unmount
- hidden views ถือเฉพาะ restore state ไม่ใช่ parsed content ทั้งก้อน
