---
name: run-program
description: รันโปรแกรมหลักและทำให้ทำงานได้จริง
---

## Goal

รันโปรแกรมหลักและทำให้ทำงานได้จริง

## Execute

รันโปรแกรมหลักของโปรเจกต์และทำให้ทำงานได้จริง พร้อมแก้ไขปัญหาที่พบ

## Scope

ใช้สำหรับ:

- รัน CLI programs
- รัน web applications
- รัน background services
- ตรวจสอบโปรแกรมทำงานได้ถูกต้อง

## Inputs

| Input | Details |
|-------|---------|
| Entry Point | (optional) file หลักที่ต้องการ run |
| Arguments | (optional) arguments สำหรับโปรแกรม |
| Environment | (optional) environment variables |

## Rules

### Program Types

| Type | การรัน |
|------|---------|
| Node/Bun | `bun run start` หรือ `bun src/index.ts` |
| Rust | `cargo run` |
| Binary | รัน executable โดยตรง |

### Error Handling

| กรณี | การจัดการ |
|------|-----------|
| Compile error | แก้ไข code และ rebuild |
| Runtime error | debug และ fix |
| Missing deps | ติดตั้ง dependencies |
| Config error | แก้ไข configuration |

## Structure

### File Location

```text
.windsurf/workflows/
└── run-program.md
```

### Phase Definitions

| Phase | Description | Main Activities |
|-------|-------------|---------------|
| Prepare | เตรียม | install, build |
| Execute | รัน | run program |
| Monitor | ตรวจสอบ | watch output |
| Fix | แก้ไข | fix errors |

## Steps

### Phase 1: Prepare

- 1.1 Install Dependencies
  - รัน `/run-install`
  - ตรวจสอบ dependencies ครบถ้วน

- 1.2 Build (ถ้าจำเป็น)
  - รัน `/run-build` ถ้าต้อง build
  - ตรวจสอบ build สำเร็จ

- 1.3 Check Entry Point
  - ตรวจสอบ entry file มีอยู่
  - ตรวจสอบ configuration
  - ตั้งค่า environment variables

### Phase 2: Execute

- 2.1 Run Program
  - รัน `bun run start` หรือ command ที่กำหนด
  - หรือรัน entry file โดยตรง
  - ส่ง arguments ถ้ามี

- 2.2 Check Startup
  - ตรวจสอบโปรแกรมเริ่มต้นสำเร็จ
  - ดู startup logs
  - บันทึก PID ถ้าเป็น background

### Phase 3: Monitor

- 3.1 Watch Output
  - ติดตาม stdout/stderr
  - ดู logs
  - ระบุ errors/warnings

- 3.2 Verify Functionality
  - ทดสอบว่าโปรแกรมทำงานถูกต้อง
  - ตรวจสอบ output
  - ตรวจสอบ side effects

### Phase 4: Fix Issues

- 4.1 Analyze Errors
  - อ่าน error messages
  - ระบุ root cause
  - จัดลำดับความสำคัญ

- 4.2 Apply Fixes
  - แก้ไข code ที่เป็นปัญหา
  - รัน `/review-deliveryoblems-and-fix` ถ้าจำเป็น
  - rebuild และรันใหม่

## Outputs

| Output | Details |
|--------|---------|
| Program Status | สถานะการทำงาน |
| Output Logs | logs ที่เกิดขึ้น |
| Errors Fixed | ปัญหาที่แก้ไข |

## Expected Outcome

- โปรแกรมรันสำเร็จ
- ทำงานได้ตาม expected
- ไม่มี errors ที่ block

## Reference

- `/validate` - ตรวจสอบความถูกต้องก่อนเริ่ม
- `/run-install` - ติดตั้ง dependencies
- `/run-build` - build โปรแกรม
- `/review-deliveryoblems-and-fix` - วิเคราะห์และแก้ไขปัญหา
