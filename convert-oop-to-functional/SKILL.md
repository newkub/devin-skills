---
name: convert-oop-to-functional
description: แปลง OOP code เป็น functional programming patterns
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - run-test
  - run-lint
  - run-typecheck
---

## Goal

แปลง OOP code (classes, inheritance, stateful objects) เป็น functional programming patterns (pure functions, composition, immutability)

## Scope

ใช้สำหรับแปลง OOP patterns เป็น functional patterns:
- Classes → Pure functions + data structures
- Inheritance → Composition
- Stateful objects → Immutable data
- Methods → Functions
- Encapsulation → Module exports

## Execute

### 1. Analyze OOP Code
> Goal: Analyze OOP Code

วิเคราะห์ OOP code ปัจจุบัน

1. ค้นหา `class` definitions ด้วย `ast-grep`
2. ระบุ classes ที่มี state (instance variables)
3. ระบุ inheritance hierarchies
4. ระบุ methods ที่ mutate state
5. ระบุ static methods ที่เป็น pure functions อยู่แล้ว

### 2. Convert Classes to Data Structures
> Goal: Convert Classes to Data Structures

แปลง classes เป็น data structures

1. สร้าง `types/` สำหรับ data structures (interfaces, types)
2. แปลง class properties เป็น type fields
3. ใช้ `readonly` หรือ `as const` สำหรับ immutability
4. แยก data types ออกจาก functions

### 3. Convert Methods to Functions
> Goal: Convert Methods to Functions

แปลง methods เป็น standalone functions

1. แปลง instance methods เป็น functions ที่รับ data เป็น parameter
2. แปลง static methods เป็น pure functions
3. ใช้ functional programming patterns (map, filter, reduce)
4. จัดกลุ่ม functions ตาม responsibilities

### 4. Replace Inheritance with Composition
> Goal: Replace Inheritance with Composition

แทนที่ inheritance ด้วย composition

1. ระบุ shared logic ใน base classes
2. แยก shared logic เป็น reusable functions
3. ใช้ function composition แทน inheritance
4. ใช้ module exports สำหรับ shared utilities

### 5. Apply Functional Core Imperative Shell
> Goal: Apply Functional Core Imperative Shell

ใช้ Functional Core, Imperative Shell pattern

1. แยก business logic เป็น pure functions และ side effects เป็น shell layer
2. แยก business logic เป็น pure functions
3. แยก side effects (API, I/O, state mutations) เป็น shell
4. ใช้ dependency injection สำหรับ external dependencies

### 6. Refactor State Management
> Goal: Refactor State Management

แปลง stateful code เป็น immutable

1. ระบุ state mutations (assignments, property updates)
2. แปลงเป็น immutable updates (spread operator, immutable libraries)
3. ใช้ state management libraries ถ้าจำเป็น (Solid stores, signals)
4. แยก state logic ออกจาก business logic

### 7. Verify Quality
> Goal: Verify Quality

ตรวจสอบคุณภาพหลังแปลง

1. ทำ `/run-lint` และ `/run-typecheck`
2. ทำ `/run-test` เพื่อตรวจสอบว่าไม่มี regression
3. ตรวจสอบว่า functions เป็น pure functions
4. ตรวจสอบว่าไม่มี side effects ใน core layer

## Rules

### 1. Data vs Functions

แยก data structures ออกจาก functions

- Data types อยู่ใน `types/` หรือ `models/`
- Functions อยู่ใน `utils/`, `services/`, หรือ `core/`
- Data เป็น immutable
- Functions ไม่ mutate input parameters

### 2. Pure Functions

Functions ควรเป็น pure functions เมื่อเป็นไปได้

- Input → Output deterministic
- ไม่มี side effects
- ไม่ mutate state
- Test ได้ง่ายโดยไม่ต้อง mock

### 3. Composition

ใช้ composition แทน inheritance

- ใช้ function composition
- ใช้ module exports สำหรับ shared logic
- ใช้ higher-order functions
- ใช้ pipeline patterns

### 4. Immutability

ใช้ immutable data patterns

- ใช้ `readonly` สำหรับ types
- ใช้ spread operator สำหรับ updates
- ใช้ immutable libraries ถ้าจำเป็น
- หลีกเลี่ยง direct mutations

## Expected Outcome

- OOP code แปลงเป็น functional patterns
- Classes แปลงเป็น data structures + functions
- Inheritance แปลงเป็น composition
- Stateful code แปลงเป็น immutable
- Code ผ่าน lint, typecheck, และ test
- Functions เป็น pure functions ส่วนใหญ่
- Business logic แยกจาก side effects
