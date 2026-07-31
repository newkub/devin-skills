---
name: follow-git-lfs
description: จัดการ large files ด้วย Git LFS เพื่อลดขนาด repository
---

## Goal

ใช้ Git LFS สำหรับจัดการ large files เพื่อลดขนาด repository และเพิ่มประสิทธิภาพ

## Scope

ครอบคลุม Git LFS setup, track files, clone และ migrate

## Execute

### 1. Install And Setup

1. ติดตั้ง Git LFS ด้วย `git lfs install`
2. ตรวจสอบว่าติดตั้งแล้วด้วย `git lfs version`
3. ตั้งค่า LFS server ถ้าใช้ self-hosted
4. ตรวจสอบว่า LFS hooks ถูกติดตั้งใน `.git/hooks/`

### 2. Track Large Files

1. ระบุไฟล์ที่ควรใช้ LFS: `*.psd`, `*.zip`, `*.mp4`, `*.pdf` ขนาดใหญ่
2. รัน `git lfs track "*.psd"` เพื่อ track file type
3. รัน `git lfs track "*.zip"` สำหรับ archives
4. ตรวจสอบ `.gitattributes` ว่า LFS rules ถูกเพิ่มแล้ว
5. ทำ `/git-commit` เพื่อ commit `.gitattributes`

### 3. Add Large Files

1. รัน `git add <large-file>` เพื่อเพิ่มไฟล์
2. Git LFS จะจัดการไฟล์โดยอัตโนมัติ
3. รัน `git lfs ls-files` เพื่อดูไฟล์ที่ track โดย LFS
4. ทำ `/git-commit` เพื่อ commit

### 4. Clone With LFS

1. รัน `git clone <repo-url>` เพื่อ clone (LFS ดาวน์โหลดอัตโนมัติ)
2. ถ้าต้องการ skip LFS: `GIT_LFS_SKIP_SMUDGE=1 git clone <repo-url>`
3. รัน `git lfs pull` เพื่อดาวน์โหลด LFS files ทีหลัง
4. รัน `git lfs checkout` เพื่อ checkout LFS files

### 5. Migrate To LFS

1. รัน `git lfs migrate import --include="*.psd" --everything` เพื่อ migrate history
2. ใช้ `--no-rewrite` ถ้าไม่ต้องการ rewrite history
3. ทำ `/follow-git-cleanup` หลัง migrate
4. แจ้ง team members ให้ re-clone repository

## Rules

### 1. LFS File Selection

- ใช้ LFS เฉพาะไฟล์ที่ใหญ่กว่า 1MB
- ใช้ LFS สำหรับ binary files เท่านั้น
- ห้ามใช้ LFS สำหรับ text files หรือ source code
- ตรวจสอบว่า LFS server รองรับขนาดไฟล์

### 2. Migration Safety

- สำรอง repository ก่อน migrate
- Migrate จะ rewrite history ต้องแจ้ง team
- ทดสอบบน clone ก่อนทำบน main repository
- ใช้ `--no-rewrite` ถ้าไม่ต้องการ rewrite history

### 3. Storage Management

- ตรวจสอบ LFS storage quota
- รัน `git lfs ls-files` เพื่อดูไฟล์ที่ track
- ลบ LFS files ที่ไม่จำเป็น
- ตรวจสอบ LFS bandwidth usage

### 4. Non-Redundancy

- รายละเอียด cleanup อยู่ใน `/follow-git-cleanup` แล้ว
- รายละเอียด .gitignore อยู่ใน `/follow-gitignore` แล้ว

## Expected Outcome

- Large files จัดการผ่าน Git LFS
- Repository ขนาดเล็กและ clone เร็ว
- ไม่มี binary files ขนาดใหญ่ใน git history
- LFS storage จัดการเป็นระบบ
