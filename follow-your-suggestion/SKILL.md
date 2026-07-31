---
name: follow-your-suggestion
description: ทำตามคำแนะนำจากการวิเคราะห์ปัญหาและแก้ไข code ตามที่คุยกันก่อนหน้า
---

## Goal

ทำตามคำแนะนำจากการวิเคราะห์ปัญหาและแก้ไข code ตามที่คุยกันก่อนหน้าอย่างเป็นระบบ

## Scope

ใช้สำหรับการ apply suggestions จากการวิเคราะห์ปัญหาที่คุยกันก่อนหน้า ครอบคลุมการจัดลำดับ การแก้ไข และการตรวจสอบ

## Execute

### 1. Review And Prioritize

จัดลำดับ suggestions ตาม impact และ effort

1. ทำ `/read-related-workflows` เพื่ออ่าน workflows ที่เกี่ยวข้อง
2. ทำ `/prioritize` เพื่อจัดลำดับตาม priority: `security` > `type errors` > `performance` > `code quality`
3. ตรวจสอบ context และ relevance ของแต่ละ suggestion ก่อน apply

### 2. Apply Critical Fixes

แก้ไข issues ตามลำดับ priority

1. แก้ไข `security vulnerabilities` และ `type errors` ก่อน
2. แก้ไข `performance` และ `code quality` issues ที่เหลือ

### 3. Resolve Errors

หมายเหตุ: ทำเฉพาะเมื่อได้รับ errors จากการแก้ไขเท่านั้น

1. ทำ `/resolve-errors` เพื่อแก้ไข errors ที่เกิดขึ้น

### 4. Realize Implementation

1. ทำ `/realize-implementation` เพื่อแปลงเป็น production code ครบถ้วน

## Rules

### 1. Prioritization

- จัดลำดับ: `security` > `type errors` > `performance` > `code quality`
- ข้าม suggestions ที่ไม่เกี่ยวข้องกับปัญหาปัจจุบัน

### 2. Minimal Changes

- ทำ `/dont-over-engineer` เพื่อหลีกเลี่ยง over-engineering
- ไม่แก้ไข code ที่ไม่เกี่ยวข้องกับ suggestions
- รักษา consistency กับ code style ที่มีอยู่

### 3. No Ignore Patterns

- ไม่ใช้ ignore patterns แทนการแก้ไขจริง ทำตาม `/no-use-ignore`

## Expected Outcome

- Suggestions ถูกจัดลำดับและ apply อย่างเป็นระบบตาม priority
- Code quality ดีขึ้นโดยไม่มี side effects หรือ over-engineering
