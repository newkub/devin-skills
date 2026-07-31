---
name: use-lib-effective
description: วิเคราะห์ dependencies และใช้งาน libraries ให้ครบและครอบคลุม ไม่ reinvent
---

## Goal

นำ libraries ที่มีอยู่ใน package manifest ไปใช้ใน codebase ให้ครบและครอบคลุม ไม่ reinvent the wheel

## Scope

ใช้สำหรับทุก workspace ที่มี dependencies ใน package manifest เพื่อให้ library ทุกตัวถูกใช้งานอย่างมีประสิทธิภาพ

## Execute

### 1. Deep Analyze

วิเคราะห์ dependencies และ usage แบบลึกซึ้งครบทุกมิติ

> Goal: รู้ dependencies ทั้งหมด, usage patterns, และ custom implementations ที่ library ทำให้แล้ว

1. ทำ `/deep-analyze` เพื่อวิเคราะห์โปรเจกต์อย่างลึกซึ้ง ครอบคลุม architecture, code quality, dependencies และ tech stack
2. ทำ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ dependencies และ usage patterns เฉพาะส่วน
3. อ่าน `package manifest` เช่น `package.json`, `Cargo.toml`, `pyproject.toml` แบบ parallel
4. สร้างรายการ dependencies พร้อม categorize ตาม purpose
5. ระบุ dependencies ที่ซ้ำซ้อนหรือทำงานคล้ายกัน
6. วิเคราะห์ dependency graph และ coupling ระหว่าง libraries

### 2. Research Capabilities Via Web

ศึกษา capabilities ของ libraries ที่มี จาก official documentation และเอกสารภายนอก

> Goal: รู้ features ที่ library มีแต่ยังไม่ได้ใช้ และ best practices สำหรับการใช้งาน

1. ทำ `/learn-from-web` เพื่อศึกษา documentation และ features ของ libraries ที่ใช้
   - ใช้ DeepWiki สำหรับ GitHub repositories ของ libraries
   - ใช้ Context7 สำหรับ libraries และ frameworks API reference
   - ใช้ Web Search เป็น fallback สำหรับเอกสารเพิ่มเติม
   - เข้าถึง Official Documentation เสมอ
2. ระบุ features ที่ยังไม่ได้ใช้งานแต่จะเป็นประโยชน์
3. ค้นหา best practices และ patterns สำหรับการใช้งานแต่ละ library
4. ตรวจสอบ library changelog สำหรับ features ใหม่ที่อาจยังไม่ได้ใช้
5. ทำ `/use-lib-better` เพื่อเปรียบเทียบกับ alternative libraries ที่ดีกว่า

### 3. Analyze Type Declarations

วิเคราะห์ type declarations เพื่อรู้ APIs ที่พร้อมใช้งาน

> Goal: รู้ APIs ที่พร้อมใช้งานจาก dependencies ที่ยังไม่ได้ใช้

1. ทำ `/check-type-declarations` เพื่อค้นหาและวิเคราะห์ d.ts files
2. ค้นหา d.ts files ใน project และ node_modules
3. วิเคราะห์ internal types และ external types
4. ระบุ APIs ที่พร้อมใช้งานจาก dependencies
5. สรุป types ที่ยังไม่ได้ใช้และแนะนำให้ใช้เพิ่มเติม

### 4. Maximize Library Coverage

ใช้ libraries ให้ครบและครอบคลุม ไม่ reinvent

> Goal: แทนที่ custom implementations ด้วย library functions ทุกที่ที่เป็นไปได้

1. แทนที่ custom implementation ด้วย library functions ทุกที่ที่เป็นไปได้
2. ระบุ custom code ที่ library มี feature ทำให้แล้ว และแทนที่
3. เปิดใช้งาน features เช่น `tree-shaking`, `lazy loading`
4. ปรับ configuration เพื่อ performance ที่ดีที่สุด
5. ใช้ features เฉพาะที่จำเป็น (`feature flags`)
6. ตรวจสอบว่าใช้ library API ครบทุก feature ที่จำเป็น ไม่เขียนเอง

### 5. Document Patterns

บันทึก patterns การใช้งาน

> Goal: มี documentation สำหรับการใช้งาน library ที่ซับซ้อน

1. สร้าง examples สำหรับการใช้งานที่ซับซ้อน
2. เขียน best practices สำหรับทีม
3. อัพเดท conventions และ standards

## Rules

### 1. No Reinvent The Wheel

ใช้ libraries ให้ครบและครอบคลุม ไม่เขียนเองสิ่งที่ library ทำให้แล้ว

- ห้ามเขียน custom implementation ถ้า library ที่มีทำให้แล้ว
- ใช้ library API ให้ครบทุก feature ที่จำเป็น ไม่ใช้แค่ส่วนที่คุ้นเคย
- ตรวจสอบ library documentation ก่อนเขียน utility function ใหม่
- แทนที่ custom code ด้วย library function ทุกที่ที่เป็นไปได้
- ถ้า library ไม่พอใช้: ทำ `/use-lib-better` เพื่อหาที่ดีกว่า ไม่เขียนเอง

### 2. Library Selection

เลือก libraries ที่เหมาะสมสำหรับโปรเจกต์

- ใช้ `built-in functions` ก่อน external libraries
- ใช้ `monorepo shared packages` ก่อน third-party
- เลือก libraries ที่ `actively maintained`
- พิจารณา `bundle size` สำหรับ frontend

### 3. Effective Usage Patterns

ใช้งาน libraries อย่างมีประสิทธิภาพ

- `HTTP Client`: Connection pooling, retry logic, caching
- `Database ORM`: Query optimization, connection management
- `UI Components`: Tree-shaking, lazy loading
- `Utilities`: Tree-shakeable imports, specific functions
- `Testing`: Parallel execution, proper isolation

### 4. Code Quality

รักษาคุณภาพโค้ดเมื่อใช้ external libraries

- Wrap external libraries ด้วย `internal abstractions` เมื่อจำเป็น
- ใช้ `type-safe wrappers` สำหรับ dynamic libraries
- Document การใช้งานที่ไม่ตรงตาม conventions

### 5. Performance

Optimize performance เมื่อใช้ libraries

- `Dynamic imports` สำหรับ code splitting
- Cache ผลลัพธ์ที่ใช้ซ้ำบ่อย
- Monitor `bundle size` และ `cold start time`

## Expected Outcome

- รายการ `dependencies` ทั้งหมดพร้อม categorize ตาม purpose
- ไม่มี `custom implementations` ที่ library ทำให้แล้ว
- ลด `code duplication` และ `redundant code`
- `Performance` ของ application ดีขึ้น
- มี `documentation` สำหรับการใช้งาน library ที่ซับซ้อน
- พร้อมสำหรับ `/realize-implementation`
