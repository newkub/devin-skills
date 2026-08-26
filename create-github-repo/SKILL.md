---
name: create-github-repo
description: สร้าง GitHub repository ใหม่ผ่าน gh CLI ด้วยชื่อและ visibility ที่ระบุ
argument-hint: "[repo-name]"
---

## Goal

สร้าง GitHub repository ใหม่ด้วย metadata ครบถ้วน

## Scope

- ใช้ `gh repo create` เท่านั้น
- รองรับ public, private, internal
- ไม่ครอบคลุมการ push local code (ดู `/save-to-github-repo`)

## Execute

### 1. Prepare Repo Metadata

> Goal: มีชื่อ repository และ visibility ที่ถูกต้อง

1. รับ `repo-name` จาก argument หรือถามผู้ใช้ถ้าขาด
2. ตรวจสอบ `gh auth status` ว่า login แล้ว
3. ถ้าไม่ login ให้หยุดและแจ้งให้ทำ `gh auth login`
4. รับ visibility จาก argument (ค่าเริ่มต้น `--private`)

### 2. Create Repository

> Goal: repository ถูกสร้างบน GitHub

1. รัน `gh repo create <repo-name> --<visibility>`
2. ถ้าต้องการกำหนด description ให้ใช้ `--description "<desc>"`
3. บันทึก URL จาก output

### 3. Open And Report

> Goal: แสดงผล URL และเปิดหน้า repo

1. รัน `gh repo view <repo-name> --json url --jq .url` เพื่อเอา URL
2. ทำ `/open-web` หรือ `start <url>` เพื่อเปิดใน browser
3. รายงาน URL และ visibility

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Visibility

- ค่าเริ่มต้น `--private`
- รับ `--public` หรือ `--internal` ผ่าน argument
- ถ้าไม่ระบุให้ถาม user

### 2. Safety

- ตรวจสอบ `gh auth status` ก่อน
- ไม่สร้าง repo ซ้ำชื่องเดิมใน owner เดียวกัน
- ไม่บังคับ push local code ถ้า user ไม่ได้ขอ

### 3. Output

- รายงาน URL ของ repo ใหม่
- แจ้ง visibility ที่เลือก

## Expected Outcome

- Repository ถูกสร้างบน GitHub
- URL ถูกต้องและเปิดได้
- Visibility ตรงกับที่ระบุ