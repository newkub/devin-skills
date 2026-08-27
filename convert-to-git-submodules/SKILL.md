---
name: convert-to-git-submodules
argument-hint: "[directory]"
description: แปลง directory ใน repo ไปเป็น git submodule โดยสร้าง remote repo push content แล้ว add กลับ
related:
  - create-github-repo
  - git-commit-and-push
  - git-push
  - list-git-submodules
  - delete-git-submodules
  - update-references
  - update-gitignore
  - validate
  - ship
  - suggest-next-action
  - ask-me
---

## Goal

แปลง directory ภายใน parent repository ให้เป็น git submodule โดยสร้าง remote repo ใหม่ แล้ว clone กลับมาเป็น submodule ครอบคลุง history preservation, push, add, validate

## Scope

ใช้เมื่อ directory ใน repo โตเกินไป ต้องการแยกเป็น repo อิสระ หรือต้องการใช้ submodule

## Execute

### 1. Identify Directory

> Goal: ระบุ directory ทีจะ convert

1. รับ path ของ directory จาก user ถ้าไม่ชัด → ทำ `/ask-me`
2. ตรวจสอบว่า directory อยู่ใน parent repo และมีไฟล์อยู่จริง
3. ยื่นยันว่า directory ไม่ใช่ submodule อยู่แล้ว
4. ตรวจสอบว่า directory ไม่มี uncommitted changes สำคัญ
5. ระบุ parent repo root ด้วย `git rev-parse --show-toplevel`

### 2. Prepare Remote Repo

> Goal: มี remote repo สำหรับ directory

1. ตรวจสอบว่ามี remote repo อยู่แล้วหรือไม่
2. ถ้ายังไม่มี → ใช้ `/create-github-repo` หรือ `gh repo create <repo-name>`
3. กำหนดชื่อ repo ให้สื่อถึง purpose ของ directory
4. บันทึก remote URL สำหรับใช้ใน step ถัดไป
5. ถ้ามี repo อยู่แล้ว → ยืนยันว่าว่างหรือใช้ branch ใหม่

### 3. Backup And Extract History

> Goal: เก็บ history ของ directory ก่อนแยก

1. ใน parent repo → ตรวจ `git status` ว่า working tree สะอาด
2. บันทึก commit hash ปัจจุบัน: `git rev-parse HEAD`
3. ตรวจสอบ git history ของ directory: `git log --oneline -- <directory>`
4. ถ้าต้องการ preserve history → ใช้ `git subtree split --prefix=<directory> -b <branch>`
5. ถ้าไม่ต้องการ history → ข้ามไป step 4 ได้

### 4. Convert To Repo And Push

> Goal: ทำให้ directory เป็น repo และ push

1. ย้าย directory ออกไปไว้นอก parent repo ชั่วคราว เช่น `$env:TEMP/<name>` หรือใช้ branch จาก `subtree split`
2. รัน `git init` ใน directory นั้น
3. รัน `git add .` แล้ว `git commit -m "initial commit from <parent>"`
4. รัน `git remote add origin <remote-url>`
5. รัน `git push -u origin main` หรือทำ `/git-push`
6. ลบ temp directory หลัง push สำเร็จ

### 5. Remove From Parent

> Goal: ลบ directory เก่าออกจาก parent repo

1. ลบ directory เก่าออกจาก parent repo: `git rm -r <path>`
2. อัปเดต `.gitignore` ถ้าจำเป็น (ทำ `/update-gitignore`)
3. ทำ `/update-references` ถ้ามีไฟล์อื่นอ้างอิง path เดิม
4. รัน `git commit -m "remove <directory> before adding as submodule"`

### 6. Add As Submodule

> Goal: แทนที directory เดิมด้วย submodule

1. รัน `git submodule add <remote-url> <path>`
2. รัน `git submodule update --init --recursive`
3. ตรวจสอบว่า `.gitmodules` ถูกสร้างถูกต้อง
4. ตรวจสอบว่า submodule ถูก clone ลงมา: `git submodule status`
5. รัน `git add .gitmodules <path>`
6. รัน `git status` ตรวจสอบ

### 7. Commit And Push Parent

> Goal: บันทึกการเปลี่ยนแปลง

1. ทำ `/git-commit`
2. ทำ `/ship` ถ้าต้องการ push
3. ยืนยันว่าไม่มี broken references หลังลบ

### 8. Validate And Finalize

> Goal: ตรวจสอบว่า submodule ทำงานได้

1. ทดสอบ clone ใหม่: `git clone --recurse-submodules <parent-url>` ใน `$env:TEMP`
2. ตรวจสอบว่า submodule content ครบถ้วน
3. ทำ `/validate` เพื่อตรวจ references และ structure
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Safety

- ทำ dry run หรือ backup ก่อนลบ directory
- ตรวจ `git status` สะอาดก่อนเริ่ม
- เก็บ commit hash ก่อนเริ่มเพื่อ rollback ได้
- ถ้า fail ที่ step ไหน → rollback ด้วย `git reset --hard <hash>`
- ถามก่อนถ้ามี uncommitted/unpushed changes
- ไม่ลบ history ของ parent repo

### 2. Preserve History

- ถ้าต้องการ keep history → ใช้ `git filter-repo` หรือ `git subtree split` ก่อน
- ถ้าไม่ต้องการ → สร้าง initial commit ใหม่
- ระบุ choice ใน commit message ว่า preserve หรือ fresh history

### 3. Remote Required

- ต้องมี remote repo ก่อน add submodule
- ตรวจสอบสิทธิ์ push ก่อน
- ใช้ SSH URL ถ้ามี SSH key, HTTPS URL ถ้าไม่มี

### 4. Submodule Management

- ใช้ `git submodule add` ไม่ใช่ manual edit `.gitmodules`
- ตรวจ `git submodule status` หลัง add
- ถ้าต้องการ remove submodule ภายหลัง → ใช้ `/delete-git-submodules`

### 5. Clean Working Tree

- parent repo ต้อง clean ก่อนเริ่ม
- submodule ต้อง clone สำเร็จก่อน commit
- ใช้ `$env:TEMP` สำหรับ temp directory ไม่สร้างใน project
- ลบ temp directory หลัง push สำเร็จ
- ไม่ commit temp files เข้า repo

## Expected Outcome

- Directory กลายเป็น git submodule
- remote repo ใหม่มี content ครบถ้วน พร้อม history ถ้าต้องการ
- `.gitmodules` อัปเดต
- `git submodule status` แสดง submodule ที่ชี้ไปยัง commit ที่ถูกต้อง
- clone ใหม่กับ `--recurse-submodules` ทำงานได้
- ไม่มี broken references หลังการแปลง
- ทุกการเปลี่ยนแปลงผ่าน `/validate` และ `/ship`
