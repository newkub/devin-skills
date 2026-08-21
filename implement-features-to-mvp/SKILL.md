---
name: implement-features-to-mvp
description: Implement features ที่จำเป็นสำหรับ MVP เท่านั้น หยุดเมื่อครบถ้วน
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

Implement features ที่จำเป็นสำหรับ MVP เท่านั้น หยุดเมื่อ MVP requirements ครบถ้วน

## Scope

ครอบคลุมการระบุ features ที่จำเป็นสำหรับ MVP, การจัดลำดับความสำคัญ, และการ implement features จนครบถ้วน

## Execute

### 1. Define MVP Requirements

1. ทำ `/analyze-project` เพื่อดู features ทั้งหมด
2. ทำ `/plan` เพื่อวางแผน MVP scope
3. ระบุ MVP requirements จาก business goals
4. สร้าง MVP checklist ที่ชัดเจน
5. ตรวจสอบว่า requirements สอดคล้องกับ timeframe

### 2. Prioritize MVP Features

1. จัดลำดับ features ตามความจำเป็นสำหรับ MVP:
   - Must-have: features ที่ต้องมีเพื่อ MVP ใช้งานได้
   - Should-have: features ที่สำคัญแต่ไม่ critical
   - Nice-to-have: features ที่ optional ไม่ทำใน MVP
2. ประเมิน effort ต่อ impact สำหรับแต่ละ feature
3. เลือก features ที่ให้คุณค่าสูงสุดต่อ effort

### 3. Implement MVP Features

1. ทำ `/realize-implementation` สำหรับ must-have features
2. ทำ `/dont-over-engineer` สำหรับทุกการ implement
3. เน้น functionality ที่จำเป็นเท่านั้น
4. ไม่ทำ optional features หรือ enhancements

### 4. Validate MVP Completeness

1. ตรวจสอบว่า must-have features ครบถ้วน
2. ทดสอบ critical user flows ทั้งหมด
3. ยืนยันว่า MVP ใช้งานได้จริง
4. หยุดทำเมื่อ MVP requirements ครบถ้วน

### 5. Report Results

1. ทำ `/report` สรุปผลลัพธ์การ implement MVP features
2. แสดงสถานะของแต่ละ feature (done, skipped, blocked)
3. ระบุ features ที่เหลือสำหรับ phase ถัดไป

## Rules

### 1. MVP Definition

- ระบุ core value proposition ของ product
- กำหนด minimum features ที่ต้องมี
- ตั้งเป้าหมาย timeframe ที่ชัดเจน
- ไม่เพิ่ม features นอก scope ของ MVP

### 2. Prioritization Framework

- ใช้ MoSCoW method: Must, Should, Could, Won't
- พิจารณา business value และ user impact
- พิจารณา technical complexity และ dependencies
- เลือก features ที่ validate assumptions หลัก

### 3. Implementation Discipline

- ทำเฉพาะ must-have features ใน MVP
- ใช้ `/dont-over-engineer` สำหรับทุกการแก้ไข
- ไม่ทำ optional features หรือ enhancements
- หยุดเมื่อ MVP requirements ครบถ้วน

### 4. Validation Criteria

- Must-have features ทำงานได้จริง
- Critical user flows ผ่านทั้งหมด
- MVP ใช้งานได้โดยไม่มี blocking issues
- ไม่มี features ที่เกิน scope ของ MVP

### 5. Common Mistakes

- ไม่กำหนด MVP requirements อย่างชัดเจน
- ทำ optional features ใน MVP
- Over-engineer solutions สำหรับ MVP
- ไม่หยุดเมื่อ MVP ครบถ้วน
- เพิ่ม features ตาม request โดยไม่ประเมิน impact

## Expected Outcome

- MVP features ครบถ้วนและใช้งานได้
- ไม่มี optional features ที่ไม่จำเป็น
- Implementation ใช้ minimal changes
- MVP พร้อมทดสอบกับผู้ใช้จริง
- รายงานสรุปผลลัพธ์การ implement ครบถ้วน
