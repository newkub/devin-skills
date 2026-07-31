---
name: follow-functional-core-imperative-shell
description: แยก pure functions จาก side effects ด้วย Functional Core, Imperative Shell pattern
---

## Goal

แยก business logic เป็น pure functions และ side effects เป็น imperative shell เพื่อให้ code testable และ maintain ได้ง่าย

## Scope

ใช้สำหรับแยก pure functions จาก side effects ในทุก workspace:
- ใช้กับ business logic ที่มี side effects ผสมกัน
- ใช้กับ functions ที่ยากต่อการ test
- ใช้กับ code ที่มี dependencies ซับซ้อน

## Execute

### 1. Identify Pure and Impure Code

ระบุส่วนที่เป็น pure และ impure

1. วิเคราะห์ functions ที่มี side effects: `API calls`, `DOM access`, `I/O`, `state mutations`
2. ระบุ business logic ที่ pure และไม่มี dependencies
3. ระบุ validation logic ที่สามารถเป็น pure functions
4. ระบุ data transformation ที่สามารถเป็น pure functions
5. ทำตาม `/functional-programming`

### 2. Extract Functional Core

แยก pure functions ออกมาเป็น core layer

1. สร้าง `core/` หรือ `utils/` สำหรับ pure functions
2. ย้าย business logic เป็น pure functions
3. ย้าย validation logic เป็น pure functions
4. ย้าย data transformation เป็น pure functions
5. ทำตาม `/refactor`

### 3. Design Imperative Shell

สร้าง layer สำหรับจัดการ side effects

1. สร้าง `shell/` หรือ `services/` สำหรับ impure functions
2. ย้าย `API calls` ไปยัง shell layer
3. ย้าย `I/O operations` ไปยัง shell layer
4. ย้าย `state mutations` ไปยัง shell layer
5. ย้าย `external dependencies` ไปยัง shell layer

### 4. Implement Dependency Injection

ใช้ dependency injection สำหรับ impure dependencies

1. กำหนด interfaces หรือ types สำหรับ dependencies
2. inject dependencies เป็น parameters ใน shell functions
3. shell functions เรียก core functions เท่านั้น
4. core functions ไม่รู้จัก shell หรือ external dependencies
5. ทำตาม `/refactor`

### 5. Validate Separation

ตรวจสอบว่า core และ shell แยกกันอย่างชัดเจน

1. ตรวจสอบว่า core functions เป็น pure functions
2. ตรวจสอบว่า shell functions จัดการ side effects เท่านั้น
3. ตรวจสอบว่า core ไม่มี dependencies ไปยัง shell
4. ตรวจสอบว่า shell เรียก core functions เท่านั้น
5. รัน tests เพื่อยืนยันว่า functionality ยังทำงาน
6. ทำตาม `/refactor-workspace`

## Rules

### 1. Functional Core

Core layer ต้องเป็น pure functions เท่านั้น

- Business logic เป็น pure functions
- Validation logic เป็น pure functions
- Data transformation เป็น pure functions
- ไม่มี side effects
- ไม่มี external dependencies
- Input → Output deterministic
- Test ได้ง่ายโดยไม่ต้อง mock

### 2. Imperative Shell

Shell layer จัดการ side effects เท่านั้น

- `API calls` อยู่ใน shell
- `I/O operations` อยู่ใน shell
- `State mutations` อยู่ใน shell
- `External dependencies` อยู่ใน shell
- Shell เรียก core functions เท่านั้น
- Shell ไม่มี business logic

### 3. Dependency Flow

Core ไม่รู้จัก shell หรือ external dependencies

- Core functions ไม่ import จาก shell
- Shell functions import จาก core เท่านั้น
- ใช้ dependency injection สำหรับ external dependencies
- Core รับ dependencies ผ่าน parameters ถ้าจำเป็น
- Core เป็น pure functions ที่ standalone

### 4. File Organization

จัดโครงสร้างโฟลเดอร์ตาม responsibilities

```
src/
├── core/           # pure functions (business logic, validation, transformation)
├── shell/          # side effects (API, I/O, state mutations)
├── types/          # shared types และ interfaces
└── utils/          # pure functions ที่ไม่ใช่ business logic
```

## Expected Outcome

- Business logic เป็น pure functions ที่ test ได้ง่าย
- Side effects แยกออกจาก business logic
- Core ไม่มี dependencies ไปยัง shell
- Shell เรียก core functions เท่านั้น
- Code ง่ายต่อการ test และ maintain
- Dependency flow ชัดเจน
