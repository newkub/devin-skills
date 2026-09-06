---
name: follow-tool-axe-playwright
description: ใช้ @axe-core/playwright เทส accessibility ใน e2e — WCAG violations, scan rules
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ @axe-core/playwright เทส accessibility ใน e2e — WCAG violations, scan rules

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new AxeBuilder({page})` แล้ว `.analyze()` ใน Playwright test
1. ใช้ `.withTags(["wcag2a","wcag2aa"])` จำกัด scope ตาม compliance target
1. ใช้ `.exclude()` สำหรับ third-party widgets ที่แก้ไม่ได้
1. assert `violations` array empty — log details เมื่อ fail

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- a11y scan ต่อ critical pages/flows ไม่ใช่ทุก page — runtime cost
- axe จับได้ ~40% issues เท่านั้น — เสริมด้วย manual keyboard/screen-reader testing
- fix critical/serious violations ก่อน ship — minor เป็น backlog

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน