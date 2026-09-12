---
name: review-bundle-optimize-bundle
description: Apply bundle findings — dedupe deps, code splitting, lazy loading, tree shaking
argument-hint: "[app-or-package]"
related:
  - review-bundle
  - run-build
  - report-bundle
  - check-bundle-regression
  - report-before-after
---

## Goal

แก้ findings จาก `/review-bundle` จริง — dedupe dependencies, เพิ่ม code splitting, lazy load ของหนัก, แก้ tree shaking — วัดผล before/after เสมอ

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: duplicate deps, missing splits, barrel imports, non-shakeable deps, compression/cache headers
- multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Baseline

> Goal: เก็บ bundle numbers เดิม

1. ทำ `/run-build` + bundle analyzer — บันทึก sizes ต่อ chunk และ biggest deps
2. map findings → severity จาก review report แล้วเรียง impact มาก → น้อย

### 2. Dedupe Dependencies

> Goal: ตัด dep ที่ bundle ซ้ำหรือหนักเกิน

1. หา deps ที่ resolve หลาย versions — align เป็น version เดียว หรือใช้ `overrides`/`resolutions` ของ package manager
2. เปลี่ยน deps หนักเป็น lightweight alternative เมื่อ API เท่ากัน — ตรวจ tech stack catalog ก่อนเลือก
3. ตัด deps ที่ import แต่ไม่ได้ใช้จริง

### 3. Split And Lazy Load

> Goal: ลด initial payload

1. route-based splitting ด้วย dynamic `import()` สำหรับ routes ที่ findings ชี้
2. lazy load heavy features หลัง interaction — charts, editors, modals, third-party widgets
3. แก้ barrel imports ที่ดึงทั้ง library → named/direct imports
4. vendor/manual chunks เฉพาะจุดที่มี evidence — ห้าม split มั่วเพราะกระทบ cache hit rate

### 4. Verify And Measure

> Goal: ยืนยันเล็กลงและโหลดได้จริง

1. `/run-build` ซ้ำ compare กับ baseline — total, per-chunk, gzip/brotli
2. smoke test lazy chunks โหลดได้จริงผ่าน preview/dev server
3. ทำ `/check-bundle-regression` ถ้ามี budget
4. ทำ `/report-before-after`; ถ้า regression → revert จุดนั้น

## Rules

- แก้เฉพาะ findings ที่มี bundle evidence — size, chunk name หรือ config line
- preserve behavior — ทุก route/feature ต้องทำงานเหมือนเดิม
- แยก commit ต่อ fix group: dedupe → splitting → lazy → compression
- ไม่เพิ่ม dependency ใหม่เพื่อ optimize
- fix-verify loop สูงสุด 3 รอบต่อ finding → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- bundle เล็กลงตามตัวเลขที่วัดได้ ไม่มี duplicate deps
- lazy chunks โหลดได้จริง ไม่มี regression
- report before/after ครบทุก finding
