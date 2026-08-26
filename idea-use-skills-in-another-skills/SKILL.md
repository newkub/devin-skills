---
name: idea-use-skills-in-another-skills
description: สร้างไอเดียการนำ skill หน่วงไปใช้ใน skills อื่นพร้อมตาราง
---

## Goal

วิเคราะห์ skill หนึ่งง และสร้างไอเดียการนำ skill นั้นไปใช้ใน skills อื่น เพื่อลด duplication, เพิ่ม cohesion, และขยายการใช้งาน

## Scope

ใช้เมื่องเคราะห์ว่า skill ใดควรถูกเรียกใช้โดย skills อื่นบ้าง โดยดูจาก Goal, Scope, Execute และ Rules

## Execute

### 1. Analyze Source Skill

> Goal: เข้าใจ skill ทีต้องการเสนอให้ skills อื่นใช้

1. อ่าน `SKILL.md` ของ source skill
2. ระบุ `name`, `description`, `Goal`, `Scope`, `Execute`, `Rules`
3. ระบุ category หรือ concern: `create`, `analyze`, `report`, `convert`, `git`, etc.
4. ระบุ `argument-hint` และ output format

### 2. List Candidate Skills

> Goal: หา skills อื่นทีอาจใช้ source skill

1. รัน `/scan-codebase` หรือ `/list-devin-global-skills`
2. อ่าน `description` และ `Goal` ของแต่ละ skill
3. กรอง skills ทีมีลักษณะเดียวกันหรือทับซ้อนกับ source skill
4. ระบุ skills ที `Execute` หรือ `Rules` อาจได้รับประโยชน์จาก source skill

### 3. Match Use Cases

> Goal: จับคู่ use cases ระหว่าง source skill กับ candidate skills

1. วิเคราะห์ว่า source skill ช่วยตอบสนอง step ใดของ candidate skill
2. ระบุประเภทการใช้: `direct call`, `optional enhancement`, `replace duplication`, `pre-step`, `post-step`
3. ให้คะแนนความเหมาะสม: High/Medium/Low
4. รวม use cases ทีคล้ายกัน

### 4. Generate Ideas

> Goal: สร้างไอเดียการใช้ skill

1. สรุปแต่ละ idea ด้วย:
   - `target-skill` (skill ทีควรใช้ source skill)
   - `use-case` (step หรือจุดทีควรใช้)
   - `usage` (เรียก `/source-skill` หรือ delegate)
   - `impact` (ลด duplication, ขยายความสามารถ, ทำให้ SRP)
   - `priority` (High/Medium/Low)
   - `effort` (S/M/L)
2. ใช้ continuous numbering สำหรับแต่ละ idea
3. ถ้าจำเป็นให้เสนอ skill ใหม่ที wrap source skill

### 5. Report With Table

> Goal: นำเสนอไอเดียในรูปแบบตาราง

1. ใช้ `/report-markdown-table` คอลัมน์:
   - No
   - Source Skill
   - Target Skill
   - Use Case
   - Usage
   - Impact
   - Priority
   - Effort
2. เรียงตาม Priority (High → Low) แล้ว Impact
3. ระบุ Top 3 ideas ทีควรทำก่อน
4. ทำ `/suggest-next-action`

## Rules

### 1. Evidence Based

- ทุก idea ต้องมาจากการอ่าน `SKILL.md` จริง
- ระบุ target step หรือ section ทีเกี่ยวข้อง
- ไม่เสนอให้ skill เรียกตัวเอง (circular)

### 2. No Over-Engineering

- ไม่เสนอให้ skill ย่อยถูกเรียกในทุก skill
- เลือกเฉพาะทีสื่อความหมาย
- ถ้า impact ต่ำ → ระบุ Low และไม่บังคับ

### 3. Match Quality

- target skill ต้องมี Goal หรือ step ทีตรงกับ source skill
- ระบุว่าจะเรียก `/source-skill` หรือ embed logic
- ถ้าต้องแก้ target skill → ระบุ sections ทีต้องอัปเดต

### 4. Validation

- ตรวจสอบว่า source skill และ target skill มีอยู่จริง
- ตรวจสอบว่าไม่ซ้ำกับ `related` ทีมีอยู่
- ใช้ `/check-reference` หากอ้างอิงหลาย skills

## Expected Outcome

- ตารางไอเดียการนำ source skill ไปใช้ใน skills อื่น
- ระบุ target skills, use cases, impact, priority, effort
- Top 3 ideas ทีควรทำก่อน
- ไอเดียพร้อม apply หรือสร้าง PR
