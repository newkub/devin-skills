---
name: follow-design-pattern
description: ให้ผู้ใช้เข้าใจและสามารถใช้ design patterns ได้อย่างมีประสิทธิภาพ
related:
  - follow-math-set-theory
  - follow-math-category-theory
---

## Goal

ให้ผู้ใช้เข้าใจและสามารถใช้ design patterns ได้อย่างมีประสิทธิภาพ

## Scope

ใช้สำหรับเลือก pattern ที่เหมาะสมกับปัญหา, เข้าใจและใช้งาน GoF patterns, ออกแบบซอฟต์แวร์ที่ maintainable และ extensible, หลีกเลี่ยง anti-patterns, ปรับปรุง code quality ผ่าน patterns, และเรียนรู้ best practices ในการออกแบบ

## Execute

### 1. Study Pattern Resources

> Goal: เข้าใจ design patterns และ best practices จาก references

1. อ่าน [references/design-pattern-resources.md](references/design-pattern-resources.md) เพื่อเข้าใจ GoF patterns และหมวดหมู่ต่างๆ
2. ศึกษา pattern categories: Creational, Structural, Behavioral
3. อ้างอิง sources ที่เชื่อถือได้จาก references

### 2. Apply Design Patterns

> Goal: เลือกและ implement pattern ที่เหมาะสมกับปัญหา

1. ปฏิบัติตาม [workflows/apply-design-patterns.md](workflows/apply-design-patterns.md) สำหรับการ apply patterns
2. วิเคราะห์ code structure เพื่อระบุ recurring issues
3. เลือก pattern ตามหมวดหมู่ที่เหมาะสม
4. Implement pattern โดย adapt ตามความต้องการเฉพาะ
5. ทดสอบ implementation และ review เพื่อความ maintainability

### 3. Avoid Anti-Patterns

> Goal: หลีกเลี่ยง anti-patterns และปรับปรุง code quality

1. ตรวจสอบ code ที่มี anti-patterns โดยเปรียบเทียบกับ best practices
2. ปรับปรุง code quality ผ่านการ apply patterns ที่ถูกต้อง
3. ให้ code examples ที่ชัดเจนและใช้งานได้จริงเป็นภาษาไทย

## Rules

### 1. Pattern Selection

- เลือก pattern ตามปัญหาที่แก้ไข ไม่ใช่ตามความนิยม
- พิจารณา trade-offs ของแต่ละ pattern ก่อน apply
- หลีกเลี่ยงการใช้ pattern มากเกินไปในที่ไม่จำเป็น

### 2. Implementation

- ใช้ภาษาไทยในการอธิบาย และให้ code examples ที่ใช้งานได้จริง
- อ้างอิง [references/design-pattern-resources.md](references/design-pattern-resources.md) สำหรับ pattern details
- ปฏิบัติตาม [workflows/apply-design-patterns.md](workflows/apply-design-patterns.md) สำหรับการ apply
- อัปเดต content ให้ทันสมัยตาม version ล่าสุด

### 3. Quality

- ตรวจสอบว่า pattern ช่วยให้ code maintainable และ extensible
- หลีกเลี่ยง anti-patterns ที่ทำให้ code ซับซ้อนโดยไม่จำเป็น
- ทำตาม project conventions และ global rules

- ใช้ /follow-math-set-theory ถ้าจำเป็น
- ใช้ /follow-math-category-theory ถ้าจำเป็น

## Expected Outcome

- เลือก pattern ที่เหมาะสมกับปัญหาได้อย่างถูกต้อง
- Code ที่ maintainable และ extensible ผ่านการ apply patterns
- หลีกเลี่ยง anti-patterns และปรับปรุง code quality
