---
name: test-uxui-by-agent-browser
description: ทดสอบ UX/UI ด้วย agent-browser ตรวจ layout, interaction, accessibility และ visual regression
argument-hint: "[url-or-route]"
related:
  - follow-lib-agent-browser
  - capture-image-app-to-screenshot
  - run-test-website-by-agent-browser
  - review-uxui
  - improve-uxui
  - review-accessibility
  - improve-accessibility
  - report-uxui-all-routes
  - report-table
  - resolve-errors
  - run-check
  - ask-me
---

## Goal

ทดสอบ UX/UI ของ web pages/components ด้วย `agent-browser` — ตรวจ layout ถูกต้อง, interactions ใช้งานได้, accessibility ไม่ broken และไม่มี visual regression จาก baseline screenshots

## Scope

ใช้เมื่อต้อง verify ว่า UI ทำงานตาม expected บน browser จริง ไม่ใช่แค่ unit tests ครอบคลุม visual, interaction, responsive, a11y และ route coverage — ไม่รวมการ design หรือ implement UX/UI ใหม่ (ใช้ `/improve-uxui`)

## Execute

### 1. Prepare Target And Baseline

> Goal: เตรียม URL และ baseline สำหรับเปรียบเทียบ

1. เปิด dev server หรือใช้ deployed URL ตาม argument
2. ทำ `/capture-image-app-to-screenshot` เพื่อเก็บ baseline screenshots ของ routes/components ที่ต้อง test
3. ถ้าไม่มี baseline → สร้าง baseline ก่อนครั้งแรกและข้าม regression check

### 2. Plan UX/UI Tests

> Goal: กำหนดสิ่งที่ต้อง test ต่อ route/component

1. ทำตาม `references/test-plan.md` — ระบุ viewport sizes, interaction flows และ assertions
2. แยก tests ตาม lane: visual, interaction, responsive, a11y, performance
3. ถ้า scope ใหญ่ → ใช้ `/consider-use-subagents` หรือ `/follow-parallel` แยก lanes

### 3. Run Visual Checks

> Goal: ตรวจว่า UI render ถูกต้องและไม่มี regression

1. ใช้ `agent-browser open <url>` แล้ว `agent-browser screenshot` แต่ละ viewport (`mobile`, `tablet`, `desktop`)
2. เปรียบเทียบ screenshots กับ baseline ด้วย diff tool หรือ `/use-scripts`
3. บันทึก diffs พร้อม pixel/percent change

### 4. Run Interaction Tests

> Goal: ตรวจว่า user interactions ใช้งานได้

1. ใช้ `agent-browser click`, `agent-browser type`, `agent-browser select`, `agent-browser hover` ตาม test plan
2. ตรวจ state changes หลัง interact: URL, DOM, visible text, enabled/disabled
3. ทดสอบ keyboard navigation ด้วย `Tab`, `Enter`, `Space`, `Escape`, arrow keys

### 5. Run Accessibility Checks

> Goal: ตรวจ a11y เบื้องต้นระหว่าง UI test

1. ใช้ `agent-browser snapshot -i` เพื่อบันทึก interactive elements
2. ตรวจ focus order, visible focus indicator และ semantic roles
3. ถ้าพบ a11y issues → เชื่อม `/review-accessibility` หรือ `/improve-accessibility`

### 6. Run Responsive Checks

> Goal: ตรวจ layout บน breakpoints ต่างๆ

1. ตั้ง viewport ตาม breakpoints ที่ project กำหนด
2. ตรวจ overflow, hidden elements, broken grids หรือ shifts
3. บันทึก screenshots ที่ breakpoint ที่ fail

### 7. Collect Errors And Console

> Goal: จับ client errors ระหว่าง test

1. ใช้ `agent-browser console` หรือ `watch-browser-console` เก็บ logs
2. ตรวจหา `console.error`, unhandled exceptions, failed network requests
3. ถ้ามี errors → `/resolve-errors` ก่อน pass

### 8. Validate And Report

> Goal: ยืนยันผลและสรุป findings

1. ทำ `/run-check` ถ้ามี unit tests ที่เกี่ยวข้อง
2. ทำ `/report-table` สรุป test results: route, viewport, status, evidence
3. ระบุ baseline diffs, interaction failures, a11y issues ทีละรายการ

## Rules

### 1. Baseline Discipline

- ทุก route/component ต้องมี baseline screenshot ก่อน regression check
- baseline ต้องเก็บใน `public/screenshots/` หรือ path ที่ project กำหนด
- อัปเดต baseline เฉพาะเมื่อ change ได้รับการยืนยัน

### 2. Test Isolation

- ทุก test ต้องเริ่มจาก clean state — ห้ามใช้ session/data จาก test ก่อนหน้า
- ปิด browser session หลังแต่ละ lane ด้วย `agent-browser close`
- ไม่ test บน production ถ้าทำให้ data เปลี่ยน

### 3. Evidence Required

- ทุก fail ต้องมี screenshot หรือ snapshot evidence
- ทุก a11y finding ต้องมี element/selector
- ทุก visual diff ต้องมี diff image หรือ percent

### 4. No Manual Design Changes

- ห้ามแก้ UX/UI ตรงๆ ระหว่าง test — ส่งต่อ `/improve-uxui`
- ห้าม approve visual regression โดยไม่มี rationale บันทึก
- ใช้ `/follow-lib-agent-browser` เพื่อดู commands เต็ม
- ถ้า test หลาย routes ใช้ `/run-test-website-by-agent-browser` หรือ `/report-uxui-all-routes`
- ถ้าพบ UX issues ส่งต่อ `/review-uxui` — ถ้าขาด context ทีชัดเจน → `/ask-me`

## Expected Outcome

- ทุก route/component ที test มี screenshots ก่อน/หลัง
- interaction flows ทำงานบนจริงทุก viewport
- a11y เบื้องต้นไม่ broken
- รายงาน findings พร้อม evidence และ next action
