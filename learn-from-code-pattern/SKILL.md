---
name: learn-from-code-pattern
description: สกัด reusable patterns จาก code จริงเพื่อนำมาประยุกต์ใช้ใน project
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
related: []
---
## Goal

สกัดความรู้และ reusable patterns จาก code ที่มีอยู่หรือ real-world implementations เพื่อนำมาประยุกต์ใช้

## Scope

ใช้สำหรับเรียนรู้และสกัด patterns จาก codebase ปัจจุบัน, open-source projects, หรือ implementations จริง

## Execute

### 1. Define Pattern Target
> Goal: Define Pattern Target

1. ระบุประเภท pattern (architecture, design, code, data flow)
2. ระบุแหล่ง: codebase ปัจจุบัน, open-source project, หรือ reference implementation
3. ระบุ context ที่ต้องการนำ pattern ไปใช้

### 2. Discover Patterns
> Goal: Discover Patterns

1. ทำ `/scan-codebase` เพื่อค้นหา code patterns
2. ทำ `/scan-codebase` เพื่อ scan หา recurring structures
3. ทำ `/use-ast-grep` สำหรับ AST-based pattern discovery

### 3. Extract And Document
> Goal: Extract And Document

1. จัดกลุ่ม patterns ตามประเภท (structural, behavioral, creational)
2. บันทึกแต่ละ pattern: ชื่อ, คำอธิบาย, code example, use case, pros/cons
3. ระบุ context ที่เหมาะสมและไม่เหมาะสม
4. ระบุ anti-patterns ที่เกี่ยวข้อง

### 4. Validate
> Goal: Validate

1. ตรวจสอบว่า pattern สอดคล้องกับ `/follow-best-practice`
2. ตรวจสอบ version compatibility กับ project
3. ทดสอบ pattern กับ use case จริง

### 5. Apply
> Goal: Apply

1. ทำ `/generalize` เพื่อทำให้ pattern เป็น generic สำหรับ reuse
2. ปรับ pattern ให้เข้ากับ project context ตาม `/follow-architecture`
3. รัน `/run-check` เพื่อตรวจสอบคุณภาพหลัง implement

### 6. Document
> Goal: Document

1. สร้าง pattern documentation ใน `docs/development/patterns/`
2. อัปเดท `AGENTS.md` ถ้า pattern เป็น project-wide convention

## Rules

### Pattern Discovery

- ใช้ `/scan-codebase` สำหรับค้นหา patterns ใน codebase
- ใช้ `/use-ast-grep` สำหรับ AST-based structural pattern matching
- ค้นหาทั้ง positive patterns และ anti-patterns

### Pattern Documentation

- แต่ละ pattern ต้องมี: ชื่อ, คำอธิบาย, code example, use case, pros/cons
- ระบุ context ที่เหมาะสมและไม่เหมาะสม
- ใช้ภาษาที่เข้าใจง่าย ไม่ใช่ academic terminology

### Application Discipline

- ทำ `/generalize` เพื่อทำให้ reusable
- ปรับ pattern ให้เข้ากับ project context ไม่ copy ตรงๆ
- รัน `/run-check` หลัง implement เสมอ

### Non-Duplication

- ใช้ `/learn` สำหรับเรียนรู้ concept หรือ tool ทั่วไป
- ใช้ `/learn-from-web` สำหรับเรียนรู้จาก official documentation
- Workflow นี้เน้นเฉพาะการสกัด patterns จาก real-world code

## Expected Outcome

- Patterns ที่สกัดได้จาก code จริง พร้อม documentation
- Code examples และ use cases ที่ชัดเจน
- การนำ patterns ไปใช้จริงใน project พร้อม quality checks
