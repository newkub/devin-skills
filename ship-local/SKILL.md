---
name: ship-local
description: Ship workspace ด้วย local verify แล้ว commit โดยไม่ push
related:
  - ship-code
  - run-verify
  - run-test-all
  - review-codebase-everythink
  - resolve-errors
  - deep-validate
  - git-commit
  - report
  - suggest-next-action
  - ship-ci
  - ship-release
  - ship-github-issue
---

## Goal

Ship workspace ด้วย local verify แล้ว commit ใน local โดยไม่ push

## Scope

ใช้เมื่องานใน workspace ทีเลือกเสร็จสมบูรณ์ และต้องการ commit ใน local เท่านั้น
- ไม่ push
- ไม่ release/deploy
- ไม่ตั้ง CI/CD

## Execute

### 1. Ship Code

> Goal: prepare workspace ก่อน verify

1. ทำ `/ship-code`
2. ถ้า fail → stop และ report

### 2. Verify

> Goal: ตรวจสอบความพร้อมก่อน commit

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ทำ `/review-codebase-everythink` ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุ
4. ทำ `/deep-validate` เพื่อ validate ผลลัพธ์
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

### 3. Commit

> Goal: commit การเปลี่ยนแปลง

1. รัน `git submodule status` เพื่อดู submodules ทังหมด
2. ถ้ามี submodules ทีมี changes → `cd` เข้า submodule แต่ละอัน ทำ `/git-commit` ใน submodule แล้วกลับมา root
3. ทำ `/git-commit` ที root พร้อมระบุ submodule pointer updates ถ้ามี
4. ถ้าไม่มี uncommitted changes → stop และ report

### 4. Report

> Goal: สรุปการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป commits ทัง root และ submodules (ถ้ามี)
3. ทำ `/suggest-next-action` เพื่อแนะนำ `ship-ci` หรือ `ship-release`

## Rules

### 1. No Push

- `ship-local` ไม่ push ไป remote
- ถ้าต้องการ push → ใช้ `/ship-ci`

### 2. No Release/Deploy

- `ship-local` ไม่ release หรือ deploy
- ถ้าต้องการ release/deploy → ใช้ `/ship-release`

### 3. Verify Before Commit

- ต้องผ่าน `/run-verify` ก่อน commit
- ถ้า fail ให้ resolve ก่อน commit

### 4. Submodule First

- commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer
- ห้าม commit root pointer โดยที submodule ยังไม่ commit

## Expected Outcome

- `/ship-code` สำเร็จ
- code ผ่าน `/run-verify`, `/run-test-all` (ถ้ามี), `/review-codebase-everythink` (ถ้ามี), `/deep-validate`
- commits ทัง root และ submodules (ถ้ามี) สำเร็จ
- ไม่มี push/release/deploy
- รายงาน commits และ next action ครบถ้วน
