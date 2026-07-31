---
name: follow-git-clone
description: cloning strategies สำหรับ repositories ขนาดใหญ่ ครอบคลุม shallow, sparse-checkout และ mirror
---

## Goal

เลือก cloning strategy ที่เหมาะสมสำหรับ repository แต่ละขนาดและ use case

## Scope

ครอบคลุม git clone strategies: full, shallow, sparse-checkout, mirror และ bare

## Execute

### 1. Full Clone

1. รัน `git clone <repo-url>` สำหรับ full clone (default)
2. ใช้สำหรับ repositories ขนาดเล็กถึงกลาง
3. ตรวจสอบขนาดหลัง clone ด้วย `du -sh .git/`
4. รัน `git lfs pull` ถ้า repository ใช้ Git LFS

### 2. Shallow Clone

1. รัน `git clone --depth 1 <repo-url>` สำหรับ shallow clone (เฉพาะ commit ล่าสุด)
2. ใช้สำหรับ CI/CD ที่ต้องการแค่ latest code
3. รัน `git clone --depth 1 --single-branch <repo-url>` เพื่อ clone เฉพาะ branch เดียว
4. ถ้าต้องประวัติเพิ่ม: `git fetch --unshallow`

### 3. Sparse Checkout

1. รัน `git clone --no-checkout <repo-url>` เพื่อ clone โดยไม่ checkout files
2. รัน `git sparse-checkout init` เพื่อเปิดใช้ sparse checkout
3. รัน `git sparse-checkout set apps/website packages/shared` เพื่อเลือก directories
4. รัน `git checkout main` เพื่อ checkout เฉพาะที่เลือก

### 4. Mirror Clone

1. รัน `git clone --mirror <repo-url>` สำหรับ mirror clone
2. ใช้สำหรับ backup หรือ migration
3. Mirror clone รวมทุก branches, tags และ refs
4. ห้ามใช้ mirror clone สำหรับการทำงานปกติ

### 5. Clone With Submodules

1. รัน `git clone --recurse-submodules <repo-url>` เพื่อ clone พร้อม submodules
2. ถ้าลืม `--recurse-submodules`: รัน `git submodule update --init --recursive`
3. ทำ `/follow-git-submodules` หลัง clone
4. ตรวจสอบว่า submodules ทำงานได้

## Rules

### 1. Strategy Selection

- Full clone: สำหรับ development ปกติ
- Shallow clone: สำหรับ CI/CD หรือ repositories ใหญ่มาก
- Sparse checkout: สำหรับ monorepos ที่ต้องการแค่บาง directories
- Mirror clone: สำหรับ backup หรือ migration เท่านั้น

### 2. Shallow Clone Limitations

- ไม่สามารถดู history ก่อนหน้าได้
- ไม่สามารถ `git blame` ได้
- ใช้ `git fetch --unshallow` เพื่อดึง history ทั้งหมด
- ห้ามใช้ shallow clone สำหรับ development ปกติ

### 3. Sparse Checkout For Monorepos

- ใช้ sparse checkout สำหรับ monorepos ขนาดใหญ่
- เลือกเฉพาะ directories ที่ต้องการทำงาน
- อัปเดต sparse checkout เมื่อต้องการทำงานกับ directory ใหม่
- ตรวจสอบว่า dependencies ครบถ้วน

### 4. Non-Redundancy

- รายละเอียด LFS อยู่ใน `/follow-git-lfs` แล้ว
- รายละเอียด submodules อยู่ใน `/follow-git-submodules` แล้ว

## Expected Outcome

- เลือก cloning strategy ที่เหมาะสมกับ use case
- Clone เร็วและใช้ disk space น้อยลง
- Monorepos จัดการได้ผ่าน sparse checkout
- CI/CD ใช้ shallow clone เพื่อความเร็ว
