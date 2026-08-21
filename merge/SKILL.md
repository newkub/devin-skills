---
name: merge
description: merge ไฟล์เข้าด้วยกันและลบไฟล์เดิม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

## Goal

merge ไฟล์เข้าด้วยกันและลบไฟล์เดิม

## Scope

Use `merge` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Merge Files

merge ไฟล์เข้าด้วยกัน

1. ระบุไฟล์ที่ต้อง merge
2. อ่าน content ของไฟล์ทั้งหมด
3. merge content เข้าด้วยกัน

### 2. Delete Old Files

ลบไฟล์เดิม

1. ลบไฟล์เดิมหลังจาก merge
2. ตรวจสอบว่า merge ถูกต้อง

## Rules

## Rules

- ตรวจสอบว่า merge ถูกต้องก่อนลบไฟล์เดิม
- ใช้ git สำหรับ file operations ถ้าเป็นไปได้
- ตรวจสอบว่าไม่มี data loss

## Expected Outcome

## Expected Outcome

- ไฟล์ถูก merge เข้าด้วยกัน
- ไฟล์เดิมถูกลบ
- ไม่มี data loss
