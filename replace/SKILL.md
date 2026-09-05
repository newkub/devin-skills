---
name: replace
description: แทนที่เนื้อหาในไฟล์หรือโค้ดด้วย regex หรือ AST-based patterns
related:
  - use-ast-grep-programatic
  - search-by-astgrep
  - update-references
  - deep-validate
---

## Goal

แทนที่เนื้อหาในไฟล์หรือโค้ดให้ถูกต้องและปลอดภัย

## Scope

ใช้ `replace` สำหรับแทนที่เนื้อหาในไฟล์หรือโค้ด โดยเลือกวิธีตามลักษณะงาน:

- Plain text / regex replacement: สำหรับเนื้อหาทั่วไป เช่น docs, config
- AST-based replacement: สำหรับ code ทีต้องการ precision สูง

- ดูเพิ่มเติม: /search-by-astgrep

## Execute

### 1. Identify Content To Replace

> Goal: ระบุเนื้อหาที่ต้องการแทนที่

1. SEARCH เนื้อหา x ที่ต้องการแทนที่
2. MARK ตำแหน่งที่ต้องการแทนที่
3. PREPARE เนื้อหา y ที่จะนำมาแทนที่
4. ถ้าเป็น code replacement → ทำ `/use-ast-grep-programatic` เพื่อหา patterns ด้วย AST

### 2. Execute Replacement

> Goal: ทำการแทนที่เนื้อหา

1. ถ้าเป็น plain text หรือ regex → ใช้ `edit` หรือ `write` แทนที่
2. ถ้าเป็น code ทีซับซ้อนหรือต้องการ precision → ใช้ `/use-ast-grep-programatic` สำหรับ AST-based rewrite
3. REPLACE x ด้วย y ในไฟล์หรือโค้ดที่ระบุ
4. VERIFY ว่าการแทนที่ถูกต้อง
5. CHECK ว่าไม่มีผลข้างเคียงจากการแทนที่

### 3. Update References

> Goal: อัปเดต references หลัง replace

1. ถ้าการแทนที่เปลี่ยนชื่อ identifier, path, หรือ skill name → ทำ `/update-references`
2. รัน `/check-skills-related` หรือ `/deep-validate` เพื่อตรวจสอบ

## Rules

- ใช้ `/use-ast-grep-programatic` เมื่อ replace ใน source code เพื่อหลีกเลี่ยง false positives
- ใช้ `/use-ast-grep-programatic` เมื่อต้อง batch replace หลายไฟล์หรือ integrate กับ scripts
- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

- เนื้อหาที่ต้องการถูกแทนที่ถูกต้อง
- ไม่มี broken references
- ไม่มีผลข้างเคียงที่ไม่ต้องการ
