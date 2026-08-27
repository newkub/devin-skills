---
name: follow-tool-validator
description: ใช้งาน validator ใน project สำหรับ data, forms, API payloads, และ schemas
related:
  - follow-tool-linter
  - follow-lib-zod
  - write-test
---

## Goal

ใช้งาน validator ใน project เพื่อตรวจสอบ data, forms, API payloads, และ schemas อย่าง type-safe และ consistent

## Scope

ใช้สำหรับ projects ที่ต้อง validate input ทั้งภายนอก (API, forms, CLI args) และภายใน (function arguments, config) รองรับ TypeScript, Rust, Python, Go

## Execute

### 1. Select Validator

> Goal: เลือก validator ตาม tech stack

1. ตรวจสอบ tech stack ของ project
2. เลือก validator ตามความเหมาะสม:
   - TypeScript/JavaScript: zod, valibot, yup, joi, class-validator
   - Rust: validator crate, garde, serde_json schema
   - Python: pydantic, marshmallow, cerberus
   - Go: go-playground/validator, govalidator
3. ถ้ามี existing schemas อยู่แล้ว → ใช้ตัวเดิม ถ้าไม่มี → เลือกตาม ecosystem ที่แนะนำ

### 2. Define Schemas

> Goal: กำหนด validation schemas สำหรับทุก input

1. สร้าง schema สำหรับแต่ละ domain model / DTO / form
2. ใช้ type inference จาก validator ถ้ามี (เช่น `z.infer<typeof Schema>`)
3. กำหนด custom error messages ทีอ่านง่าย
4. แยก schema ไฟล์ตาม domain/feature ไม่รวมทั้งหมดในไฟล์เดียว
5. ถ้า schema ใช้ซ้ำหลายที → สร้าง shared schema แล้ว compose

### 3. Validate In Code

> Goal: เรียกใช้ validator ในจุดที่เหมาะสม

1. ใช้ validation ในขั้น boundary: API handler, controller, CLI input, form submit
2. ไม่ validate ซ้ำซ้อนภายใน business logic
3. แปลง validation error เป็น domain error ที caller เข้าใจ
4. ใช้ `parse`/`safeParse` หรือ equivalent ตาม library
5. ถ้า validation fail → throw หรือ return structured error ทีระบุ field

### 4. Handle Errors

> Goal: จัดการ validation errors อย่างสม่ำเสมอ

1. สร้าง error format มาตรฐาน: `{ field, message, code }`
2. ใช้ `flatten` หรือ `formatError` ของ library ถ้ามี
3. ถ้า API → ส่ง 400 พร้อม field-level errors
4. ถ้า CLI → แสดง readable message แล้ว exit ด้วย non-zero
5. ถ้า form → bind error กลับไปยัง field

### 5. Test Validation

> Goal: ทดสอบ schemas และ error cases

1. ทำ `/write-test` สำหรับ happy path, invalid type, missing field, edge cases
2. ทดสอบ custom error messages
3. ทดสอบ schema composition/refinement
4. รัน `/run-test` เพื่อ verify

## Rules

### 1. Type Safety

- ใช้ type inference จาก validator เมื่อทำได้
- ไม่ใช้ `any` สำหรับ validated data
- แยก domain types ออกจาก schema types ถ้าจำเป็น

### 2. Single Source Of Truth

- ห้าม duplicate schema logic หลายที
- ใช้ schema composition แทนการ copy-paste
- shared schema อยู่ใน `shared/schemas/` หรือ `domain/schemas/`

### 3. Error Clarity

- error message ต้องบอก field, expected value, และ actual value ถ้าได้
- ใช้ error code เพื่อ handle ใน caller
- ไม่ expose internal detail ทีอาจเปลี่ยนแปลง

### 4. No Validation In Business Logic

- business logic รับ input ที่ validated แล้ว
- ถ้าต้อง validate ใน business logic → ควรย้ายไป schema layer
- ห้ามใช้ manual `if (!x) throw` แทน schema validation

## Expected Outcome

- Validator ถูกเลือกและติดตั้งถูกต้องตาม tech stack
- Schemas ครอบคลุมทุก boundary input
- Validation errors สม่ำเสมอและ readable
- Tests ครอบคลุม happy path และ invalid cases
- Business logic ไม่ซ้ำซ้อน validation
