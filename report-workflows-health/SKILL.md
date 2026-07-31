---
name: report-workflows-health
description: วิเคราะห์สุขภาพ workflows ทั้ง global และ project พร้อม health score และ action items
---

## Goal

วิเคราะห์สุขภาพ workflows ทั้ง global และ project ระบุ issues, คำนวณ health score และจัด action items

## Scope

ใช้สำหรับ workflows ใน `global_workflows/`, `.devin/workflows/`, และ `.windsurf/workflows/`

## Execute

### 1. Inventory Workflows

รวบรวมรายการ workflows ทั้งหมด

> Goal: รู้จำนวน ประเภท และตำแหน่งของ workflows ทั้งหมด

1. ทำ `/list-workflows` เพื่อแสดงรายการ workflows ทั้งหมด
2. จำแนก global workflows, project workflows, และ workspace workflows
3. บันทึก paths และ filenames

### 2. Check Structure

ตรวจสอบโครงสร้างของแต่ละ workflow

> Goal: ทุก workflow มี frontmatter และ sections ครบถ้วน

1. ตรวจสอบ frontmatter ครบ: `title`, `description`, `auto_execution_mode`, `related`
2. ตรวจสอบ sections ครบ: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ตรวจสอบ Execute headings เป็น English Title Case
4. ตรวจสอบ Rules เป็นภาษาไทย
5. ระบุไฟล์ที่เกิน 250 บรรทัด

### 3. Check References

ตรวจสอบ references ภายในและระหว่าง workflows

> Goal: ไม่มี broken references หรือ references ที่ไม่ valid

1. ทำ `/check-reference` เพื่อตรวจสอบ broken references
2. ระบุ `related` ที่ชี้ไปยังไฟล์ไม่มี
3. ระบุ references ในเนื้อหาที่ไม่ valid

### 4. Analyze Content Quality

วิเคราะห์คุณภาพเนื้อหา

> Goal: เนื้อหาชัดเจน ไม่ซ้ำซ้อน และทำตามได้จริง

1. ทำ `/follow-content-quality` เพื่อ review คุณภาพ
2. ระบุ duplicate content ระหว่าง workflows
3. ระบุ vague หรือ ambiguous instructions
4. ระบุ inconsistencies ใน format และ language

### 5. Calculate Health Score

คำนวณ health score จาก metrics

> Goal: มี health score รวม พร้อม grade และ prioritization

1. กำหนด metrics: structure, references, content quality, consistency
2. คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
3. คำนวณ health score รวม (0-100%)
4. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 6. Generate Action Items

สร้าง action items จาก issues

> Goal: ผู้ใช้รู้ว่าต้องทำอะไรต่อ และแยก quick wins ออกจาก major improvements

1. จัดลำดับ issues ตาม severity: Critical, High, Medium, Low
2. แยก quick wins ออกจาก major improvements
3. ระบุ workflow ที่แนะนำสำหรับแต่ละ action item
4. ทำ `/report-format-table` เพื่อจัดรูปแบบตาราง

### 7. Report Findings

รายงานผลลัพธ์

> Goal: รายงานสุขภาพ workflows ในแชทพร้อม next action

1. ทำ `/report` เพื่อรายงานผลในแชท
2. แสดง health score, grade, และ progress bar
3. แสดงตาราง issues ตาม severity

## Rules

### 1. Health Score

- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- คำนวณเป็น percentage ของทุก metrics
- แสดง progress bar พร้อม grade
- เรียงลำดับ issues ที่ได้คะแนนต่ำก่อน

### 2. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number)
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

### 3. Severity Classification

- Critical: workflow ขาด frontmatter หรือ sections หลัก ทำให้ใช้งานไม่ได้
- High: broken references หรือ structure ไม่ตรงมาตรฐาน
- Medium: content quality ต่ำ ซ้ำซ้อน หรือไม่ชัดเจน
- Low: ไฟล์เกิน 250 บรรทัด หรือ heading ไม่เป็น Title Case

## Expected Outcome

- รายงานสุขภาพ workflows พร้อม health score และ grade
- ตาราง issues จัดลำดับตาม severity
- Action items แยก quick wins จาก major improvements
- ไม่มี broken references
- Workflows มี structure สม่ำเสมอ
