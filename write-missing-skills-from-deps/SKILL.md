---
name: write-missing-skills-from-deps
description: สร้าง skills ที่ขาดจาก dependencies ใน package manifest
---

## Goal

สร้าง skills ที่ขาดจาก dependencies ใน package manifest ที่ยังไม่มีใน global

## Scope

ครอบคลุมการอ่าน package manifest, เช็ค skills ใน global, และสร้าง skills ที่ขาด

## Execute

### 1. Read Package Manifest

1. อ่าน `package.json` หรือ `Cargo.toml` จาก workspace
2. ดึงรายชื่อ dependencies ที่มี skills ใน Cascade
3. กรองเฉพาะ dependencies ที่มี official skills

### 2. Check Skills In Global

1. อ่านรายการ skills ใน `C:\Users\Veerapong\.codeium\windsurf\skills`
2. เปรียบเทียบ dependencies กับ skills ที่มีอยู่
3. ระบุ skills ที่ยังไม่มีใน global

### 3. Create Missing Skills

1. ทำ `/write-windsurf-skills` สำหรับแต่ละ skill ที่ขาด
2. สร้าง folder structure ตามมาตรฐาน
3. เขียน SKILL.md index และ content files
4. ใช้ `/learn-from-web` ก่อนเขียนเนื้อหา

### 4. Validate And Finalize

1. ตรวจสอบว่า skills ทั้งหมดถูกสร้างเสร็จ
2. ใช้ `/content-quality` สำหรับทุกไฟล์
3. ตรวจสอบ folder structure ถูกต้อง
4. ใช้ `/update-references` หากมี file operations

## Rules

### 1. Package Manifest Detection

ตรวจสอบประเภท package manifest:

- `package.json` สำหรับ JavaScript/TypeScript projects
- `Cargo.toml` สำหรับ Rust projects
- `pyproject.toml` หรือ `requirements.txt` สำหรับ Python projects

### 2. Skills Mapping

แมป dependencies กับ skills ที่มีใน Cascade:

- อ่าน skills list จาก Cascade system
- ตรวจสอบว่า dependency มี official skill หรือไม่
- กรองเฉพาะ dependencies ที่มี skills ในระบบ

### 3. Global Skills Location

ตำแหน่ง global skills:

- `C:\Users\Veerapong\.codeium\windsurf\skills`
- ตรวจสอบโฟลเดอร์ skill แต่ละตัว
- อ่าน SKILL.md เพื่อยืนยันว่า skill มีอยู่จริง

### 4. Batch Creation

สร้าง skills แบบ batch:

- สร้าง skills ที่ขาดทั้งหมดในครั้งเดียว
- ใช้ `/write-windsurf-skills` สำหรับแต่ละ skill
- รักษาความสม่ำเสมอทั้งหมด

### 5. Error Handling

จัดการกับข้อผิดพลาด:

- ข้าม dependencies ที่ไม่มี skills
- ข้าม skills ที่มีอยู่แล้ว
- บันทึก skills ที่สร้างไม่สำเร็จ

## Expected Outcome

- Skills ทั้งหมดจาก dependencies ถูกสร้างใน global
- Folder structure ถูกต้องตามมาตรฐาน
- Content มีคุณภาพและสมบูรณ์
- ไม่มี duplicate skills

## Common Mistakes

- ลืมตรวจสอบว่า dependency มี skill ในระบบหรือไม่
- สร้าง skills ที่มีอยู่แล้วใน global
- ไม่ใช้ `/write-windsurf-skills` ในการสร้าง
- ไม่ตรวจสอบ folder structure หลังสร้าง

## Anti-Patterns

- ❌ สร้าง skills โดยไม่ตรวจสอบ dependencies ที่มีอยู่
- ❌ สร้าง skills แบบ manual ไม่ตามมาตรฐาน
- ❌ ข้าม `/learn-from-web` ก่อนเขียนเนื้อหา
- ❌ ไม่ตรวจสอบคุณภาพ content
