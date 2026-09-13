---
name: review-frontend-improve-rendering
description: Apply rendering performance findings — re-renders, memoization, lists, lazy components
argument-hint: "[scope-or-findings]"
related:
  - review-frontend
  - run-profiler
  - run-build
  - run-test
  - report-before-after
  - deep-optimize
  - report
  - resolve-errors
---

## Goal

Apply rendering performance findings จาก `/review-frontend` — ลด unnecessary re-renders, ใช้ memoization อย่างถูกจุด, virtualize long lists, lazy-load components และลด render bottlenecks

## Scope

ใช้กับ frontend frameworks: React, Vue, Solid, Svelte — แก้ findings ด้าน re-renders, memoization, list rendering, code splitting

ไม่รวม:
- hydration cost / islands → ใช้ `subskills/fix-hydration/SKILL.md`
- CSS payload → ใช้ `references/fix-optimize-css.md`
- bundle-level analysis → ใช้ `/deep-optimize`

## Execute

### 1. Measure Baseline

> Goal: มีตัวเลขก่อนแก้ — ห้าม optimize โดยไม่มี baseline

1. รัน production build แล้วเปิด DevTools Performance panel หรือ `/run-profiler`
2. บันทึก long frames, forced reflows, commit count ต่อ interaction
3. ใช้ React DevTools Profiler หรือ equivalent หา components ที่ re-render เกิน
4. จับคู่ findings จาก `/review-frontend` (`references/rendering-performance.md`) กับ measurements จริง

### 2. Fix Re-Renders

> Goal: ลด re-renders ที่ไม่จำเป็นบน hot paths

1. เพิ่ม memoization เฉพาะจุดที่ profiler ยืนยัน (`memo`, `useMemo`, `useCallback`, Solid memos)
2. ลบ inline objects/arrays/functions ใน props ที่ทำให้ memo ไม่ทำงาน
3. ลด props drilling — ย้าย state ลงหรือใช้ composition/context ตาม pattern ของ project
4. ย้าย expensive computations ออกจาก render phase หรือ memoize
5. ถ้า Solid → พิจารณา split props; ถ้า Vue → ตรวจ reactivity boundaries

### 3. Fix Lists And Lazy Loading

> Goal: long lists และ below-fold content ไม่ block render

1. ใส่ virtualization สำหรับ lists > 100 items (`react-window`, `vue-virtual-scroller`, หรือ equivalent)
2. ใช้ `content-visibility` สำหรับ offscreen content และ `will-change` อย่างระมัดระวัง
3. dynamic import สำหรับ below-fold/heavy components พร้อม fallback (`Suspense` หรือ equivalent)
4. ใช้ `loading="lazy"` สำหรับ images และ intersection observer สำหรับ deferred content

### 4. Verify

> Goal: metrics ดีขึ้นและไม่มี regression

1. รัน `/run-build` และ `/run-test` (e2e) ถ้ามี — interactions ต้องทำงานครบ
2. วัด render metrics ใหม่แล้วเทียบ baseline ด้วย `/report-before-after`
3. ถ้า fix ใดไม่ดีขึ้นหรือเกิด regression → revert จุดนั้นแล้ว report

## Rules

- ต้องมี before/after measurements ทุกครั้ง — ไม่ optimize ก่อนมี baseline
- preserve behavior ทุก fix — optimization ห้ามเปลี่ยน output หรือ UX
- แก้ทีละ finding เรียง impact มาก → น้อย แยก commit ถ้าหลาย fix อิสระกัน
- หลีกเลี่ยง premature micro-optimizations — ใช้ primitives ของ framework ไม่สร้าง workaround
- ถ้า check ไม่ผ่าน → ทำ `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Re-renders และ long tasks ลดลงพร้อมตัวเลข before/after
- Long lists virtualized, heavy components lazy-loaded
- INP/LCP ดีขึ้นโดยไม่เสีย functionality — รายงานผลผ่าน `/report`

