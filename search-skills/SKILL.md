---
name: search-skills
description: ค้นหา skills ด้วย command `skills find <keyword>` อย่างมีประสิทธิภาพ
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

## Goal

ค้นหา skills ที่เกี่ยวข้องกับ keyword ด้วย `skills find` command เพื่อหา skills ที่เหมาะสมสำหรับงาน

## Scope

Use `search-skills` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Define Search Keyword

ระบุ keyword สำหรับการค้นหา skills

1. ระบุ keyword ที่ต้องการค้นหา (เช่น framework, library, task, domain)
2. พิจารณาคำที่เกี่ยวข้องและ synonyms ถ้าจำเป็น
3. กำหนด scope ของการค้นหา (specific หรือ general)

### 2. Execute Skills Find

ค้นหา skills ด้วย `skills find` command

1. ใช้ `skills find <keyword>` เพื่อค้นหา skills ที่ตรงกับ keyword
2. วิเคราะห์ผลลัพธ์ที่ได้จาก command
3. บันทึก skills ที่พบพร้อมรายละเอียด

### 3. Analyze Results

วิเคราะห์และจัดกลุ่ม skills ที่พบ

1. จัดกลุ่ม skills ตามความเกี่ยวข้องกับ keyword
2. ระบุความสำคัญของแต่ละ skill (high/medium/low)
3. เปรียบเทียบ skills ที่คล้ายกัน
4. ตรวจสอบว่า skills มีความเกี่ยวข้องกับงานปัจจุบันหรือไม่

### 4. Summarize Findings

สรุปผลลัพธ์ในรูปแบบตาราง

1. สร้างตารางสรุป skills ที่พบ
2. แยกประเภทเป็น Direct matches, Related skills, Recommended
3. แนะนำ skills ที่ควรใช้งาน

## Rules

## Rules

### 1. Search Strategy

กลยุทธ์การค้นหา

- ใช้ keyword ที่เจาะจงและมีความหมายชัดเจน
- ลองใช้ synonyms หรือคำที่เกี่ยวข้องถ้าไม่พบผลลัพธ์
- ค้นหาทั้ง exact match และ partial match
- ให้ความสำคัญกับ skills ที่มี official support

### 2. Result Evaluation

การประเมินผลลัพธ์

- ตรวจสอบว่า skills ที่พบตรงกับความต้องการ
- ดู description และ supporting files เพื่อประเมินความเหมาะสม
- เลือก skills ที่มีประโยชน์สูงสุดสำหรับงาน
- หลีกเลี่ยง skills ที่ซ้ำซ้อนหรือไม่เกี่ยวข้อง

### 3. Result Format

รูปแบบการนำเสนอผลลัพธ์

| Column | Description |
|--------|-------------|
| No. | ลำดับที่ |
| Skill Name | ชื่อ skill |
| Match Type | Direct/Related/Recommended |
| Priority | ระดับความสำคัญ |
| Description | รายละเอียดสั้นๆ |

## Expected Outcome

## Expected Outcome

- ตารางสรุป skills ที่พบทั้งหมดพร้อมหมายเลขลำดับ
- รายการ skills ที่แนะนำให้ใช้งาน
- คำแนะนำเกี่ยวกับการเลือก skills ที่เหมาะสม
