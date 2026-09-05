---
name: use-another-skills
description: เลือกและเรียก skill อื่นที่เหมาะสมกับ task
argument-hint: "[task]"
related:
  - use-in-another-skills
  - suggest-next-action
  - follow-skills-map
  - check-reference
  - report-table
---

## Goal

เลือกและใช้ skill อื่นที่เหมาะสมกับ task หรือ skill ปัจจุบัน เพื่อดำเนินการต่อ

## Scope

ใช้เมื่องานหรือ skill ปัจจุบันต้องการ skill อื่นมาช่วยต่อ โดยมีรายการ candidate skills หรือ context ที่ชัดเจน

## Execute

### 1. Analyze Context

> Goal: เข้าใจสถานการณ์ปัจจุบัน

1. อ่าน context, goal, และ current skill ถ้ามี
2. ระบุว่าต้องการ skill ประเภทใด: แก้ไข, ตรวจสอบ, สร้าง, research, deploy
3. ถ้าไม่ชัด → ทำ `/ask-me` ก่อน

### 2. Get Candidates

> Goal: หา skills ทีเหมาะสม

1. ทำ `/use-in-another-skills` ถ้ามี skill ปัจจุบัน
2. ทำ `/suggest-next-action` ถ้ามี task ทั่วไป
3. ทำ `/follow-skills-map` เพื่อดูกลุ่ม skills
4. กรอง candidates ให้เหลือ 1-3 ตัว

### 3. Select And Invoke

> Goal: เลือกและเรียก skill

1. เปรียบเทียบ candidate จาก Goal, Scope, และข้อจำกัด
2. เลือก skill ทีเหมาะสมทีสุด
3. เรียก `/selected-skill` พร้อม context ที่ครบ
4. ถ้าต้องการหลาย skills → ทำซ้ำตามลำดับ

### 4. Validate

> Goal: ยื่นยันว่าผลลัพธ์ใช้ได้

1. ตรวจ output จาก skill ทีเรียก
2. ถ้าไม่ตรง goal → ทำซ้ำขั้นตอน 2-3
3. ทำ `/check-reference` ถ้าอ้างอิง skills อื่น

## Rules

### 1. Evidence Based

- เลือก skill จาก Goal/Scope ไม่ใช่แค่ name
- ระบุเหตุผลสั้นๆ ก่อนเรียก
- ไม่เรียก skill ที่ไม่เกี่ยวข้อง

### 2. Context Preservation

- ส่ง context สำคัญให้ skill ทีเลือก
- ระบุ expected output และ success criteria
- เก็บ log ของ skill ทีเรียก

### 3. Single Next Skill

- ถ้าไม่จำเป็นต้องใช้หลาย skills → เลือกทีละตัว
- ถ้าซับซ้อนมาก → ใช้ `/consider-use-subagents` แทน

### 4. Validation

- ตรวจสอบว่า skill ทีเลือกมีอยู่จริง
- ตรวจสอบว่าไม่เรียก skill ตัวเอง
- ทำ `/report-table` สำหรับสรุป

## Expected Outcome

- skill ทีเหมาะสมถูกเลือกและเรียก
- context ถูกส่งต่อไปยัง skill ทีเลือก
- มีรายงานสรุป skill ทีใช้และผลลัพธ์
- ใช้ร่วมกับ `/use-in-another-skills` ใน `/update-devin-global-skills`
