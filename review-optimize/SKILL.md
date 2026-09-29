---
name: review-optimize
description: Review หา optimization opportunities ทุก layer — prioritized plan + apply พร้อม before/after
argument-hint: "[scope-or-app]"
related:
  - review-performance
  - review-bundle
  - check-bottlenecks
  - run-profiler
  - prioritize
  - report-before-after
  - deep-review-then-fix
  - loop-until-complete
  - suggest-next-action
---

## Goal

Review app/package เพื่อหา "สิ่งที่ optimize ได้จริง" ครบทุก layer — startup, render, streaming, polling/IPC, bundle, assets, native build — จัดลำดับ impact × effort แล้ว apply ผ่าน `## Fix` พร้อม before/after — review/report-only โดย default; fix หลัง user confirm (หรือเมื่อ user สั่ง optimize ตรงๆ)

## Scope

ใช้เมื่อ user ขอ "optimize", "เร็วกว่านี้", "smooth กว่านี้", "ลด memory/CPU", "ลด bundle" แบบครอบคลุม — findings คือ fix candidates โดยตรง

ขอบเขตต่างจาก skills ใกล้เคียง:

| Skill | ต่างกันตรง |
|-------|-----------|
| `/review-performance` | checklist review ทุก dimension พร้อม score — report-only, ไม่เลือกเฉพาะจุดที่คุ้มแก้ |
| `/check-bottlenecks` | วัด benchmark/profiling หาจุดช้า — ไม่ scan code patterns |
| `/review-bundle` | เฉพาะ build output/assets — ไม่ครอบ runtime/polling/native |
| `/run-profiler` | profile tool จริง — ใช้เป็น evidence input ของ review นี้ |

ไม่รวม: security → `/review-security`, feature gaps → `/review-coverage`, code quality ทั่วไป → `/review-code-quality`

## Execute

### 1. Scope And Baseline

> Goal: รู้ว่า optimize อะไร มี baseline และไม่แตะ optimization ที่ตั้งใจไว้

ทำตาม `references/scope-and-baseline.md`

### 2. Scan Startup

> Goal: boot path ไม่แบกงานที่ไม่จำเป็น — sequential awaits, eager imports, pre-paint services

ทำตาม `references/scan-startup.md`

### 3. Scan Render, CSS And Memory

> Goal: DOM/render/layout work ไม่โตตาม data — heap ไม่โตไม่รู้จบ

ทำตาม `references/scan-render.md` + `references/scan-css-layout.md` + `references/scan-memory.md`

### 4. Scan Streaming And Concurrency

> Goal: streams ไม่ re-render/re-parse ต่อ delta — งานหนักไม่ block main thread

ทำตาม `references/scan-streaming.md` + `references/scan-concurrency.md`

### 5. Scan Polling, IPC And Persistence

> Goal: timers/IPC/storage ไม่ทำงานซ้ำที่ cache, gate หรือ batch ได้

ทำตาม `references/scan-polling-ipc.md` + `references/scan-io-persistence.md`

### 6. Scan Bundle And Assets

> Goal: initial parse น้อยลง — slim imports, lazy heavies, defer assets

ทำตาม `references/scan-bundle.md` + `references/scan-assets.md`

### 7. Scan Native And Build

> Goal: release profile และ native handlers ได้ optimization เต็มในงบที่ยอมรับ

ทำตาม `references/scan-native-build.md`

### 8. Prioritize And Report Plan

> Goal: findings เป็น fix candidates พร้อม evidence — user เห็น plan ก่อนแก้

ทำตาม `references/prioritize-and-report.md` — จัด `apply now` / `needs measurement` / `deferred`

### 9. Apply And Verify

> Goal: fixes ถูก apply และวัดผลได้

ทำตาม `## Fix` ด้านล่าง เมื่อ user confirm

### 10. Report Progress

> Goal: รายงานผลจริงไม่อ้างเกิน evidence

1. `/report-before-after` — ตาราง before→after: chunk sizes, render counts, IPC calls, measurements ที่มี
2. ระบุ findings ค้าง + เหตุผล + ขั้นตอนถัดไป
3. ทำ `/suggest-next-action` — deferred items, profiling ต่อ, หรือ `/deep-review-then-fix`

## Rules

### 1. Evidence Before Optimizing

- ทุก finding ต้องมี `file:line` + cost ที่เข้าใจได้ — ห้าม optimize จาก assumption
- baseline ก่อนแก้เสมอ — ไม่มีตัวเลขเดิม = ไม่มี before/after ที่พิสูจน์ได้
- ไม่ undo existing optimizations (lazy loading, chunk splits, debounce, pooling) โดยไม่วัด — comments ที่อธิบายเหตุผลคือ constraints

### 2. Preserve Behavior

- optimize ≠ เปลี่ยน output — functionality, sanitization, persistence, fallback paths เหมือนเดิม
- fixes ที่แตะ timers/polling/streams ต้องมี cleanup + lifecycle ครบ
- fixes ที่แตะ reactive semantics ต้องเช็ค tracking — re-render ผิดเพี้ยน = bug ใหม่
- fixes ที่แตะ native bridge ต้องรักษา non-native fallback (browser preview, SSR)

### 3. Incremental And Measurable

- แก้ทีละจุดเรียง impact มาก → น้อย — batching/virtualization ก่อน micro-optimizations
- ห้ามรวมหลาย fix ที่แยกผลไม่ได้ในครั้งเดียว — regression จะหาจุดไม่เจอ
- fix ไหนไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report

### 4. Scope Discipline

- รายงานเฉพาะ findings ที่ target มีจริง — skip dimensions ที่ไม่มี
- shared packages/workspace deps นอก target → info เท่านั้น ไม่แก้เงียบ
- pre-existing uncommitted changes ของ user ห้าม reset/overwrite
- ใช้ `/loop-until-complete` เมื่อ verify ต้อง iterate — แต่หยุดก่อน over-engineer

## Fix

> ทำ section นี้เมื่อ user confirm ให้แก้ findings หรือสั่ง optimize ตรงๆ — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

แก้ findings ที่อยู่ในกลุ่ม `apply now` ตาม recipe ใน `references/patterns.md` — map symptom → recipe แล้ว apply ตรงๆ; symptom ที่ไม่มีใน catalog ให้แก้ตาม finding recommendation

### Fix Order

1. baseline ก่อนแก้เสมอ (จาก step 1 ของ Execute)
2. แก้ทีละ finding เรียง impact — verify หลังแต่ละ fix ก่อนไปต่อ
3. verify รวมท้ายงานตาม `references/verify-and-measure.md` — typecheck + lint + tests + build, เทียบ measurements กับ baseline; regression → revert จุดนั้น

## References

- [Scope and baseline](references/scope-and-baseline.md)
- [Scan startup](references/scan-startup.md)
- [Scan render](references/scan-render.md)
- [Scan CSS and layout](references/scan-css-layout.md)
- [Scan memory](references/scan-memory.md)
- [Scan streaming](references/scan-streaming.md)
- [Scan concurrency](references/scan-concurrency.md)
- [Scan polling and IPC](references/scan-polling-ipc.md)
- [Scan I/O and persistence](references/scan-io-persistence.md)
- [Scan bundle](references/scan-bundle.md)
- [Scan assets](references/scan-assets.md)
- [Scan native and build](references/scan-native-build.md)
- [Prioritize and report](references/prioritize-and-report.md)
- [Verify and measure](references/verify-and-measure.md)
- [Patterns catalog](references/patterns.md)
- [Full-dimension checklist](references/checklist.md)

## Expected Outcome

- Prioritized findings table — ทุก row มี evidence, impact, effort, risk
- `apply now` fixes ถูก apply พร้อม before/after numbers (bundle bytes, flush counts, IPC calls)
- Verification ผ่านครบ (typecheck/lint/test/build) หรือ report สิ่งที่ค้าง + สาเหตุ
- Deferred list พร้อมเหตุผล — ไม่มี fixes เสี่ยงสูงโดยไม่บอก user
- ทำ `/suggest-next-action` ชี้ deferred work หรือ measurement ถัดไป
