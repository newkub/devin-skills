---
name: delete-cicd-fails
description: ลบ CI/CD workflow runs ทีล้มเหลวออกจาก repo ปัจจุบันหรือทีระบุ
argument-hint: "[workflow-or-run-id-or-all]"
related:
  - list-cicd-fails
  - resolve-cicd
  - watch-github-actions
  - ask-me
---

## Goal

ลบ CI/CD workflow runs ทีล้มเหลวออกจาก repo ปัจจุบันหรือ repo ทีระบุ โดย user confirmation ก่อนลบ

## Scope

ใช้สำหรับ cleanup failed workflow runs ทีไม่ต้องการเก็บ history เอาไว้อีกต่อไป

## Execute

### 1. Detect Target

> Goal: ระบุ repo, workflow และ run IDs ทีจะลบ

1. รัน `gh auth status` เพื่อตรวจสอบ authentication
2. ถ้าไม่ authenticated → ทำ `/ask-me`
3. ถ้าได้รับ `<run-id>` จาก argument → ลบเฉพาะ run ID นั้น
4. ถ้าได้รับ `<workflow>` จาก argument → ลบ failed runs ของ workflow นั้น
5. ถ้าได้รับ `all` → ลบ failed runs ทั้งหมดใน repo
6. ถ้าไม่มี argument → ทำ `/list-cicd-fails` แสดงรายการก่อนแล้วถาม user

### 2. Confirm

> Goal: ยืนยันก่อนลบ

1. สรุปจำนวน run IDs ทีจะลบ
2. ถ้าจำนวน > 1 หรือเป็น `all` → ถาม user ก่อนลบ
3. ถ้า user ไม่ยืนยัน → stop และ report

### 3. Delete Runs

> Goal: ลบ failed runs

1. สร้าง list ของ database IDs ทีจะลบ
2. รัน `gh run delete <databaseId>` ทีละ run
3. ถ้ามี run ใดไม่ลบได้ → บันทึก error แล้ว continue
4. รายงานจำนวนทีลบสำเร็จ/ไม่สำเร็จ

### 4. Verify

> Goal: ตรวจสอบว่าไม่มี failed runs เหลือ

1. รัน `gh run list --status failure --limit 50`
2. ถ้ายังมี → รายงานและแนะนำ `/resolve-cicd` หรือ `/list-cicd-fails`
3. ถ้าไม่มี → รายงาน success

## Rules

### 1. User Confirmation

- ลบหลาย run หรือ `all` ต้องยืนยันก่อนเสมอ
- ไม่ลบ run ที status ไม่ใช่ `completed` หรือ `failure`
- ไม่ force delete

### 2. Dry Run Option

- ถ้า user ระบุ `--dry-run` → แสดงรายการทีจะลบแต่ไม่ลบจริง

### 3. Safety

- ไม่ลบ run ทีเกี่ยวข้องกับ branch ปัจจุบัน เว้นแต่ user ระบุชัดเจน
- ไม่ expose secrets หรือ tokens ใน output

## Expected Outcome

- Failed workflow runs ทีเลือกถูกลบออกจาก GitHub
- รายงานจำนวนทีลบสำเร็จและไม่สำเร็จ
- ไม่มี failed runs เหลือหลัง delete
