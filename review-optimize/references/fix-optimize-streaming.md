# Fix Guide — Streaming And Reactive Updates

## Goal

batch stream deltas ให้ UI update ต่อ flush interval แทนต่อ token — ลด O(n²) parse-on-grow

## Scope

ใช้กับ `for await` stream loops, socket/event handlers, AI token streaming, progress callbacks ที่ update UI state ต่อ delta — SolidJS/React/Svelte ทุกตัว

## Execute

### 1. Find Stream Consumers

> Goal: หาทุกจุดที่ setState ต่อ delta

1. grep `for await`, `onmessage`, `onChunk`, `onDelta`, `.subscribe(` ใน target scope
2. นับว่าแต่ละ consumer setState กี่ครั้งต่อ event — ทุก callsite ที่ > 1 ต่อ event คือ candidate
3. เช็ค downstream work ต่อ update — markdown parse, sanitize, highlight, block parse, persist

### 2. Build Shared Flusher

> Goal: util เดียวที่ทุก consumer ใช้ — flush ต่อ interval (~50ms)

1. สร้าง `streamFlusher(onFlush)` — buffer deltas, flush ต่อ fixed interval (40-60ms หรือ rAF), expose `push()`, `flush()`, `done()`
2. `flush()` synchronous — callers ต้อง drain ก่อน state transitions (sending → done, clear placeholder)
3. `done()` = clear timer + final flush — เรียกใน `finally` เสมอเพื่อไม่ให้ tail delta หาย
4. timer cleanup ครบ — ไม่มี interval ค้างหลัง stream จบ/throw

### 3. Apply To Each Consumer

> Goal: replace per-delta setState ด้วย buffer+flush

1. เปลี่ยน `setMsgs(m => m + delta)` ต่อ token → `flusher.push(delta)` + `onFlush` ที่ setState รวม
2. จัดเรียง fallback/cleanup ให้ถูก — flush ก่อน clear placeholder, flush ก่อน setSending(false), flush ก่อน persist
3. คง ordering ของ text — buffer append ตามลำดับ delta เดิม
4. derived work (scroll follow, persist) ย้ายไปไว้ใน `onFlush` หรือหลัง flush — ไม่ใช่ต่อ delta

### 4. Verify

> Goal: render count ลด, output เหมือนเดิม

1. เทียบ render/update count ต่อ stream — ควร ≈ streamDuration/interval + 2 แทน tokenCount
2. text สุดท้ายเหมือนเดิมทุกประการ — ordering, whitespace, no dropped tail
3. stream ที่ throw → tail delta ยังถูก flush ก่อน error path
4. typecheck + tests ผ่าน

## Rules

- flush interval สั้นพอให้รู้สึก realtime (≤ 60ms) — ยาวเกินจะดูหน่วง
- ห้าม batch ข้าม message boundary — buffer ต่อ message/stream instance เดียว
- เช็ค reactive semantics — Solid `setStore` reconcile vs React `setState` batch ต่างกัน
- non-native fallback (browser preview, demo mode) ต้องทำงานเหมือนเดิม
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- UI updates ≤ ~20/วินาที แทนต่อ-token — CPU ลด, scroll smooth ขึ้น
- ไม่มี dropped/reordered deltas, stream errors ยัง flush tail
- downstream parse/sanitize ทำงานต่อ flush ไม่ใช่ต่อ token — O(n) แทน O(n²)
