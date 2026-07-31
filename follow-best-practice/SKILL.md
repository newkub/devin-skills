---
name: follow-best-practice
description: เขียนตาม best practices จาก context นั้นๆ
---

## Goal

เขียนตาม best practices จาก context นั้นๆ

## Scope

ใช้สำหรับทุก workspace และทุกประเภทงาน (code, workflow, config, documentation) เพื่อให้ผลลัพธ์มีคุณภาพสูงและเป็นไปตามมาตรฐาน

## Execute

### 1. Analyze Context

1. ระบุ context ของงานที่ทำ (code, workflow, config, documentation, ฯลฯ)
2. ถ้าเป็น code: อ่าน `package.json`, `Cargo.toml`, หรือ package manifest ที่เกี่ยวข้อง
3. ถ้าเป็น code: ระบุ language, runtime, และ libraries ที่ใช้
4. สรุป tech stack หรือ tools ที่เกี่ยวข้องกับ context นั้นๆ

### 2. Research Best Practices

1. ระบุ library, framework หรือ tool ที่ต้องการเรียนรู้ best practices
2. ทำตาม `/learn-from-web` สำหรับ systematic learning จาก web sources
3. ทำตาม `/deep-research` เมื่อต้องการข้อมูลลึกจาก multiple sources
4. ตรวจสอบว่าข้อมูลเป็นปัจจุบัน

### 3. Apply Best Practices

1. อ่านไฟล์ที่ต้องปรับปรุงทั้งหมด
2. วิเคราะห์ว่าไฟล์เหล่านี้ต้องการปรับปรุงอะไรตาม best practices ของ context นั้นๆ
3. แก้ไขไฟล์ตาม best practices ที่เรียนรู้มา
4. ตรวจสอบความสอดคล้องกับสิ่งที่มีอยู่แล้ว
5. อัพเดท configuration และ settings ที่เกี่ยวข้อง
6. ระบุ patterns และ conventions ที่แนะนำ

### 4. Verify Implementation

1. รัน linter และ typecheck เพื่อตรวจสอบ
2. รัน tests เพื่อยืนยันว่าไม่มี regression
3. ตรวจสอบว่า best practices ถูกนำไปใช้ครบถ้วน
4. อัพเดท documentation หากจำเป็น
5. ทดลองใช้งานตาม best practices
6. บันทึก lessons learned

## Rules

### 1. Research Sources

ใช้ sources ที่เชื่อถือได้สำหรับ best practices

- Official documentation เป็น primary source
- Community guidelines และ style guides
- Well-known blogs และ articles
- GitHub repositories ที่มีคนใช้เยอะ
- Stack Overflow สำหรับ common issues
- ใช้ `/learn-from-web` เป็น primary workflow สำหรับ learning
- ใช้ `/deep-research` เมื่อต้องการข้อมูลลึกจาก multiple sources

### 2. Language-Specific Conventions

ทำตาม conventions ของแต่ละ language

- TypeScript: ทำตาม TypeScript best practices
- Rust: ทำตาม Rust guidelines
- Go: ทำตาม Go conventions
- Python: ทำตาม PEP 8 และ best practices
- ใช้ linter ที่เหมาะสมกับแต่ละ language

### 3. Library-Specific Patterns

ใช้ patterns ที่เหมาะสมกับแต่ละ library

- React: ใช้ hooks patterns และ component patterns
- Vue: ใช้ composition API และ best practices
- Prisma: ใช้ schema best practices และ queries
- อ่าน documentation ของแต่ละ library อย่างละเอียด
- ตรวจสอบ examples จาก official sources

### 4. Runtime Considerations

พิจารณา characteristics ของ runtime ที่ใช้

- Node.js: ใช้ async patterns และ event loop best practices
- Bun: ใช้ Bun-specific APIs และ native features
- Deno: ทำตาม Deno security แล module patterns
- Browser: พิจารณา performance และ compatibility
- Server: พิจารณา security และ scalability

### 5. Consistency Maintenance

รักษาความสม่ำเสมอทั่วทั้ง codebase

- ใช้ naming conventions ที่สม่ำเสมอ
- ใช้ code style ที่สม่ำเสมอ
- ใช้ patterns ที่สม่ำเสมอ
- ตั้งค่า linter และ formatter อัตโนมัติ
- ทำ code review เพื่อตรวจสอบ

## Expected Outcome

- ผลลัพธ์เขียนตาม best practices จาก context นั้นๆ
- คุณภาพสูงและ maintainable
- Consistency ทั่วทั้ง project
- Best practices ที่ถูกต้องและเป็นปัจจุบัน
- Patterns และ conventions ที่เหมาะสม
