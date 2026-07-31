---
name: check-should-update
description: ตรวจสอบ git changes เพื่อตัดสินใจว่า target ต้องอัปเดทหรือไม่ ก่อนเริ่มงาน
---

## Goal

ตรวจสอบ git changes ของ target paths เพื่อตัดสินใจว่าต้องอัปเดทหรือข้ามไป validate สิ่งที่มีอยู่

## Scope

ใช้กับทุก workflow ที่ต้องเช็คว่า target ต้องอัปเดทตาม code changes หรือไม่ ก่อนเริ่มงาน

## Execute

### 1. Check Git Changes

ตรวจสอบ git changes ของ target paths ที่เกี่ยวข้อง

> Goal: รู้ว่า target ต้องอัปเดทตาม code changes หรือไม่ ไม่เสียเวลาอัปเดทถ้าไม่มีอะไรเปลี่ยน

1. ระบุ target paths ที่ต้องเช็คจาก calling workflow
2. รัน `git -C <project-root> diff --name-only HEAD~1 -- <target-path>` สำหรับแต่ละ path
3. รวมผลจากทุก path เป็น changed files list
4. ถ้าไม่มี git changes เลย → return `skip` (ข้ามไป validate สิ่งที่มีอยู่)
5. ถ้ามี git changes → return `update` (ทำตามขั้นตอนถัดไปของ calling workflow)
6. ถ้าเป็นการรันครั้งแรก (target ยังไม่มี) → return `create` (ทำตามขั้นตอนสร้างใหม่ของ calling workflow)

## Rules

### 1. Target Paths

- Calling workflow ต้องระบุ target paths ที่ต้องเช็ค
- ใช้ glob patterns ที่รองรับโดย `git diff --name-only`

### 2. Return Values

- `skip` — ไม่มี changes ข้ามไป validate
- `update` — มี changes ทำตามขั้นตอนถัดไป
- `create` — target ยังไม่มี ทำตามขั้นตอนสร้างใหม่

## Expected Outcome

- รู้ว่า target ต้อง `skip`, `update`, หรือ `create`
- ไม่เสียเวลาอัปเดทถ้าไม่มีอะไรเปลี่ยน
