---
name: review-frontend-improve-hydration
description: Fix hydration issues — root-cause mismatches, ลด hydration scope, SSR safety
argument-hint: "[scope-or-findings]"
related:
  - review-frontend
  - run-build
  - run-test
  - report-before-after
  - resolve-errors
---

## Goal

แก้ hydration findings จาก `/review-frontend` จริง — root-cause mismatches, ลด hydration scope, SSR/client parity — verify ด้วย build + browser จริง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: hydration mismatches, SSR-unsafe code, unnecessary hydration, islands strategy
- rendering perf ทั่วไป → `../improve-rendering/SKILL.md`

## Execute

### 1. Baseline

> Goal: รู้ hydration cost + mismatches จริง

1. `/run-build` production — hydration errors ใน console, mismatch warnings
2. list components ที่ hydrate ทั้งหมด vs ที่ interactive จริง
3. จับคู่ findings กับ error output

### 2. Fix Mismatches

> Goal: server HTML = client first render

1. SSR-unsafe access (`window`, `localStorage`, `Date.now()`, random) → guard ด้วย mount-check หรือ `suppressHydrationWarning` เฉพาะจุดจริง
2. DOM-nesting violations (`<p>` ครอบ `<div>`, `<a>` ซ้อน `<a>`) — แก้ markup
3. locale/timezone rendering — format ฝั่งเดียวกันหรือ defer ไป client-only

### 3. Reduce Hydration Scope

> Goal: hydrate เฉพาะที่ interactive

1. static sections → server-only components (RSC/SSG) หรือ islands
2. client-only components → dynamic import `ssr:false` เมื่อไม่จำเป็นต้อง SSR
3. third-party widgets → lazy hydrate บน interaction/visibility

### 4. Verify

> Goal: ไม่มี mismatch + perf ดีขึ้น

1. `/run-build` + browser console สะอาด — zero hydration errors
2. `/run-test` (e2e) ผ่าน + `/report-before-after` — mismatch count + JS payload เทียบ baseline

## Rules

- root cause ก่อน — ห้าม `suppressHydrationWarning` ปิด symptom ถ้าแก้ markup ได้
- preserve visual output — SSR HTML ต้องเหมือนเดิมเว้น finding คือ markup เอง
- แยก commit: mismatch fixes → scope reduction
- fix-verify loop สูงสุด 3 รอบ → ไม่ผ่าน `/resolve-errors` แล้ว report

## Expected Outcome

- Zero hydration mismatches/warnings ใน console
- Hydration scope ลดลง — interactive-only islands พร้อม evidence
