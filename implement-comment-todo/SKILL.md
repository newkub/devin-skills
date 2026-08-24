---
name: implement-comment-todo
description: แปลง TODO, FIXME, HACK เป็น production code แบบ edit-only
---

## Goal

แปลง TODO, FIXME, HACK comments และ placeholder functions ให้กลายเป็น production code ที่ใช้งานได้จริง โดยไม่รัน command ใดๆ

## Scope

Use `implement-comment-todo` for the specific tasks and workflows it covers

## Execute

### 1. Discovery And Inventory
> Goal: Discovery And Inventory

ค้นหาและรวบรวมทุกสิ่งที่ต้อง implement จริง

1. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK` comments ด้วย `Grep`
2. ค้นหา placeholder functions ที่ยังไม่ implement
3. ค้นหา simulated delays และ hard-coded data
4. จัดกลุ่มตาม priority และ dependencies

### 2. Code Modification
> Goal: Code Modification

แก้ไข code ด้วย file editing tools เท่านั้น

1. ใช้ `edit` หรือ `multi_edit` สำหรับแก้ไขไฟล์
2. ใช้ `write_to_file` สำหรับสร้างไฟล์ใหม่
3. Implement functions ตาม business logic ที่ถูกต้อง
4. เชื่อมต่อกับ dependencies ที่จำเป็น (database, API, services)
5. ทำ `/update-reference` เพื่ออัพเดท references ทั้งหมด

### 3. Validation
> Goal: Validation

ตรวจสอบว่าไม่มี TODO เหลือและ code ใช้งานได้จริง

1. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK` อีกครั้งด้วย `Grep`

## Rules

### 1. No Execution

ห้ามรัน command ใดๆ ทำเฉพาะ file editing operations

- ห้ามรัน `run_command` ใดๆ
- ห้ามรัน background process
- ห้ามเปิด `browser_preview`
- ใช้เฉพาะ `edit`, `multi_edit`, `write_to_file`, `read_file`

### 2. No Placeholder Code

แทนที่ทุก placeholder functions ด้วย implementation จริง

- ไม่มี placeholder functions ใน production code
- ไม่มี `TODO`, `FIXME`, `XXX`, `HACK` comments
- ไม่มี simulated delays หรือ hard-coded data
- Functions ต้องมี logic ที่ถูกต้อง

### 3. Code Quality

รักษาคุณภาพโค้ดตามมาตรฐาา

- ผ่าน linting rules ทั้งหมด
- ผ่าน type checking ไม่มี errors
- ใช้ import และ export strategy ตาม `/follow-import-export`
- ทำตาม `/follow-code-quality`

## Expected Outcome

- `TODO`, `FIXME`, `HACK` ถูกแปลงเป็น production code
- Placeholder functions ถูก implement จริง
- Code ผ่าน linting และ type checking
- ไม่มี command ถูกรันใดๆ
