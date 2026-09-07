---
name: run-test-visual
description: รัน visual regression testing เทียบ screenshots ก่อน/หลังต่อ route หรือ component
argument-hint: "[scope]"
related:
  - capture
  - use-agent-browser
  - run-test-e2e
  - review-uxui
  - run-dev
  - report
---

## Goal

ตรวจ visual regression โดย capture screenshots ของ routes/components แล้วเทียบกับ baseline — หา layout shifts, style breaks และ UI changes ที่ไม่ตั้งใจ

## Scope

- ใช้เมื่อมีการเปลี่ยน CSS, design system, layout หรือ dependency UI แล้วต้องการยืนยันว่าหน้าจอไม่พัง
- ครอบคลุม page-level screenshots ผ่าน `agent-browser` หรือ Playwright และ component-level ผ่าน Storybook/Playwright component tests
- Report only: รายงาน diffs ไม่ auto-approve หรือ revert

## Execute

### 1. Establish Baseline

> Goal: มี baseline screenshots เพื่อเทียบ

1. รับ scope: routes, components หรือทั้ง app
2. ถ้ามี baseline เดิมใน `tests/visual/baseline/` → ใช้ต่อ; ถ้าไม่มี → capture ก่อนจาก branch ปัจจุบัน (git worktree ถ้าต้องเทียบข้าม commit)
3. เก็บ baseline ด้วย naming deterministic: `<route-or-component>.png` เช่น `home.png`, `settings-profile.png`

### 2. Run App And Capture

> Goal: ได้ screenshots ชุดปัจจุบัน

1. ทำ `/run-dev` เพื่อเปิด app หรือใช้ preview build
2. ใช้ `/capture` หรือ `agent-browser` capture ทุก route/component ใน scope
3. Fix viewport (เช่น `1280x720`) และ disable animations ถ้าจำเป็นเพื่อลด noise
4. เก็บลง `tests/visual/current/`

### 3. Compare Screenshots

> Goal: หา pixel diffs ที่มีนัยสำคัญ

1. เทียบทีละคู่ด้วย Playwright `toHaveScreenshot()`, `pixelmatch` หรือ `looks-same`
2. Threshold default: diff ratio >0.1% → flag `changed`
3. แยก `missing` (route หาย), `new` (route ใหม่), `changed`, `same`
4. สร้าง diff images ลง `tests/visual/diff/` สำหรับการตรวจด้วยตา

### 4. Analyze Changes

> Goal: แยก intended vs unintended changes

1. เปิด diff images ของ findings ที่ใหญ่สุด
2. เช็คว่า change ตรงกับสิ่งที่แก้จริง (จาก git diff) หรือเป็น regression
3. ถ้าไม่แน่ใจ → ทำ `/review-uxui` หรือ `/review-diff` ประกอบ
4. จัดกลุ่ม: `intended`, `suspect`, `regression`

### 5. Report

> Goal: สรุปให้ตัดสินใจ approve baseline หรือแก้ bug

1. ทำ `/report` คอลัมน์: `No.`, `Route/Component`, `Diff %`, `Status`, `Verdict`
2. แนบ diff image paths สำหรับ findings สำคัญ
3. ถ้าทุก change เป็น intended → เสนออัปเดต baseline
4. ถ้ามี regression → ส่งต่อ `/resolve-errors` หรือ `/fix`

## Rules

### 1. Deterministic Capture

- Fix viewport, device scale factor และ wait ให้ fonts/images load ก่อน capture
- Disable animations และ dynamic content (timestamps, random data) ด้วย mock หรือ CSS override
- Capture ครั้งเดียวกันต้องได้ภาพเหมือนกัน — ถ้า flake ให้แก้ flakiness ก่อนเชื่อผล

### 2. Read-Only Verdict

- ไม่ auto-update baseline เมื่อพบ diff — ให้ user approve
- ไม่แก้ code เพื่อให้ test ผ่านโดยไม่เข้าใจสาเหตุ

### 3. Coverage

- ครอบทุก route ใน scope และอย่างน้อย critical flows
- ระบุ routes ที่ข้ามและเหตุผล (auth-required, external deps)

- ใช้ /capture ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /run-test-e2e ถ้าจำเป็น

## Expected Outcome

- Baseline และ current screenshots ครบตาม scope
- รายการ visual diffs พร้อม verdict intended/suspect/regression
- ชัดเจนว่าควร approve baseline ใหม่หรือแก้ regression ก่อน
