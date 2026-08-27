---
name: update-examples
description: เขียน examples ครอบคลุมทุก API ในโปรเจกต์สำหรับ docs, tests, และ onboarding
related:
  - analyze-project
  - scan-codebase
  - update-readme-md
  - run-dev
  - deep-validate
  - report-table
  - update-test
  - update-usage-md
  - run-format
  - run-typecheck
  - run-examples
---

## Goal

เขียน examples ครอบคลุมทุก API ในโปรเจกต์ เพื่อใช้เป็น docs, tests, และ onboarding material

## Scope

ใช้ `/update-examples` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุบ โดยสร้างหรือปรับปรุง examples ใน `examples/` directory ของ library หรือ package

## Execute

### 1. Analyze APIs

> Goal: ค้นหาและจัดกลุ่ม public APIs ทั้งหมด

1. รัน `/analyze-project` เพื่อดูภาพรวม
2. ทำ `/scan-codebase` เพื่อหา public APIs ทั้งหมด (exports, functions, classes, types)
3. อ่าน `package.json` exports field เพื่อหา entry points
4. ระบุ API ทั้งหมดจาก source code
5. จัดกลุ่ม APIs ตาม module/domain

### 2. Plan Examples

> Goal: วางแผน examples ตาม module และ use case

1. สร้าง 1 example file ต่อ module/domain ใน `examples/`
2. แต่ละ example ครอบคลุม use case จริง ไม่ใช่แค่ hello world
3. รวม basic usage, advanced usage, edge cases และ error handling
4. เพิ่ม comments อธิบายเป็นภาษาที่เข้าใจง่าย

### 3. Create Structure

> Goal: สร้างโครงสร้าง `examples/` ทีถูกต้อง

1. สร้าง `examples/` directory
2. สร้าง subdirectories ตาม project organization
3. สร้าง `src/` directory ในแต่ละ example subdirectory
4. สร้าง `README.md` อธิบายโครงสร้างและวิธีรัน

### 4. Write Examples per Module

> Goal: เขียน examples ทีครอบคลุบและรันได้จริง

1. เขียน examples สำหรับทุก module ครอบคลุมทุก API
2. เขียน basic usage สำหรับแต่ละ API
3. เขียน advanced usage สำหรับ use cases ที่ซับซ้อน
4. เขียน edge cases และ error handling
5. ใช้ TypeScript เป็น default language
6. แต่ละ example รันได้ด้วย `bun run examples/<name>.ts`
7. ใช้ `console.log` สำหรับแสดงผลลัพธ์
8. เขียน `src/index.ts` ที่เมื่อ run example แล้ว ต้องแสดงทั้งหมดแบบ reactive ว่ามีอะไรบ้าง เพื่อให้เห็นภาพรวม

### 5. Write Integration Examples

> Goal: เขียน examples ทีครอบคลุม integration และ flows

1. เขียน end-to-end use case flows
2. เขียน cross-module integration
3. เขียน error handling flows

### 6. Test Examples

> Goal: รันและตรวจสอบทุก example ทำงานถูกต้อง

1. รันทุก example ด้วย `bun run examples/<name>.ts`
2. ตรวจว่า output ถูกต้องตาม expected
3. ถ้ามี error → แก้และรันใหม่
4. ใช้ `/run-examples` สำหรับ run ทั้งหมด

### 7. Validate

> Goal: ตรวจสอบ quality และ coverage

1. รัน examples เพื่อตรวจสอบว่าทำงานได้จริง
2. ตรวจสอบว่าครอบคลุมทุก API
3. ตรวจสอบว่า code ถูกต้องและ runnable
4. จัดรูปแบบด้วย `/run-format` หลังเขียนเสร็จ
5. ตรวจ type errors ด้วย `/run-typecheck`

### 8. Update Documentation

> Goal: เชื่อมต่อ examples เข้ากับ docs

1. สร้าง `examples/README.md` สรุป examples ทั้งหมด
2. เชื่อมต่อ examples กับ API docs
3. ทำตาม `/update-readme-md` เพื่อเพิ่ม examples ในส่วน Usage ของ README.md
4. อัปเดต API Reference ด้วยตารางครบถ้วนตามรูปแบบที่กำหนดใน `/update-readme-md`

## Rules

### 1. Coverage

- ครอบคลุม public API ทุกตัว
- แต่ละ example มี single responsibility ชัดเจน
- ไม่ซ้ำซ้อนกับ tests แต่เสริมกัน
- ทั้ง basic และ advanced usage

### 2. Quality

- Examples รันได้จริง ไม่มี placeholder
- ใช้ best practices ของภาษาและ framework
- อ่านง่าย เข้าใจได้โดยไม่ต้องดู docs

### 3. Structure

- ทุก examples ต้องอยู่ใน `src/` directories
- แต่ละ example มีไฟล์แยก พร้อม comments และ output ที่คาดหวัง
- จัดเรียงตาม modules และ complexity

### 4. Documentation

- มี description สั้นๆ อธิบาย input/output
- `examples/README.md` สรุป examples ทั้งหมด
- README หลักลิงก์ไปยัง examples

### 5. Maintenance

- อัปเดต examples เมื่อ API เปลี่ยน
- รัน examples ใน CI เพื่อ catch breaking changes
- ใช้ `/update-examples` สำหรับสร้างใหม่

## Expected Outcome

- `examples/` directory ครอบคลุม API ทุกตัว
- ทุก example รันได้และผ่าน typecheck
- `examples/README.md` สรุป examples ทั้งหมด
- README หลักมีส่วน Usage พร้อม examples
- ใช้เป็น docs, tests, และ onboarding material ได้
- ผู้ใช้ copy-paste และใช้งานได้ทันที
