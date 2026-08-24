---
name: sync-drive-d-submodules
description: Sync และอัพเดท git submodules ใน D drive กับ remote repositories
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

Sync และอัพเดท git submodules ทั้งหมดใน D drive ไปยัง latest remote version อย่างปลอดภัย

## Scope

ใช้สำหรับ sync และ update git submodules ใน multiple repositories ใน D drive เท่านั้น

## Execute

### 1. Scan Drive D For Submodules
> Goal: Scan Drive D For Submodules

ค้นหา repositories ทั้งหมดใน drive D ที่มี git submodules

1. ใช้ `find` หรือ `fd` เพื่อค้นหา `.gitmodules` files ใน D:\
2. กรองเฉพาะ paths ที่อยู่ใน drive D (`D:` หรือ `/mnt/d` สำหรับ WSL)
3. ตรวจสอบว่าแต่ละ repository มี submodules ที่ active จริงๆ
4. สร้าง list ของ repositories ที่ต้องการ update

### 2. Validate Submodule Status
> Goal: Validate Submodule Status

ตรวจสอบสถานะปัจจุบันของ submodules แต่ละอัน

1. รัน `git submodule status` เพื่อดู current commit
2. ตรวจสอบว่า submodules ไม่มี uncommitted changes
3. ตรวจสอบว่า submodules ไม่อยู่ใน detached HEAD state ที่มี local changes
4. บันทึกสถานะก่อน update เพื่อ rollback ถ้าจำเป็น

### 3. Find Matching Submodules
> Goal: Find Matching Submodules

หา submodules ที่เหมือนกันใน multiple repos ใน D drive

1. ดู submodules ในแต่ละ repo ผ่าน `.gitmodules`
2. เปรียบเทียบ submodule URLs ข้าม repos
3. ระบุ submodules ที่ต้อง sync และมี matching URLs

### 4. Update Submodules Remote
> Goal: Update Submodules Remote

อัพเดท submodules ไปยัง latest remote version

1. รัน `git submodule update --remote --recursive` เพื่อ fetch latest changes
2. รัน `git submodule update --init --recursive` สำหรับ init submodules ใหม่
3. ตรวจสอบว่าแต่ละ submodule update สำเร็จโดยไม่มี conflicts
4. ถ้ามี conflicts ให้รายงานและ skip ไปยังอันถัดไป

### 5. Verify Updates
> Goal: Verify Updates

ตรวจสอบว่า submodules ถูก update ถูกต้อง

1. รัน `git submodule status` อีกครั้งเพื่อยืนยัน new commits
2. ตรวจสอบว่า submodules สามารถ initialize และ update ได้
3. ทดสอบ build หรือ run tests ถ้ามี
4. รายงานผลลัพธ์ของการ update แต่ละ repository

### 6. Commit Changes
> Goal: Commit Changes

Commit submodule updates ถ้าต้องการ

1. ดู changes ด้วย `git status`
2. ใช้ `git add <submodule-path>` เพื่อ stage changes
3. สร้าง commit message ที่อธิบายการ update
4. Push changes ไปยัง remote ถ้าจำเป็น

## Rules

### 1. Drive D Scope Only

- ทำงานเฉพาะ repositories ที่อยู่ใน drive D เท่านั้น
- กรอง paths ที่ขึ้นต้นด้วย `D:` หรือ `/mnt/d` (WSL)
- ไม่แตะ repositories ใน drives อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ drive letter ก่อน execute ทุกครั้ง

### 2. Safety First

- ตรวจสอบ uncommitted changes ก่อน update เสมอ
- ถ้าพบ local changes ให้ข้ามและรายงาน
- ไม่ใช้ `--force` flag โดยไม่จำเป็น
- สร้าง backup หรือ stash changes ถ้าจำเป็น

### 3. Recursive Updates

- ใช้ `--recursive` flag เสมอสำหรับ complex submodule trees
- ตรวจสอบ nested submodules แต่ละ level
- รายงานปัญหาเฉพาะ nested submodules ให้ชัดเจน

### 4. Batch Processing

- ใช้ loops เพื่อ process แต่ละ repository
- แสดง progress ขณะทำงาน
- รายงานสรุปผลลัพธ์ทั้งหมดหลังจบ
- ไม่ stop ทั้ง batch เพราะ repository เดียวล้มเหลว

### 5. Error Handling

- จัดการ detached HEAD states
- จัดการ merge conflicts ใน submodules
- จัดการ network errors
- ใช้ retries สำหรับ failed updates

## Expected Outcome

- git submodules ทั้งหมดใน drive D ถูกอัพเดทไปยัง latest remote version
- All matching repos updated และ synced
- ไม่มีข้อมูลสูญหายหรือเสียหายระหว่างการอัพเดท
- Changes committed และ pushed
- รายงานผลลัพธ์ของการ update แต่ละ repository
