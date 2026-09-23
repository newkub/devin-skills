# Fix Guide — Polling, IPC And Startup

## Goal

ลดงานซ้ำ — cache ค่าคงที่, gate ตอน hidden, parallelize boot, defer non-critical work

## Scope

ใช้กับ timers/pollers, IPC/bridge calls, startup sequences — โดยเฉพาะ Tauri/Electron/native-bridge apps

## Execute

### 1. Cache Static Bridge Values

> Goal: `invoke` ค่าที่ไม่เปลี่ยนเรียกครั้งเดียว

1. หา `invoke`/`bridge` calls ที่ return ค่าเดิมตลอด app lifetime — ports, config, capabilities, version
2. สร้าง cached helper — call once, เก็บ resolved value, return `0`/fallback เมื่อ bridge ไม่มี (browser preview, SSR, tests)
3. migrate ทุก callsite เข้า helper เดียว — grep ยืนยันไม่มี direct call ค้าง
4. invalidate เฉพาะเมื่อค่าเปลี่ยนได้จริง (reconnect, restart) — ถ้า fix ตั้งแต่ init ไม่ต้องมี

### 2. Gate Work While Hidden

> Goal: ไม่เผา CPU/webview evals ตอนไม่มีใครดู

1. wrap poll bodies ด้วย `document.visibilityState === "hidden"` early-return — เฉพาะงานที่ผลลัพธ์ไม่ visible (stats chips, media badges, probes)
2. refresh ครั้งเดียวตอน `visibilitychange` → `visible` — UI ไม่ stale เมื่อกลับมา
3. ห้าม gate: work ที่ต้องรันต่อเนื่อง (timers, sync, recording, alerts) — เช็ค semantics ก่อน
4. เช็ค platform — `document.visibilityState` ใน webview/background context อาจต่างกัน

### 3. Parallelize Independent Init

> Goal: sequential `await` chain → concurrent registration

1. หา `await` ต่อเนื่องของ independent calls — `listen()`, `invoke`, fetches ที่ไม่พึ่งกัน
2. รวมเป็น `Promise.all` — คง order ของ side effects ที่พึ่งกันไว้ sequential
3. รักษา cleanup — unlisten functions จาก `Promise.all` ต้องถูกเก็บและเรียกครบ
4. calls ที่ต้องรันก่อน (hydration, port assignment) คงไว้หลัง `Promise.all` เหมือนเดิม

### 4. Defer Non-Critical Startup

> Goal: first paint เร็ว — services เริ่มตอน idle

1. แยก core (theme, listeners, routing) vs non-critical (schedulers, sync, reminders, heavy imports)
2. `requestIdleCallback ?? (f => setTimeout(f, 2000))` — defer services, font faces, heavy dynamic imports
3. split idle work เป็น slices — ไม่รวมทุกอย่างใน callback เดียวถ้าบางส่วนหนัก
4. cold-start paths (deep links, file-open) ต้องยังทำงาน — deferred services อาจต้อง handle late init

### 5. Narrow Native Refreshes

> Goal: native polls ทำเฉพาะที่ต้องใช้

1. `refresh_processes(All)` full detail → `refresh_processes_specifics` เฉพาะ fields ที่ frontend ใช้ (name, memory)
2. enumerate-once แทน per-item calls — batch, reuse handles
3. sync work ใน `invoke` handlers → `spawn_blocking`/async เมื่อ block IPC thread

### 6. Verify

> Goal: boot เร็วขึ้น, poll cost ลด, behavior เหมือนเดิม

1. นับ IPC calls ต่อ tick/startup — cache ทำงาน, parallelize ลด rounds
2. hide window → poll skips, show → refresh ครั้งเดียว
3. cold start + deep link + deferred services ทำงานครบหลัง idle
4. typecheck + lint + tests + build ผ่าน

## Rules

- รักษา non-native fallback — helpers ต้องทำงานเมื่อ `window.__TAURI__`/bridge ไม่มี
- `requestIdleCallback` อาจไม่มี → fallback `setTimeout`
- deferred services ต้อง start ได้แม้ idle ไม่มาเร็ว — timeout cap
- ห้าม gate work ที่มี side effects นอก UI (sync, logging, timers ที่คนอื่นพึ่ง)
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- bridge/IPC calls ลดจาก O(ticks × items) เป็น O(1) สำหรับค่าคงที่
- ไม่มี native/webview work ตอน window hidden
- startup IPC rounds ลด, non-critical work ไม่แข่งกับ first paint
