---
name: follow-git-submodules
description: จัดการ git submodules ครอบคลุม add, status, update, sync และ delete
---

## Goal

จัดการ git submodules อย่างเป็นระบบ ครอบคลุมการเพิ่ม ตรวจสอบสถานะ update sync และลบ

## Scope

ใช้สำหรับ projects ที่มี git submodules หรือต้องการเพิ่ม submodules

## Execute

### 1. Check Submodule Status

1. รัน `git submodule status` เพื่อดู commit ที่แต่ละ submodule ชี้อยู่
2. ตรวจสอบว่า submodules ที่ชี้อยู่ตรงกับ remote หรือไม่

### 2. Add Submodule

1. ระบุ repository URL และ path ที่จะวาง submodule
2. รัน `git submodule add <url> <path>` เพื่อเพิ่ม submodule ใหม่
3. ตรวจสอบว่า `.gitmodules` ถูกอัปเดตถูกต้อง
4. Commit การเปลี่ยนแปลงด้วย `/git-commit`

### 3. Update Submodules

1. รัน `git submodule update --remote --merge` เพื่อ update submodules จาก remote
2. ตรวจสอบว่า updates ไม่ทำลาย compatibility กับ main project
3. ถ้ามี breaking changes ให้ pin submodule ไปยัง commit เฉพาะ
4. Commit การอัปเดตด้วย `/git-commit`

### 4. Sync Submodules

1. รัน `git submodule sync` เพื่อ sync URLs จาก `.gitmodules`
2. รัน `git submodule update --init --recursive` เพื่อ init และ update submodules
3. ตรวจสอบว่า submodules ทั้งหมดทำงานได้ปกติ

### 5. Delete Submodule

1. ทำ `/git-submodule-delete` เพื่อลบ submodule อย่างสมบูรณ์
2. ตรวจสอบว่าไม่มี code ที่ depend บน submodule นั้น
3. Commit การลบด้วย `/git-commit`

## Rules

### 1. Submodule Management

- ใช้ submodules เฉพาะเมื่อจำเป็น พิจารณาใช้ package manager แทน
- หลีกเลี่ยง nested submodules (submodules ใน submodules)
- ตรวจสอบว่า submodule URLs เป็น public หรือมี access ที่ถูกต้อง

### 2. Update Safety

- อย่า update submodules โดยไม่ตรวจสอบ compatibility
- Pin submodules ไปยัง specific commit ถ้าต้องการ stability
- ทำ `/run-verify` หลัง update submodules เสมอ

### 3. Cleanup

- ลบ submodules ที่ไม่ใช้งาน
- ตรวจสอบว่า `.gitmodules` และ `.git/config` สะอาด
- รัน `git submodule deinit` ก่อนลบ submodule

### 4. Non-Redundancy

- รายละเอียด delete อยู่ใน `/git-submodule-delete` แล้ว

## Expected Outcome

- Submodules จัดการเป็นระบบ ไม่มี stale submodules
- Submodule URLs ถูกต้องและเข้าถึงได้
- ไม่มี submodules ที่ไม่ใช้งาน
