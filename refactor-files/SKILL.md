---
name: refactor-files
description: Refactor ไฟล์ทีระบุตาม context
argument-hint: "[@files...]"
related:
  - refactor
  - refactor-codebase
  - refactor-to-single-responsibility
  - relocation
  - review-restructure
  - review-quality
  - review-readability
  - edit-relative
  - update-references
  - run-verify
---

## Goal

Refactor ไฟล์ทีระบุให้มี SRP, naming, structure, และ style ทีดีขึ้น โดยแก้ไขไฟล์ทีเกี่ยวข้องและ update references

## Scope

- ใช้กับ `@files...` ที user ระบุ
- ครอบคลุมไฟล์เดี่ยวหรือหลายไฟล์ใน repo เดียว
- ไม่ครอบคลุม workspace หรือ codebase ทั้มหมด — ใช้ `/refactor-workspace` หรือ `/refactor-codebase`

## Execute

### 1. Review Files

> Goal: เข้าใจไฟล์ทีจะ refactor

1. อ่านแต่ละไฟล์ใน `@files...`
2. ทำ `/review-quality` เพื่อหา issues เฉพาะไฟล์
3. ทำ `/review-readability` ถ้าไฟล์อ่านยาก
4. บันทึก baseline: responsibilities, imports, exports, public API

### 2. Identify Refactoring Actions

> Goal: ระบุ action ทีเหมาะสม

1. ถ้าไฟล์ยาว >250 บรรทัด หรือมีหลาย responsibility → ทำ `/refactor-to-single-responsibility`
2. ถ้าไฟล์อยู่ในตำแหน่งไม่เหมาะสม → ทำ `/relocation`
3. ถ้า imports/exports ซับซ้อน → ทำ `/review-architecture`
4. ถ้ามี naming/style issues → แก้ไขเฉพาะจุด
5. ถ้ามี dead code หรือ unused exports → ลบ

### 3. Apply Changes

> Goal: refactor ไฟล์ทีระบุ

1. แก้ไขไฟล์ทีระบุให้สอดคล้องกับ findings
2. ถ้าย้ายไฟล์ → ทำ `/relocation` ก่อน แล้วค่อย refactor
3. ถ้า split ไฟล์ → ทำ `/refactor-to-single-responsibility`
4. รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
5. แก้ไขน้อยที่สุด เฉพาะจุดทีจำเป็น

### 4. Update References

> Goal: ไม่ให้เกิด broken references

1. ทำ `/edit-relative` สำหรับ relative paths/imports
2. ทำ `/update-references` สำหรับ global references
3. ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Verify

> Goal: ตรวจสอบว่า refactor ผ่าน

1. ทำ `/run-verify` สำหรับไฟล์ทีแก้ไข
2. ตรวจว่าไม่มี regression
3. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3 (max 3)

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-table` ด้วยคอลัมน์: No., File, Action, Status, Notes
2. ทำ `/suggest-next-action`

## Rules

### 1. Scope Discipline

- ไม่ refactor ไฟล์นอก `@files...` โดยไม่ได้ user confirm
- ถ้าพบว่าจำเป็นต้องแก้ไฟล์อื่น → ถาม user ก่อน

### 2. Minimal Change

- ทำ `/dont-over-engineer`
- แก้เฉพาะ root cause
- ไม่สร้าง abstraction ที่ไม่จำเป็น

### 3. Reference Safety

- ทำ `/update-references` ทันทีหลังย้าย/ลบ/rename
- ตรวจ broken references ก่อนจบ task

### 4. Verification

- ผ่าน `/run-verify`
- ไฟล์ไม่เกิน 250 บรรทัด ถ้าเป็นไปได้
- ไม่มี broken references

- ใช้ /review-restructure ถ้าจำเป็น

## Expected Outcome

- ไฟล์ทีระบุถูก refactor
- references ถูกอัปเดตครบ
- ผ่าน verify
- รายงาน before/after ของไฟล์ทีแก้ไข
