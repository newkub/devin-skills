---
name: update-tests-update-unit
description: อัปเดต unit tests หลัง refactor — signatures, mocks, assertions ตรง implementation ใหม่
argument-hint: "[files-or-module]"
related:
  - update-tests
  - run-test
  - follow-tool-vitest
  - check-test-isolation
  - resolve-errors
  - report-before-after
---

## Goal

อัปเดต unit tests ให้ตรงกับ code ที่ refactor/เปลี่ยน signature — mocks, assertions, test structure — โดย assert behavior ไม่ใช่ internals

## Scope

- ใช้เมื่อ refactor, rename, signature change หรือ restructure ทำ unit tests fail/ล้าสมัย
- ครอบคลุม: Vitest/Jest/bun test/pytest ตามที่ project ใช้ — mocks, fixtures, parameterized tests
- e2e → `subskills/update-e2e/SKILL.md`; snapshots → `subskills/update-snapshot/SKILL.md`

## Execute

### 1. Map Breakage To Changes

> Goal: รู้ว่า test ไหน fail เพราะ change ไหน

1. รัน `/run-test` — เก็บ failing tests พร้อม errors
2. map failures กับ code diff — signature เปลี่ยน, module ย้าย, behavior เปลี่ยนตั้งใจ, หรือ behavior หาย
3. แยก: test ล้าสมัย (อัปเดต test) vs regression จริง (app bug → `/resolve-errors` หรือ report)

### 2. Update Tests To New Contracts

> Goal: tests ตรงกับ public contract ใหม่

1. อัปเดต imports/paths ตาม structure ใหม่ — ตาม conventions เดิมของ project
2. อัปเดต calls ตาม signature ใหม่ — params, return shape, error types
3. อัปเดต mocks ให้ตรง boundary ใหม่ — mock external deps เท่านั้น ห้าม mock internal pure functions
4. ถ้า behavior เปลี่ยนตั้งใจ → อัปเดต expectations; ถ้า test เผย logic หาย → flag ก่อนลบ

### 3. Cover New Paths

> Goal: code paths ใหม่มี test ครบ

1. refactor ที่เพิ่ม branches/functions ใหม่ → เพิ่ม test cases ตาม code-path map ของ `/update-tests`
2. รักษา AAA pattern และ test names `should [expected] when [condition]` ตาม project
3. ทำ `/check-test-isolation` — ไม่มี shared state, cleanup ครบ

### 4. Run And Verify

> Goal: suite เขียวและ deterministic

1. `/run-test` ผ่านทั้ง scope ที่แก้ แล้วรันซ้ำ 2-3 ครั้ง — ไม่มี flaky
2. `/run-check` lint/typecheck ผ่านบน test files ที่แก้
3. `/report-before-after` — tests updated/added/removed ต่อ module

## Rules

- assert behavior/output + error shape — ห้าม assert internals หรือ private state
- ห้ามแก้ source เพื่อให้ test ผ่าน — test เผย regression → fix bug แยก
- ห้ามลบ tests ที่ครอบ behavior ที่ยังมีอยู่ — ลบเฉพาะ behavior ที่ตัดออกจริง
- fix-verify loop สูงสุด 3 รอบต่อ test → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- unit tests ตรงกับ implementation ใหม่และผ่าน deterministic
- coverage ไม่ลดจากก่อน refactor — paths ใหม่มี tests
- report สรุป tests ที่แก้/เพิ่ม/ลบพร้อมเหตุผล

