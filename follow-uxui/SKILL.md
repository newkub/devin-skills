---
name: follow-uxui
description: เลือกและใช้งาน UX/UI patterns ตาม dimension ทีเหมาะสม
---

## Goal

เลือกและใช้งาน UX/UI patterns ตาม dimension ทีเหมาะสมกับสถานการณ์

## Scope

ใช้เป็น entry point เมื่อต้องการ implement หรือ review UX/UI โดยไม่แน่ใจว่าตกใน category ไหน

## Execute

### 1. Detect UX/UI Dimension

> Goal: ระบุ dimension ทีเหมาะสมกับสิ่งที่ต้องทำ
> Goal: ได้ approach ทีถูกต้อง

1. ถ้าเป็น micro-interaction, hover, focus, loading, toggle, feedback → ใช้ interaction patterns
2. ถ้าเป็น animation visual/timeline → ใช้ animation best practices
3. ถ้าเป็น accessibility → ใช้ a11y checklists
4. ถ้าเป็น chart/data viz → ใช้ data visualization guidelines
5. ถ้าเป็น 3D scene/viewer → ใช้ 3D UX principles
6. ถ้าไม่ชัด → focus ที micro-interaction ก่อน เป็น default

### 2. Apply Pattern

> Goal: นำ dimension ทีเลือกไปใช้งานจริง
> Goal: เกิดผลลัพธ์ทีใช้งานได้

1. ระบุ components/elements ทีได้รับผลกระทบ
2. เลือก pattern ทีตอบโจทย์ user need
3. ตรวจสอบว่าไม่ทำลาย accessibility และ usability
4. ทำ quick prototype หรือ mock เพื่อ validate
5. ถ้ามีปัญหา ให้ `ask-me`

## Rules

### 1. Choose The Right Dimension

- อย่าใช้ animation/3D เมื่อ simple interaction เพียงพอ
- ตรวจสอบ accessibility ก่อนเพิ่ม visual effect
- อย่าซ้ำซ้อนกับ patterns ทีมีอยู่

### 2. Default Path

- ถ้าไม่ชัดว่าที category ไหน ให้ focus ที interaction patterns ก่อน เพราะครอบคลุม common cases

## Expected Outcome

- ได้ UX/UI approach ทีเหมาะสมกับ dimension ทีเลือก
- ไม่มี duplicated instructions ระหว่าง skills
- `SKILL.md` ไม่เกิน 250 บรรทัด
