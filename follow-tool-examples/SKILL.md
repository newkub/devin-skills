---
name: follow-tool-examples
description: เขียน examples ครอบคลุม API ทุกตัวในโปรเจกต์สำหรับ docs และ onboarding
---

## Goal

เขียน examples ครอบคลุมทุก API ในโปรเจกต์ เพื่อใช้เป็น docs, tests, และ onboarding material

## Scope

ใช้สำหรับสร้างหรือปรับปรุง examples ใน `examples/` directory ของ library หรือ package

## Execute

### 1. Analyze APIs

> Goal: ค้นหาและจัดกลุ่ม public APIs ทั้งหมด

1. ทำ `/scan-codebase` เพื่อหา public APIs ทั้งหมด (exports, functions, classes, types)
2. อ่าน `package.json` exports field เพื่อหา entry points
3. จัดกลุ่ม APIs ตาม module/domain

### 2. Plan Examples

> Goal: วางแผน examples ตาม module และ use case

1. สร้าง 1 example file ต่อ module/domain ใน `examples/`
2. แต่ละ example ครอบคลุม use case จริง ไม่ใช่แค่ hello world
3. รวม edge cases และ error handling
4. เพิ่ม comments อธิบายเป็นภาษาที่เข้าใจง่าย

### 3. Write Examples

> Goal: เขียน examples ที่รันได้จริงและครอบคลุม use cases

1. ใช้ TypeScript เป็น default language
2. แต่ละ example รันได้ด้วย `bun run examples/<name>.ts`
3. ใช้ `console.log` สำหรับแสดงผลลัพธ์
4. จัดรูปแบบด้วย `/run-format` หลังเขียนเสร็จ
5. ตรวจ type errors ด้วย `/run-typecheck`

### 4. Test Examples

> Goal: รันและตรวจสอบทุก example ทำงานถูกต้อง

1. รันทุก example ด้วย `bun run examples/<name>.ts`
2. ตรวจว่า output ถูกต้องตาม expected
3. ถ้ามี error → แก้และรันใหม่
4. ใช้ `/run-examples` สำหรับ run ทั้งหมด

### 5. Document

> Goal: สร้าง `README.md` และเชื่อมต่อ examples กับ docs

1. สร้าง `examples/README.md` สรุป examples ทั้งหมด
2. เชื่อมต่อ examples กับ API docs
3. เพิ่ม examples ใน `README.md` ของ package

## Rules

### 1. Coverage

- ครอบคลุม public API ทุกตัว
- แต่ละ example มี single responsibility ชัดเจน
- ไม่ซ้ำซ้อนกับ tests แต่เสริมกัน

### 2. Quality

- Examples รันได้จริง ไม่มี placeholder
- ใช้ best practices ของภาษาและ framework
- อ่านง่าย เข้าใจได้โดยไม่ต้องดู docs

### 3. Maintenance

- อัปเดต examples เมื่อ API เปลี่ยน
- รัน examples ใน CI เพื่อ catch breaking changes
- ใช้ `/write-examples` สำหรับสร้างใหม่

## Expected Outcome

- `examples/` directory ครอบคลุม API ทุกตัว
- ทุก example รันได้และผ่าน typecheck
- `examples/README.md` สรุป examples ทั้งหมด
- ใช้เป็น docs และ onboarding material ได้
