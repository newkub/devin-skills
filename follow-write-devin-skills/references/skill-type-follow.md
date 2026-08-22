---
name: skill-type-follow
description: Template สำหรับ follow-* skills ใช้ best practices
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `follow-*` skills ที่ implement best practices ของ tools, libraries หรือ frameworks

## Scope

ใช้สำหรับ skills ที่ setup หรือ implement patterns เช่น `follow-vite`, `follow-solidjs`, `follow-biome`, `follow-drizzle`

## Execute

### 1. Detect Tool

ตรวจจับ tool/library ใน project
> Goal: รู้ว่าใช้ tool อะไร version ใด

1. อ่าน `package.json`, `Cargo.toml`, หรือไฟล์ dependencies ที่เกี่ยวข้อง
2. ตรวจสอบ version ของ tool/library
3. ถ้าไม่พบ tool → stop และ report พร้อมคำแนะนำการติดตั้ง
4. ถ้าเป็น optional → ถามผู้ใช้ว่าต้องการ setup หรือไม่

### 2. Read Best Practices

อ่าน best practices จาก official docs
> Goal: ใช้ข้อมูลที่ถูกต้องและทันสมัย

1. ทำ `/learn-from-web`, `/check-reference`, ทำ `/follow-best-practice`
2. ตรวจสอบ version compatibility กับ project
3. ถ้าข้อมูลไม่ชัด → stop และ report

### 3. Implement Patterns

Implement best practices patterns
> Goal: Code ตรง best practices และทำงานได้

1. สร้างหรืออัปเดท configuration files
2. Implement patterns ตาม official docs
3. ทำ `/follow-config` กับ existing code style
4. ถ้ามี breaking changes → ทำ migration steps
5. ถ้าต้องแก้ >10 ไฟล์ → ทำ `/use-scripts`

### 4. Validate

ตรวจสอบว่า implementation ทำงานได้
> Goal: Implementation ผ่าน validation ไม่มี errors

1. รัน typecheck, รัน lint, รัน tests ถ้ามี
2. ตรวจสอบว่า config ถูกต้อง
3. ถ้ามี errors → ทำ `/resolve-errors`
4. ถ้าผ่าน → ทำ `/suggest-next-action`

## Rules

### 1. Source Of Truth

- ใช้ official docs เป็นแหล่งหลัก
- ถ้า official docs ขัดแย้งกับ training data → ใช้ official docs
- ระบุ version ที่อ้างอิงเสมอ

### 2. Compatibility

- ตรวจสอบ version compatibility กับ existing dependencies
- ถ้ามี conflict → report พร้อมวิธีแก้
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 3. Minimal Changes

- ใช้ minimal changes เสมอ
- ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะ config
- ถ้าต้องแก้ >10 ไฟล์ → ทำ `/use-scripts`

### Package Structure

- `SKILL.md` คือ entry point หลัก
- สามารถมี `references/`, `scripts/`, `subskills/`, `guide/`, `examples/` ตามความจำเป็น
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

## Expected Outcome

- Tool/library setup ตาม best practices
- Configuration files ถูกต้องและ consistent
- Code ผ่าน typecheck และ lint
- ไม่มี breaking changes โดยไม่จำเป็น


