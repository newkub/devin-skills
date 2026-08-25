---
name: follow-request-instruction-prompt
description: สรุปการสนทนาเป็น instruction prompt ที่ชัดเจน
argument-hint: "[target]"
---

## Goal

สรุปการสนทนาเป็น instruction prompt ที่ชัดเจน กระชับ และนำไปใช้ได้จริง

## Scope

ใช้ `follow-request-instruction-prompt` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Analyze Conversation
> Goal: Analyze Conversation

1. อ่านและวิเคราะห์การสนทนาทั้งหมด
2. ระบุจุดประสงค์หลักของการสนทนา
3. หาข้อมูลสำคัญและการตัดสินใจ
4. ระบุขั้นตอนและเงื่อนไขที่สำคัญ

### 2. Extract Key Information
> Goal: Extract Key Information

1. สรุปคำสั่งและข้อกำหนดที่ชัดเจน
2. ระบุ input และ output ที่คาดหวัง
3. หา constraints และ limitations
4. ระบุ edge cases และข้อยกเว้น

### 3. Write Instruction Prompt
> Goal: Write Instruction Prompt

1. เขียน prompt ที่กระชับและชัดเจน
2. จัดลำดับขั้นตอนอย่างเป็นระบบ
3. ระบุ input/output อย่างชัดเจน
4. ใส่ constraints และ edge cases

### 4. Validate Prompt
> Goal: Validate Prompt

1. ตรวจสอบว่า prompt ครอบคลุมทุกจุดสำคัญ
2. ทดสอบ prompt กับกรณีตัวอย่าง
3. ตรวจสอความชัดเจนและความเข้าใจง่าย
4. ยืนยันว่า prompt นำไปใช้ได้จริง

## Rules

1. Instruction prompt ต้องกระชับและชัดเจน
2. ต้องระบุ input/output อย่างชัดเจน
3. ต้องจัดลำดับขั้นตอนอย่างเป็นระบบ
4. ต้องระบุ constraints และ edge cases
5. ห้ามใช้ภาษาที่คลุมเครือหรือหลายความหมาย

## Expected Outcome

- Instruction prompt ที่กระชับและชัดเจน
- Input/output ที่ระบุชัดเจน
- ขั้นตอนที่เป็นระบบ
- Constraints และ edge cases ที่ครอบคลุม
