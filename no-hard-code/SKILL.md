---
name: no-hard-code
description: ลบ hard code ออกจาก codebase ด้วย environment variables, config, constants
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

## Goal

ลบ hard code ทั้งหมดออกจาก codebase เพื่อเพิ่ม flexibility, security และ maintainability

## Scope

Use `no-hard-code` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Identify Hard Code

ค้นหา hard code ใน codebase

- ใช้ `Grep` เพื่อค้นหา magic numbers ด้วย patterns
- ใช้ `Grep` เพื่อค้นหา hardcoded strings ที่ไม่ใช่ messages
- ใช้ `Grep` เพื่อค้นหา hardcoded URLs และ API endpoints
- ใช้ `Grep` เพื่อค้นหา hardcoded paths และ filenames
- ทำ `run-secret-scanning` เพื่อค้นหา secrets หรือ sensitive data
- ใช้ `Grep` เพื่อค้นหา business rules ที่ hardcoded

### 2. Replace Magic Values

แทนที่ magic values ด้วย named constants

- สร้าง constants files สำหรับ magic numbers
- ตั้งชื่อ constants ให้มีความหมายชัดเจน
- จัดกลุ่ม constants ตาม context
- ใช้ const หรือ readonly สำหรับ constants
- ทำ `/update-reference` เพื่อแทนที่ magic values ด้วย constants

### 3. Extract Configuration

แยก configuration ออกจาก code

- ทำ `/follow-config` เพื่อสร้าง config files สำหรับ environment-specific values
- ใช้ environment variables สำหรับ secrets
- ใช้ runtime config สำหรับ dynamic values
- ใช้ config objects สำหรับ related settings
- ใช้ type-safe config ด้วย TypeScript

### 4. Externalize Business Rules

ทำให้ business rules เป็น configurable

- แยก business rules ออกจาก logic
- สร้าง rule engines หรือ config สำหรับ rules
- ใช้ feature flags สำหรับ conditional behavior
- ใช้ strategy pattern สำหรับ interchangeable logic
- ทำ `/update-docs` เพื่อ Document business rules อย่างชัดเจน

### 5. Externalize URLs and Paths

แยก URLs และ paths ออกจาก code

- สร้าง constants สำหรับ base URLs
- ใช้ environment variables สำหรับ API endpoints
- ใช้ path builders สำหรับ dynamic paths
- ใช้ config สำหรับ file paths
- ทำ `/update-reference` เพื่อใช้ relative paths แทน absolute เมื่อเป็นไปได้

### 6. Secure Secrets

จัดการ secrets อย่างปลอดภัย

- ทำ `/follow-config` เพื่อใช้ environment variables สำหรับ secrets
- ใช้ secret management services
- ไม่ commit secrets ไปยัง version control
- ใช้ .env files สำหรับ local development
- Rotate secrets เป็นประจำ

### 7. Validate

ตรวจสอบว่าไม่มี hard code เหลืออยู่

- ทำ `/run-lint` เพื่อตรวจสอบด้วย lint rules สำหรับ detect hard code
- ทำ `/resolve-errors` เพื่อตรวจสอบ code อย่าง manual
- ตรวจสอบใน environments ต่างๆ
- ตรวจสอบว่า configuration ถูกต้อง
- ทำ `/update-docs` เพื่อ Document configuration ทั้งหมด

## Rules

## Rules

### 1. Analysis Requirements

ตรวจสอบและวิเคราะห์ hard code ใน codebase

- ค้นหา magic numbers, strings, URLs, paths
- ตรวจสอบ secrets และ sensitive data
- วิเคราะห์ business rules ที่ hardcoded
- ระบุ dependencies ที่ externalize ได้

### 2. Refactoring Principles

หลักการในการ refactor hard code

- ใช้ named constants สำหรับ magic values
- แยก configuration ออกจาก business logic
- ทำให้ business rules เป็น configurable
- ใช้ environment variables สำหรับ secrets
- รักษา type safety ของ configuration

### 3. Integration Order

ลำดับการ integrate การแก้ไข

- Replace magic values ก่อน
- Extract configuration ต่อไป
- Externalize business rules หลังจากนั้น
- Externalize URLs และ paths
- Secure secrets สุดท้าย
- ตรวจสอบและ validate ทั้งหมด

### 4. File Operations

การจัดการไฟล์เมื่อ refactor

- สร้าง constants files สำหรับ magic values
- สร้าง config files สำหรับ environment-specific values
- สร้าง .env.example สำหรับ local development
- อัพเดท references ด้วย `/update-reference` สำหรับไฟล์ที่ลบ
- Update documentation สำหรับ configuration changes

### 5. Report Format

ระบุรูปแบบรายงาน

- ทำ `/report-table` สำหรับสรุปผลลัพธ์

## Expected Outcome

## Expected Outcome

- ไม่มี magic values ใน code
- Configuration แยกออกจาก code
- Business rules เป็น configurable
- URLs และ paths externalized
- Secrets จัดการอย่างปลอดภัย
- Code ที่ maintain ได้ง่ายขึ้น
- Configuration ที่ document ครบถ้วน
- Security ที่ดีขึ้น
