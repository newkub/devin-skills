---
name: convert-to-submodule
description: แปลง directory ใน repo เป็น git submodule พร้อม push และ add กลับ
argument-hint: "[directory]"
---

## Goal

แปลง directory ที่อยู่ใน git repo ให้กลายเป็น git submodule โดย push ไปยัง remote repo ใหม่แล้วเพิ่มกลับเป็น submodule

## Scope

ใช้เมื่อต้องการแยก directory ออกเป็น repo อิสระแล้วอ้างอิงกลับด้วย `git submodule` ครอบคลุม create remote repo, push, remove from parent, add as submodule, validate ไม่รวมการลบ submodule (ใช้ `/git-submodule-delete`)

## Execute

### 1. Identify Target Directory

> Goal: ระบุ directory ที่จะแปลงเป็น submodule

1. รับ path ของ directory ที่ต้องการแปลงจาก user
2. ตรวจสอบว่า directory อยู่ใน git repo และมีไฟล์อยู่จริง
3. ตรวจสอบว่า directory ยังไม่ใช่ submodule อยู่แล้ว
4. ระบุ parent repo root ด้วย `git rev-parse --show-toplevel`
5. ถ้า path ไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Prepare Remote Repo

> Goal: สร้าง remote repo สำหรับเก็บ submodule

1. ตรวจสอบว่ามี remote repo อยู่แล้วหรือไม่
2. ถ้ายังไม่มี → ทำ `/create-github-repo` เพื่อสร้าง repo ใหม่
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

### 4. Push To Remote

> Goal: push content ของ directory ไปยัง remote repo

1. สร้าง temp directory ใน `$env:TEMP` สำหรับเตรียม content
2. คัดลอก content จาก directory ไป temp directory
3. `git init` ใน temp directory
4. `git add .` แล้ว `git commit -m "Initial commit from <parent-repo>"`
5. เพิ่ม remote: `git remote add origin <remote-url>`
6. ทำ `/git-push` เพื่อ push ไปยัง remote
7. ลบ temp directory หลัง push สำเร็จ

### 5. Remove From Parent

> Goal: ลบ directory ออกจาก parent repo

1. ใน parent repo → `git rm -r <directory>`
2. อัปเดต `.gitignore` ถ้าจำเป็น (ทำ `/update-gitignore`)
3. ทำ `/update-reference` ถ้ามีไฟล์อื่นอ้างอิง path เดิม
4. `git commit -m "Remove <directory> before converting to submodule"`
5. ยืนยันว่าไม่มี broken references หลังลบ

### 6. Add As Submodule

> Goal: เพิ่ม remote repo กลับเป็น submodule

1. ใน parent repo → `git submodule add <remote-url> <directory>`
2. ตรวจสอบว่า `.gitmodules` ถูกสร้างถูกต้อง
3. ตรวจสอบว่า submodule checkout สำเร็จ: `git submodule status`
4. `git add .gitmodules <directory>`
5. `git commit -m "Add <directory> as submodule"`
6. ทำ `/git-push` เพื่อ push parent repo

### 7. Validate And Finalize

> Goal: ตรวจสอบว่า submodule ทำงานได้และ references ครบ

1. ทดสอบ clone ใหม่: `git clone --recurse-submodules <parent-url>` ใน `$env:TEMP`
2. ตรวจสอบว่า submodule content ครบถ้วน
3. ทำ `/validate` เพื่อตรวจ references และ structure
4. ทำ `/update-reference` ถ้ามี path เปลี่ยนแปลง
5. ทำ `/ship-skills` เพื่อ commit และ finalize
6. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Safety

- ทำ dry run ก่อนทุก destructive action (`git rm`, `git submodule add`)
- ตรวจ `git status` สะอาดก่อนเริ่ม
- เก็บ commit hash ก่อนเริ่มเพื่อ rollback ได้
- ถ้า fail ที่ step ไหน → rollback ด้วย `git reset --hard <hash>`
- ไม่ดำเนินการโดยไม่มี user confirmation สำหรับ destructive steps

### 2. History Preservation

- ถ้า user ต้องการ preserve history → ใช้ `git subtree split`
- ถ้าไม่ต้องการ → สร้าง initial commit ใหม่ใน temp directory
- ระบุ choice ใน commit message ว่า preserve หรือ fresh history

### 3. Remote Repo

- ใช้ `/create-github-repo` สำหรับสร้าง repo ใหม่
- ถ้ามี repo อยู่แล้ว → ยืนยันว่าใช้ได้และไม่ conflict
- ใช้ SSH URL ถ้ามี SSH key, HTTPS URL ถ้าไม่มี

### 4. Submodule Management

- ใช้ `git submodule add` ไม่ใช่ manual edit `.gitmodules`
- ตรวจ `git submodule status` หลัง add
- ถ้าต้องการ remove submodule ภายหลัง → ใช้ `/git-submodule-delete`

### 5. Temp Files

- ใช้ `$env:TEMP` สำหรับ temp directory ไม่สร้างใน project
- ลบ temp directory หลัง push สำเร็จ
- ไม่ commit temp files เข้า repo

## Expected Outcome

- directory ถูกแปลงเป็น git submodule สำเร็จ
- remote repo ใหม่มี content ครบถ้วน พร้อม history ถ้าต้องการ
- parent repo มี `.gitmodules` ที่ถูกต้อง
- `git submodule status` แสดง submodule ที่ชี้ไปยัง commit ที่ถูกต้อง
- clone ใหม่กับ `--recurse-submodules` ทำงานได้
- ไม่มี broken references หลังการแปลง
- ทุกการเปลี่ยนแปลงผ่าน `/validate` และ `/ship-skills`
