# review-optimize — Full Dimension Checklist

## 1. Scope And Baseline

- [ ] target scope ชัด (app/package/feature)
- [ ] baseline เก็บไว้ (chunk sizes, build/test times, profiler output)
- [ ] existing optimizations inventory — deliberate patterns ไม่ถูก undo

## 2. Startup And Boot

- [ ] entry file ไม่มี eager imports ของหนัก
- [ ] independent `await`s เป็น `Promise.all`
- [ ] non-critical services defer เป็น idle
- [ ] ไม่มี sync I/O block first paint
- [ ] fonts ที่ใช้เฉพาะ feature ไม่ load ตอน boot

## 3. Render And DOM Scaling

- [ ] DOM nodes bound ที่ viewport ไม่โตตาม data
- [ ] lists ใหญ่ virtualize พร้อม scroll-height spacers
- [ ] ไม่มี `Math.max(...arr)` / spread บน arrays ใหญ่
- [ ] density views bucket/sample ที่ fixed max
- [ ] derived compute cache/memoize ไม่ re-run ซ้ำต่อ evaluation

## 4. CSS And Layout

- [ ] `content-visibility`/`contain` บน large offscreen subtrees
- [ ] animations ใช้ `transform`/`opacity` ไม่ใช่ layout properties
- [ ] `will-change` ไม่ถาวร — apply/remove รอบ animation
- [ ] scroll/touch handlers passive + throttled
- [ ] ไม่มี layout read/write interleave ต่อ event

## 5. Memory

- [ ] long-lived maps/caches มี cap + eviction
- [ ] listeners/timers มี cleanup ครบทุก exit path
- [ ] hidden views ไม่ retain parsed content หนัก
- [ ] ไม่มี allocation churn บน hot paths

## 6. Streaming And Reactive

- [ ] stream deltas batch ต่อ flush interval ไม่ใช่ต่อ token
- [ ] re-parse (markdown/sanitize/highlight) ต่อ flush ไม่ใช่ต่อ delta
- [ ] persistence debounce, scroll-follow ต่อ flush
- [ ] stream teardown: `finally` flush + cleanup ครบ

## 7. Concurrency

- [ ] CPU work หนัก offload worker/`spawn_blocking` ไม่ block main thread
- [ ] independent awaits ขนานกันนอก startup ด้วย
- [ ] ไม่มี blocking I/O ใน async handlers, ไม่มี lock ข้าม await
- [ ] task spawn/channel capacity bounded

## 8. Polling, IPC And Persistence

- [ ] static bridge values cache ครั้งเดียว
- [ ] polls gate ด้วย `document.visibilityState` เมื่อผลลัพธ์ไม่ visible
- [ ] refresh ครั้งเดียวตอน visible กลับมา
- [ ] native polls ใช้ narrow refresh (specifics) ไม่ใช่ full enumerate
- [ ] storage writes debounce/batch, flush-on-exit ครบ
- [ ] ไม่มี N+1 หรือ sync I/O บน hot paths
- [ ] timers cleanup ครบใน unmount

## 9. Bundle And Chunks

- [ ] full-library imports → core + registered subset
- [ ] shared instance เดียวต่อ lib ข้าม features
- [ ] heavies (mermaid/katex/xterm/icons) เป็น separate lazy chunks
- [ ] build target ตรง runtime จริง
- [ ] entry chunk ไม่ดึง heavy modules ผ่าน barrel files

## 10. Assets

- [ ] font families ที่ไม่ใช่ UI default defer
- [ ] `font-display` ครบ, subset สำหรับ unicode ที่ใช้
- [ ] icon strategy — per-icon ไม่ใช่ทั้ง JSON set ใน entry
- [ ] images lazy + modern formats + `width`/`height` ครบ
- [ ] media `preload` policy + poster

## 11. Native And Build Profile

- [ ] release: `opt-level=3`, `lto="thin"`, `codegen-units=1`, `strip`, `panic="abort"`
- [ ] native `invoke` handlers ไม่ block IPC thread
- [ ] dev-only work ไม่รันใน prod path
- [ ] hot path allocations bound

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
- findings ที่ user ตั้งใจไว้ (deliberate) ไม่นับเป็น fail — ระบุเป็น constraint
