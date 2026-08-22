---
name: follow-validation
description: กำหนด validation strategy ด้วย pure functions และ schema validation สำหรับทุก project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - O
  - catch
  - output
---

## Goal

กำหนด validation strategy ที่ type-safe ทั้ง runtime และ compile-time โดยแยก business rule validation จาก input/output validation

## Scope

ใช้สำหรับทุก project ที่ต้องการ validation ที่ testable, reusable, และไม่ผูกกับ framework

## Execute

### 1. Identify Validation Types

> Goal: ระบุประเภท validation ที่ project ต้องการ
> Goal: รู้ว่าต้อง validate อะไรและที่ไหน

1. Input validation - ตรวจข้อมูลจากผู้ใช้: HTTP request body, query params, CLI args, form input
2. Business rule validation - ตรวจ business constraints: invariants, policies, domain rules
3. Output validation - ตรวจข้อมูลจากภายนอก: API responses, database results, third-party data
4. ถ้า project มีหลาย layers → ระบุว่าแต่ละ layer ต้อง validate อะไร
5. ถ้าไม่ชัดว่ามีกี่ layers → ใช้ input/business/output เป็น minimum

### 2. Implement Business Rule Validation

> Goal: เขียน business rule validators เป็น pure functions
> Goal: Business rules เป็น pure functions ที่ test ได้โดยไม่ต้อง mock

1. เขียน validation เป็น pure functions ที่ return `Result<T, ValidationError>`
2. ใช้ `readonly` input types
3. ไม่มี side effects: ไม่ throw, ไม่ log, ไม่ I/O
4. รวม business rules เป็น predicates: `isAvailable()`, `canBook()`, `isValidPrice()`
5. ทำ `/follow-functional-programming` เพื่อรักษา purity
6. ถ้า project ใช้ schema library (Zod, Valibot) → ใช้สำหรับ input/output เท่านั้น ไม่ใช้ใน business rules

### 3. Implement Input Validation

> Goal: เขียน input schemas โดยใช้ schema library
> Goal: Input จากภายนอกถูก validate ก่อนเข้าระบบ

1. ทำ `/follow-zod` ถ้า project ใช้ Zod (หรือ schema library ที่ตรวจพบ)
2. กำหนด schemas ในที่เหมาะสมตาม project structure
3. ใช้ `.safeParse()` สำหรับ user input เพื่อ return result object
4. ใช้ `.parse()` สำหรับ internal critical validation ที่ต้องการ throw
5. Infer types จาก schemas ด้วย `z.infer<typeof schema>` — ไม่ manual type
6. แปลง validation errors เป็น structured error responses

### 4. Implement Output Validation

> Goal: เขียน output validation สำหรับ external data
> Goal: ข้อมูลจากภายนอกถูก validate ก่อนนำไปใช้

1. กำหนด response schemas สำหรับ external API responses
2. ใช้ `.safeParse()` สำหรับ external data — ไม่ trust external input
3. แปลง external format เป็น internal types หลัง validation ผ่าน
4. ถ้า validation fail → log error และ return error result
5. ไม่ส่ง raw external data ไปยัง business logic โดยไม่ validate

### 5. Compose Validation Pipeline

> Goal: เรียงลำดับ validation จากนอกเข้าใน
> Goal: Validation flow ชัดเจน ไม่ซ้ำซ้อน

1. Input validation → กรอง malformed data ก่อนเข้าระบบ
2. Business rule validation → ตรวจ business constraints ก่อน execute logic
3. Output validation → ตรวจ external data integrity ก่อนนำไปใช้
4. ไม่ duplicate validation — แต่ละจุด validate ที่ responsibility ของตัวเอง
5. ถ้า project มีหลาย layers → แต่ละ layer validate ที่ responsibility ของตัวเอง

### 6. Test Validation Logic

> Goal: ทำ `/write-test` เพื่อทดสอบ validation ทุกประเภท
> Goal: Validation logic มี test coverage ครบ

1. Unit tests สำหรับ business rule validators — test pure functions โดยตรง
2. Unit tests สำหรับ schema validation — test valid/invalid/edge cases
3. Integration tests สำหรับ validation pipeline — ตรวจ flow  end-to-end
4. Test error messages ว่าชัดเจนและเป็นประโยชน์ต่อผู้ใช้
5. ใช้ `.safeParse()` ใน tests เพื่อตรวจ result ไม่ใช่ try/catch

## Rules

### 1. Validation Types

| Type | Purpose | Tool | Style |
|------|---------|------|-------|
| Input | ตรวจข้อมูลจากผู้ใช้ | Schema library (Zod) | `.safeParse()` |
| Business rule | ตรวจ business constraints | Pure functions | `Result` type |
| Output | ตรวจข้อมูลจากภายนอก | Schema library (Zod) | `.safeParse()` |

### 2. Business Rule Validation Rules

- Business rule validators เป็น `pure functions` เท่านั้น
- ไม่ import schema library ใน business rule validators
- Return `Result<T, ValidationError>` ไม่ throw
- ใช้ `readonly` input types
- ไม่มี side effects: ไม่ log, ไม่ I/O, ไม่ mutate

### 3. Schema Validation Rules

- ใช้ `.safeParse()` สำหรับ user input และ external data
- ใช้ `.parse()` เฉพาะ critical internal validation
- Infer types จาก schemas ด้วย `z.infer` — ไม่ manual type definitions
- Schemas ต้อง reusable และ composable
- จัดระเบียบ schemas ตาม module หรือ feature

### 4. Error Handling

- แยก error types ตาม validation ประเภท: `ValidationError`, `BusinessRuleError`, `ExternalDataError`
- ไม่ leak internal error messages ไปยังผู้ใช้
- แปลง errors เป็น user-friendly messages ที่ boundary ก่อนส่งออก
- Validation errors ต้องมี field path และ message ที่ชัดเจน
- ใช้ structured error responses ไม่ใช่ plain strings

### 5. Anti-Patterns

- ห้าม validate เดียวกันซ้ำ — แต่ละจุด validate ที่ responsibility ของตัวเอง
- ห้าม throw exceptions ใน business rule validators — ใช้ `Result` type
- ห้ามส่ง raw external data ไปยัง business logic โดยไม่ validate
- ห้ามใช้ `any` เพื่อข้าม validation — ใช้ `unknown` แล้ว validate
- ห้ามผูก validation กับ framework — แยก validation logic จาก framework code

## Expected Outcome

- Validation strategy ที่ type-safe ทั้ง runtime และ compile-time
- Business rule validators เป็น pure functions ที่ test ได้โดยไม่ต้อง mock
- Input และ output validation ใช้ schema library ที่ type-safe
- Validation pipeline ที่ชัดเจน ไม่ซ้ำซ้อน
- Error handling ที่ structured และ user-friendly
- Test coverage ครบสำหรับ validation logic ทุกประเภท
