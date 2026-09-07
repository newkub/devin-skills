# Fix Guide

(merged from: use-lib-effective)

## Goal

นำ libraries ที่มีอยู่ใน package manifest ไปใช้ใน codebase ให้ครบและครอบคลุม ไม่ reinvent the wheel

## Scope

ใช้เมื่อ review พบ custom code ที่ library ทำให้แล้ว หรือ libraries ที่ติดตั้งไว้ยังไม่ได้ใช้ features สำคัญ

## Execute

### 1. Research Capabilities

> Goal: ศึกษา capabilities ของ libraries ที่มี

1. ทำ `/deep-research` หรือ `/learn-from-web` เพื่อศึกษา documentation, features, best practices
   - ใช้ DeepWiki สำหรับ GitHub repositories ของ libraries
   - ใช้ Context7 สำหรับ API reference — เข้าถึง official documentation เสมอ
2. ระบุ features ที่ยังไม่ได้ใช้งานแต่จะเป็นประโยชน์
3. ตรวจ changelog สำหรับ features ใหม่ที่อาจยังไม่ได้ใช้

### 2. Analyze Type Declarations

> Goal: วิเคราะห์ d.ts เพื่อรู้ APIs ที่พร้อมใช้งาน

1. ค้นหา d.ts files ใน project และ node_modules
2. วิเคราะห์ internal types และ external types
3. ระบุ APIs ที่พร้อมใช้งานจาก dependencies
4. สรุป types ที่ยังไม่ได้ใช้และแนะนำให้ใช้เพิ่มเติม

### 3. Maximize Library Coverage

> Goal: ใช้ libraries ให้ครบและครอบคลุม ไม่ reinvent

1. แทนที่ custom implementation ด้วย library functions ทุกที่ที่เป็นไปได้
2. ระบุ custom code ที่ library มี feature ทำให้แล้ว และแทนที่
3. เปิดใช้งาน features เช่น `tree-shaking`, `lazy loading`
4. ปรับ configuration เพื่อ performance ที่ดีที่สุด
5. ใช้ features เฉพาะที่จำเป็น (`feature flags`)

### 4. Document Patterns

> Goal: บันทึก patterns การใช้งาน

1. สร้าง examples สำหรับการใช้งานที่ซับซ้อน
2. เขียน best practices สำหรับทีม
3. อัปเดต conventions และ standards

## Rules

### 1. No Reinvent The Wheel

- ห้ามเขียน custom implementation ถ้า library ที่มีทำให้แล้ว
- ใช้ library API ให้ครบทุก feature ที่จำเป็น ไม่ใช้แค่ส่วนที่คุ้นเคย
- ตรวจสอบ library documentation ก่อนเขียน utility function ใหม่
- ถ้า library ไม่พอใช้ → ให้ section `## Fix` เลือก alternative ตาม scoring ใน review ไม่เขียนเอง

### 2. Library Selection

- ใช้ `built-in functions` ก่อน external libraries
- ใช้ `monorepo shared packages` ก่อน third-party
- เลือก libraries ที่ `actively maintained`
- พิจารณา `bundle size` สำหรับ frontend

### 3. Effective Usage Patterns

- `HTTP Client`: Connection pooling, retry logic, caching
- `Database ORM`: Query optimization, connection management
- `UI Components`: Tree-shaking, lazy loading
- `Utilities`: Tree-shakeable imports, specific functions
- `Testing`: Parallel execution, proper isolation

### 4. Code Quality

- Wrap external libraries ด้วย `internal abstractions` เมื่อจำเป็น
- ใช้ `type-safe wrappers` สำหรับ dynamic libraries
- Document การใช้งานที่ไม่ตรงตาม conventions

### 5. Performance

- `Dynamic imports` สำหรับ code splitting
- Cache ผลลัพธ์ที่ใช้ซ้ำบ่อย
- Monitor `bundle size` และ `cold start time`

## Expected Outcome

- ไม่มี `custom implementations` ที่ library ทำให้แล้ว
- ลด `code duplication` และ `redundant code`
- `Performance` ของ application ดีขึ้น
- มี `documentation` สำหรับการใช้งาน library ที่ซับซ้อน
