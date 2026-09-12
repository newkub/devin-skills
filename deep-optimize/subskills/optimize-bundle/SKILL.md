---
name: deep-optimize-optimize-bundle
description: ลด bundle size — analyze output, code splitting, tree shaking, dedupe deps
argument-hint: "[app-or-package]"
related:
  - review-bundle
  - run-build
  - check-size
  - report-bundle
  - check-bundle-regression
  - report-before-after
---

## Goal

ลด production bundle size ของ target — วิเคราะห์ output จริง, แยก chunks, ตัด dead code และ deps ที่ซ้ำ — วัดผล before/after เสมอ

## Scope

- ใช้กับ bundler ที่ตรวจพบ: Vite / Rolldown / esbuild / Webpack / tsup
- ครอบคลุม: bundle analysis, code splitting, tree shaking, dependency dedupe, compression
- ถ้า target ไม่มี build step → skip และ report

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อนแก้

1. ทำ `/run-build` เพื่อสร้าง production output
2. วัด `dist/` size รวมและต่อ chunk ด้วย `/check-size` หรือ bundle analyzer ที่ project ใช้อยู่แล้ว
3. บันทึก top chunks, biggest deps, duplicate modules เป็น baseline

### 2. Analyze

> Goal: ระบุต้นเหตุของ size

1. หา chunks > 500 kB และ vendor chunk ที่ใหญ่ผิดปกติ
2. หา deps ที่ถูก bundle ซ้ำหลาย versions หรือ import ทั้ง package แทน named import
3. หา barrel imports ที่ดึงทั้ง library และ deps ที่ไม่ tree-shakeable
4. หา dev-only code, source maps, comments ที่หลุดเข้า production build

### 3. Split And Treeshake

> Goal: ลด initial payload ที่ user โหลด

1. route-based code splitting ด้วย dynamic `import()` สำหรับ routes/features หนัก
2. lazy load components ที่ render หลัง interaction เช่น modals, charts, editors
3. เปลี่ยนเป็น named imports, เพิ่ม `sideEffects: false` ใน packages ที่ repo ควบคุม
4. ตั้ง `manualChunks` / vendor split เฉพาะจุดที่มี evidence — ห้าม split มั่ว

### 4. Verify And Measure

> Goal: ยืนยันดีขึ้นและไม่พัง

1. `/run-build` ซ้ำแล้ว compare กับ baseline — total, per-chunk, gzip
2. smoke test ว่า lazy chunks โหลดได้จริงผ่าน dev server หรือ preview
3. ทำ `/check-bundle-regression` ถ้ามี budget config
4. ทำ `/report-before-after` ด้วยตัวเลข; ถ้า regression → revert จุดนั้น

## Rules

- ต้องมี baseline ก่อนแก้ และวัดซ้ำหลังแก้ทุกครั้ง — ห้าม optimize โดยไม่มีตัวเลข
- แก้ทีละจุดเรียง impact มาก → น้อย แยก commit ให้ bisect ได้
- preserve behavior — optimize ≠ เปลี่ยน output หรือ UX
- ไม่เพิ่ม dependency ใหม่เพื่อ optimize
- ถ้า build config เสี่ยงสูง เช่น shared chunks กระทบทุก route → ทำ `/plan` ให้ user confirm ก่อน

## Expected Outcome

- bundle เล็กลงตามตัวเลขที่วัดได้ พร้อม before/after report
- ไม่มี regression — build, typecheck, tests ผ่าน
- lazy chunks โหลดได้จริง
