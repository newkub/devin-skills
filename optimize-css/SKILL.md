---
name: optimize-css
description: ลด CSS payload — unused rules, critical CSS, dedupe และ utility coverage
argument-hint: "[path-or-bundle]"
related:
  - follow-lib-css
  - optimize-bundle
  - follow-lib-unocss
  - optimize-web-vitals
  - report-before-after
---

## Goal

ลด CSS ที่ส่งไป browser — ลบ unused rules, extract critical CSS, dedupe declarations และ tune utility framework coverage

## Scope

- ตรวจ CSS output: bundles, CSS files, `<style>` blocks, utility CSS (Tailwind/UnoCSS), CSS-in-JS
- ครอบคลุม: unused selectors, duplicate rules, missing minification, render-blocking CSS, over-broad resets
- Action-oriented: แก้จริง — วัดขนาดก่อน-หลัง

## Execute

### 1. Measure CSS Payload

> Goal: วัด CSS ที่ส่งจริงต่อ page

1. วัดขนาด CSS output จาก build — แยก per-bundle/per-route
2. ใช้ coverage tools (DevTools Coverage, `unlighthouse`) หา unused %
3. flag: single monolithic CSS ที่ทุก route โหลด, multiple reset/normalize ซ้อน

### 2. Find Waste

> Goal: หา CSS ที่ไม่จำเป็น

1. **Unused selectors**: rules ที่ไม่ match element ไหนใน pages จริง
2. **Duplication**: declarations ซ้ำข้ามไฟล์, vendor prefixes เกิน (autoprefixer targets เก่า)
3. **Utility bloat**: Tailwind/UnoCSS safelist กว้างเกิน, dynamic classes ที่ทำ purge ไม่ได้
4. **Legacy**: IE-era hacks, unused vendor prefixes, dead theme variants
5. **CSS-in-JS**: runtime-generated styles ที่ static ได้

### 3. Apply Optimizations

> Goal: ลด payload ตาม impact

1. **Purge/prune**: purgecss หรือ utility framework content config — ขยาย `content` globs ให้ครบแต่ไม่เกิน
2. **Critical CSS**: inline above-fold styles, defer ที่เหลือ (`media` trick หรือ critters/beasties)
3. **Split**: route-level CSS splitting — โหลดเฉพาะที่ page ใช้
4. **Dedupe**: merge duplicate rules, ลบ vendor prefixes สำหรับ targets ที่ไม่รองรับแล้ว
5. **Minify**: ตรวจ cssnano/lightningcss เปิดจริงใน production build
6. **Modern**: ใช้ modern CSS (`:is()`, `clamp()`, container queries) แทน verbose fallbacks ตาม `/follow-lib-css`

### 4. Verify

> Goal: ยืนยัน visual ไม่พังและขนาดลด

1. `/run-build` — เทียบ CSS bytes
2. `/run-test-visual` หรือ manual spot-check pages — unused removal เสี่ยงลบ styles ที่ dynamic
3. `/report-before-after` แสดง payload delta + coverage %

## Rules

### 1. Visual Safety

- Unused CSS removal เสี่ยง false positives (dynamic classes, JS-injected) — verify ด้วย visual tests
- Safelist patterns ที่จำเป็นแทนการปิด purge ทั้งหมด

### 2. Measure First

- วัด payload + coverage ก่อนแก้ — รายงานตัวเลขจริง
- แยก blocking vs non-blocking CSS ใน analysis

### 3. Stack Aware

- ใช้ tooling ของ framework ที่มี (UnoCSS/Tailwind config, bundler CSS pipeline) — ไม่เพิ่ม tool ถ้าของเดิมทำได้
- SSR/inline styles ต้องเข้าใจ hydration impact

## Expected Outcome

- CSS payload ลดลงพร้อมตัวเลข before/after
- Critical path CSS ถูกจัดการ — non-critical defer
- ไม่มี visual regressions
