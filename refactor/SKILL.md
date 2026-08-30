---
name: refactor
description: Refactor ตาม context โดยเรียก sub-skill ทีเหมาะสม
argument-hint: "[@files... | scope]"
related:
  - refactor-codebase
  - refactor-files
  - refactor-workspace
  - refactor-to-single-responsibility
  - relocation
  - review-restructure
  - review-quality
  - update-references
  - run-verify
  - dont-over-engineer
---

## Goal

Refactor code ตาม context โดยเลือก sub-skill ทีเหมาะสม: ไฟล์, workspace, codebase, หรือ SRP

## Scope

- ถ้า user ระบุ `@files...` → ใช้ `/refactor-files`
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ใช้ `/refactor-to-single-responsibility`
- ถ้าต้องการ refactor ทั้ม codebase → ใช้ `/refactor-codebase`
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`

## Execute

### 1. Detect Context

> Goal: ระบุ scope ของ refactoring

1. ถ้ามี `@files...` จาก argument → mark เป็น file refactor
2. ถ้าไม่มี `@files` แต่ context เป็น monorepo/workspace → ใช้ `/refactor-workspace`
3. ถ้า project มีไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ใช้ `/refactor-to-single-responsibility`
4. ถ้าต้องการ refactor ทั้ม codebase หรือไม่มี files/workspace context → ใช้ `/refactor-codebase`
5. ถ้า user บอกว่าต้องการย้ายไฟล์ → ใช้ `/relocation`

### 2. Dispatch

> Goal: เรียก sub-skill ทีเหมาะสม

1. ถ้า file refactor → ทำ `/refactor-files [@files...]`
2. ถ้า workspace refactor → ทำ `/refactor-workspace`
3. ถ้า SRP refactor → ทำ `/refactor-to-single-responsibility`
4. ถ้า codebase refactor → ทำ `/refactor-codebase`
5. ถ้า relocation → ทำ `/relocation`

### 3. Update References

> Goal: ตรวจ references หลัง refactor

1. หลัง sub-skill เสร็จ ทำ `/update-references` ถ้ามีการย้าย/ลบ/rename
2. ตรวจ broken references ด้วย `/check-broken-skills-references` ถ้ามี
3. ทำ `/run-verify` เพื่อตรวจ lint/typecheck/test/build

### 4. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป sub-skill ทีใช้ การเปลี่ยนแปลง และ status
2. ทำ `/suggest-next-action`

## Rules

### 1. Context Aware

- ไม่เดา scope ถ้าไม่ชัด
- ถ้าไม่ชัดให้ถาม user
- ไม่ dispatch ไปหลาย sub-skill พร้อมกัน

### 2. Minimal Change

- ทำ `/dont-over-engineer`
- ไม่ refactor เกินความจำเป็นต่อ context

### 3. Safety

- การย้าย/ลบ/rename ต้อง update references
- destructive actions ต้อง dry run + user confirmation

### 4. Verification

- ทุก refactor ต้องผ่าน `/run-verify`
- ไม่มี broken references

## Expected Outcome

- Sub-skill ทีเหมาะสมถูกเรียกตาม context
- ผ่าน verify
- ไม่มี broken references
- รายงาน before/after
