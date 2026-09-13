---
name: update-tests-update-e2e
description: อัปเดต e2e specs หลัง UI/route เปลี่ยน — selectors, flows, waits ตาม Playwright patterns
argument-hint: "[route-or-spec]"
related:
  - update-tests
  - run-test
  - follow-tool-playwright
  - use-agent-browser
  - resolve-errors
  - report-before-after
---

## Goal

อัปเดต e2e specs ให้ตรงกับ UI/route changes ล่าสุด — selectors, navigation, assertions, waits — แล้วรันจนผ่านแบบ deterministic

## Scope

- ใช้เมื่อ UI, routes หรือ user flows เปลี่ยนแล้ว e2e specs fail/ล้าสมัย
- ครอบคลุม: Playwright specs, selectors, page objects, fixtures, visual/interaction flows
- unit/integration → `subskills/update-unit/SKILL.md`; snapshots → `subskills/update-snapshot/SKILL.md`

## Execute

### 1. Diff UI Changes To Specs

> Goal: รู้ว่า spec ไหนกระทบจากการเปลี่ยนแปลงไหน

1. รัน `/run-test` (e2e) — เก็บ failing specs พร้อม error และ trace
2. map failures กลับไปหา UI/route changes ล่าสุด (git diff) — selector เปลี่ยน, route ย้าย, flow เปลี่ยน, copy เปลี่ยน
3. แยก spec bug (test ล้าสมัย) vs app bug (app เสียจริง) — app bug → `/resolve-errors` แยก

### 2. Update Selectors And Flows

> Goal: specs อ้าง UI จริงตาม conventions

1. เปลี่ยน selectors เปราะเป็น user-facing locators (`getByRole`, `getByLabel`, `getByText`) ตาม `/follow-tool-playwright`
2. อัปเดต paths/routes ที่เปลี่ยน — ใช้ route constants ถ้า project มี
3. อัปเดต flows ที่เปลี่ยน (steps เพิ่ม/ลด) ให้ตรง behavior ใหม่ — assert outcome เดิมหรือ outcome ใหม่ที่ตั้งใจ

### 3. Fix Waits And Stability

> Goal: specs deterministic ไม่ flaky

1. แทน `waitForTimeout`/sleep ด้วย auto-waiting locators หรือ `expect(...).toBeVisible()` patterns
2. ตรวจ network waits (`waitForResponse`) บน flows ที่ async
3. รันซ้ำ 2-3 ครั้ง — ต้องผ่านทุกครั้ง ไม่มี order dependence

### 4. Run And Verify

> Goal: suite เขียวและครอบคลุม flows ใหม่

1. `/run-test` (e2e) ผ่านทั้ง suite — แก้ทีละ spec ตาม failures
2. ถ้า UI ใหม่ยังไม่มี coverage → เพิ่ม spec ตาม conventions ของ project
3. `/report-before-after` — specs updated/added/removed, pass rate

## Rules

- assert user-visible behavior — ห้าม assert implementation details หรือ CSS internals
- ห้ามแก้ app เพื่อให้ spec ผ่าน — spec เผย bug → fix bug แยกหรือ report
- ห้ามลบ spec ที่ fail โดยไม่ระบุเหตุผล — ถ้า flow ถูกตัดจริงให้ระบุใน report
- fix-verify loop สูงสุด 3 รอบต่อ spec → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- e2e suite ผ่าน deterministic — ไม่มี flaky waits
- specs ตรงกับ UI/routes ปัจจุบันและครอบคลุม flows ที่เปลี่ยน
- report สรุป specs ที่แก้/เพิ่ม/ลบพร้อมเหตุผล

