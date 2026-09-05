---
name: run-program
description: รันโปรแกรมหลักและทำให้ทำงานได้จริง
argument-hint: "[scope]"
related:
  - run-install
  - run-build
  - review-codebase-everything
---

## Goal

รันโปรแกรมหลักและทำให้ทำงานได้จริง

## Scope

รันโปรแกรมหลักของโปรเจกต์และทำให้ทำงานได้จริง พร้อมแก้ไขปัญหาที่พบ

ใช้สำหรับ:

- รัน CLI programs
- รัน web applications
- รัน background services
- ตรวจสอบโปรแกรมทำงานได้ถูกต้อง

- ดูเพิ่มเติม: /review-codebase-everything

## Execute

### 1. Prepare

> Goal: เตรียม dependencies, build, และ environment ก่อนรัน

1. รัน `/run-install` เพื่อติดตั้ง dependencies
2. รัน `/run-build` ถ้าต้อง build
3. ตรวจสอบ entry file มีอยู่
4. ตั้งค่า environment variables ทีจำเป็น

### 2. Execute

> Goal: รันโปรแกรมหลัก

1. เลือก command ตาม project type:
   - Node/Bun: `bun run start` หรือ `bun src/index.ts`
   - Rust: `cargo run`
   - Binary: รัน executable โดยตรง
2. ส่ง arguments ถ้ามี
3. บันทึก PID ถ้าเป็น background

### 3. Monitor

> Goal: ติดตาม output และ verify ฟังก์ชัน

1. ติดตาม stdout/stderr และ logs
2. ระบุ errors/warnings
3. ทดสอบว่าโปรแกรมทำงานถูกต้อง
4. ตรวจสอบ side effects

### 4. Fix Issues

> Goal: แก้ไขปัญหาที่พบ

1. อ่าน error messages และระบุ root cause
2. จัดลำดับความสำคัญ
3. แก้ไข code ที่เป็นปัญหา
4. รัน `/deep-review` ถ้าจำเป็น
5. rebuild และรันใหม่

## Rules

### 1. Program Types

| Type | การรัน |
|------|---------|
| Node/Bun | `bun run start` หรือ `bun src/index.ts` |
| Rust | `cargo run` |
| Binary | รัน executable โดยตรง |

### 2. Error Handling

| กรณี | การจัดการ |
|------|-----------|
| Compile error | แก้ไข code และ rebuild |
| Runtime error | debug และ fix |
| Missing deps | ติดตั้ง dependencies |
| Config error | แก้ไข configuration |

### 3. Safety

- ไม่รันโปรแกรมที่ติดตั้ง dependencies ไม่ครบ
- ไม่ฝัง secrets ใน command arguments
- บันทึก logs ก่อนปิดโปรแกรม

## Expected Outcome

- โปรแกรมรันสำเร็จ
- ทำงานได้ตาม expected
- ไม่มี errors ที่ block
