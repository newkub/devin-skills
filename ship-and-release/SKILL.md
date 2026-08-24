---
name: ship-and-release
description: Ship code, push, และ release ไปยัง platform โดยยืนยันก่อน release
---

## Goal

Ship code, push ขึ้น remote และ release ไปยัง external platforms โดยมี user confirm ก่อน release

## Scope

ใช้เมื่องานพร้อมส่งมอบและต้องการ release ไปยัง npm, GitHub, หรือ platform อื่น

## Execute

### 1. Ship Code

> Goal: commit การเปลี่ยนแปลง

1. ทำ `/ship-code` เพื่อ commit ให้เรียบร้อย
2. ถ้า `/ship-code` ไม่ผ่าน → stop และ report

### 2. Push

> Goal: push ขึ้น remote

1. รัน `git push` ใน workspace root ด้วย `exec`
2. ถ้า push ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ถ้าไม่มี remote → รายงานและหยุด

### 3. Confirm Release

> Goal: ขอ user confirm ก่อน release

1. ทำ `/ask-me` พร้อมตัวเลือก:
   - `Proceed with release (recommended)`
   - `Abort release`
   - `Review summary first`
2. ถ้า `Abort release` → stop และ report
3. ถ้า `Review summary first` → แสดงสรุปแล้วถามซ้ำ

### 4. Release

> Goal: release ไปยัง platforms

1. ทำ `/run-release` เพื่อ auto-detect platforms และ release
2. ถ้า release ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Report

> Goal: รายงานผล release

1. ทำ `/report` พร้อม `/report-table`
2. ทำ `/suggest-next-action`

## Rules

### 1. Ship Code First

- `/ship-code` ต้องผ่านก่อน push/release เสมอ
- ไม่ release ถ้า `/ship-code` หรือ push ยังไม่ผ่าน

### 2. Confirm Before Release

- ต้องยืนยัน user ก่อน `/run-release` เสมอ
- ใช้ `/ask-me` เท่านั้น
- ไม่ release โดยอัตโนมัติ

### 3. No Force Push

- ไม่ force-push โดยไม่ได้ user confirmation
- ถ้า push/release ล้มเหลวให้ report ก่อนดำเนินการต่อ

## Expected Outcome

- `/ship-code` สำเร็จ
- `git push` สำเร็จ
- User ยืนยัน release
- `/run-release` สำเร็จ
- รายงานผลลัพธ์ครบถ้วน
