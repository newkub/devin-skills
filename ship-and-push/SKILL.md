---
name: ship-and-push
description: Ship code แล้ว push ขึ้น remote โดยเรียก ship-code แล้ว git push
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - ship-code
  - report
  - suggest-next-action
---

## Goal

Ship code แล้ว push ขึ้น remote โดยไม่ถาม release

## Scope

ใช้เมื่องานเสร็จและต้องการ commit + push ไม่รวม release

## Execute

### 1. Ship Code

> Goal: commit การเปลี่ยนแปลง

1. ทำ `/ship-code` เพื่อ commit ให้เรียบร้อย
2. ถ้า `/ship-code` ไม่ผ่าน → stop และ report

### 2. Push

> Goal: push ขึ้น remote

1. รัน `git push` ใน workspace root ด้วย `exec`
2. ถ้า push ไม่สำเร็จ → ตรวจสอบ remote/branch แล้ว `/resolve-errors` หรือ report
3. ถ้าไม่มี remote configured → รายงานและหยุด

### 3. Report

> Goal: รายงานผล

1. ทำ `/report` พร้อม `/report-table` สรุป: ship, push, status
2. ทำ `/suggest-next-action`

## Rules

### 1. Ship Code First

- `/ship-code` ต้องผ่านก่อน push เสมอ
- ไม่ push ถ้า `/ship-code` ยังไม่เสร็จ
- ไม่ถาม release ใน `/ship-and-push`

### 2. Push Safety

- ตรวจสอบ branch และ remote ก่อน push
- ไม่ force-push โดยไม่ได้รับ user confirmation
- ถ้า push ล้มเหลวให้ report ก่อนดำเนินการต่อ

## Expected Outcome

- `/ship-code` สำเร็จ
- `git push` สำเร็จ (หรือรายงานสาเหตุถ้าไม่สำเร็จ)
- ผลลัพธ์ถูกรายงานครบถ้วน
- ขั้นต่อไปชัดเจน
