---
name: create-windsurf-global-workflows
description: สร้าง global workflow ใหม่ตามมาตรฐาน
---

## Goal

สร้าง global workflow ใหม่ที่มีโครงสร้างสม่ำเสมอ อ่านง่าย และไม่ซ้ำซ้อนกับ workflows ที่มีอยู่

## Scope

ใช้สำหรับสร้าง global workflow ใหม่ใน `global_workflows` directory

## Execute

### 1. Analyze Need

วิเคราะห์ความจำเป็นของ workflow ใหม่

1. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
2. ตรวจสอบว่ามี workflow ที่ครอบคลุม topic เดียวกันอยู่แล้วหรือไม่
3. ถ้ามี workflow ที่คล้ายกัน ให้พิจารณา extend หรือ reference แทนการสร้างใหม่
4. ระบุวัตถุประสงค์และขอบเขตของ workflow ใหม่อย่างชัดเจน

### 2. Plan Workflow

วางแผนโครงสร้าง workflow ใหม่

1. กำหนด `title` เป็น Title Case ตรงกับ filename ที่จะใช้
2. กำหนด `description` กระชับไม่เกิน 100 ตัวอักษร
3. ระบุ `related_workflows` ที่จะอ้างถึง
4. วางโครงสร้าง Execute steps โดยเรียงลำดับ: Foundation ก่อน, High impact ก่อน, Dependencies ก่อน
5. ระบุ Rules ที่ไม่ซ้ำซ้อนกับ Execute

### 3. Check References

1. ทำ `/check-reference` เพื่อตรวจสอบ workflows ที่จะอ้างถึงมีอยู่จริง
2. ตรวจสอบว่าไม่อ้างถึง workflow ที่ไม่มีอยู่จริง

### 4. Create File

สร้างไฟล์ workflow ใหม่

1. สร้างไฟล์ใน `global_workflows/` directory ด้วยชื่อที่ตรงกับ `title` (kebab-case)
2. เขียน frontmatter ตามมาตรฐาน: `title`, `description`, `auto_execution_mode: 3`, `related_workflows`
3. เขียน `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. ใช้ heading ภาษาอังกฤษ Title Case ใน Execute
5. ใช้ bullet points ชิดซ้ายใน Rules
6. ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`
7. ตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด

### 5. Validate Quality

1. ทำ `/follow-write-devin-skills` เพื่อตรวจสอบคุณภาพ workflow ที่สร้าง
2. ตรวจสอบว่าไม่ซ้ำซ้อนระหว่าง Execute และ Rules
3. ตรวจสอบว่า Goal สอดคล้องกับ Filename และ Expected Outcome สอดคล้องกับ Goal
4. ตรวจสอบว่า references มีอยู่จริงทั้งหมด

### 6. Update Cross-References

1. ทำ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ว่า workflow ใหม่ควรถูกอ้างอิงในไฟล์ใดบ้าง
2. ทำ `/update-reference` เพื่อเพิ่ม references ในไฟล์ที่เกี่ยวข้อง เช่น `AGENTS.md`, `global_rules.md`
3. ตรวจสอบว่าไม่เพิ่ม reference ในไฟล์ที่ไม่เกี่ยวข้อง

## Rules

- ตรวจสอบ workflows ที่มีอยู่ก่อนสร้างใหม่เสมอ ถ้ามีครอบคลุมแล้วให้ extend แทน
- `title` ต้องเป็น Title Case และตรงกับ filename (kebab-case)
- `description` กระชับไม่เกิน 100 ตัวอักษร
- ทุก section ที่ required ต้องครบ: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- ถ้าอ้างถึง workflows หรือ skills อย่าเขียนซ้ำกับไฟล์ที่อ้างไป
- เขียนเป็นหลักการ how-to ไม่ใช่ step-by-step เฉพาะกรณี
- ใช้ `/update-reference` หลังสร้างไฟล์เพื่ออัปเดต cross-references

## Expected Outcome

- Global workflow ใหม่ที่มีโครงสร้างสม่ำเสมอตามมาตรฐาน
- ไม่ซ้ำซ้อนกับ workflows ที่มีอยู่
- References ทั้งหมดมีอยู่จริง
- Cross-references อัปเดตในไฟล์ที่เกี่ยวข้อง
- ไฟล์ไม่เกิน 250 บรรทัด
