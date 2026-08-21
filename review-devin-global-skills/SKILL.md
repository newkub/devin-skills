---
name: review-devin-global-skills
description: วิเคราะห์คุณภาพ Devin skills ทั้ง global และ project พร้อม review score, metrics, และ action items
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-skills
  - check-reference
  - follow-content-quality
  - report-format-table
  - report-format-terminal
  - report
  - suggest-next-action
  - follow-devin-skills-md
  - validate
  - validate-workflow
  - ask-me
---

## Goal

วิเคราะห์คุณภาพ skills ทั้ง global และ project ระบุ issues, คำนวณ review score และจัด action items ครอบคลุม

## Scope

ใช้กับไฟล์ `.md` ใน `skills/`, `SKILL.md`, `guide/`, `key-concepts/`, `principles/`, `references/`, `workflows/`, `templates/` รวม frontmatter, structure, references, content, และ dependencies

## Execute

### 1. Inventory Skills

รวบรวมรายการ skills ทั้งหมด

> Goal: รู้จำนวน ประเภท ตำแหน่ง และ category

1. ทำ `/list-skills` เพื่อแสดงรายการ skills ทั้งหมด
2. จำแนก global skills, project skills, workspace skills
3. บันทึก paths, filenames, directories
4. นับจำนวน skills แยกตาม prefix เช่น `follow-`, `report-`, `check-`, `review-`

### 2. Check Frontmatter

ตรวจสอบ frontmatter ของแต่ละ skill

> Goal: frontmatter ถูกต้องและสมบูรณ์

1. ตรวจ `name` ตรงกับ directory name
2. ตรวจ `description` ไม่เกิน 100 ตัวอักษร
3. ตรวจ `allowed-tools` ระบุเฉพาะ tools ที่ใช้จริง
4. ตรวจ `triggers` ระบุ `user` หรือ `model`
5. ตรวจ `related` มีเฉพาะ skills ที่มีอยู่จริง
6. ตรวจ `permissions` ถ้ามี เพื่อป้องกัน path เสี่ยง

### 3. Check Structure

ตรวจสอบโครงสร้างและเงื่อนไขไฟล์

> Goal: ทุก skill มี sections ครบและอยู่ในเกณฑ์

1. ตรวจ `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
2. ตรวจ `SKILL.md` ไม่เกิน 250 บรรทัด
3. ตรวจ file names เป็น kebab-case
4. ตรวจ directory contents ไม่เกิน 250 บรรทัดต่อไฟล์
5. ระบุ missing `README.md` หรือไฟล์ย่อยที่จำเป็น

### 4. Check References

ตรวจสอบ references ภายในและระหว่าง skills

> Goal: ไม่มี broken references

1. ทำ `/check-reference` เพื่อตรวจสอบ broken references
2. ระบุ `related` ที่ชี้ไป skills ที่ไม่มี
3. ระบุ `/skill-name` ใน prompt body ที่ไม่มี
4. ตรวจ external URLs ว่า outdated หรือไม่
5. นับ references ต่อ skill และหา orphan skills

### 5. Analyze Content Quality

วิเคราะห์คุณภาพเนื้อหา

> Goal: เนื้อหาชัดเจน ไม่ซ้ำซ้อน และทำตามได้จริง

1. ทำ `/follow-content-quality` เพื่อ review คุณภาพ
2. ระบุ duplicate content ระหว่าง skills
3. ระบุ vague/ambiguous instructions
4. ระบุ TODO/MOCK/placeholder ที่ไม่จำเป็น
5. ตรวจ consistency ของภาษาและ format
6. ตรวจ heading case: Execute ภาษาอังกฤษ Title Case, Rules ภาษาไทย

### 6. Check Skills Distribution And Redundancy

ตรวจ distribution และ redundancy

> Goal: ลด duplication และ close gaps

1. หา skills ที่ชื่อหรือ description คล้ายกัน
2. หา category ที่มี skills น้อยเกินไป
3. หา skills ที่มี `related` แต่ไม่ถูกกล่าวถึงกลับ
4. หา skills ที่ไม่มี `related` เลย

### 7. Calculate Health Score

คำนวณ review score จาก metrics

> Goal: มี review score รวม พร้อม grade และ prioritization

1. กำหนด metrics: frontmatter, structure, references, content quality, consistency, file naming, related coverage
2. คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
3. คำนวณ review score รวม (0-100%)
4. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
5. คำนวณ category score แยก prefix

### 8. Generate Report

สร้าง report พร้อม action items

> Goal: report อ่านง่าย นำไปสู่ action

1. ทำ `/report-format-table` เพื่อจัดตาราง issues
2. ทำ `/report-format-terminal` เพื่อแสดง progress/score
3. สรุป key findings ด้านบน
4. จัดลำดับ issues ตาม severity: Critical, High, Medium, Low
5. แยก quick wins ออกจาก major improvements
6. ทำ `/suggest-next-action` ท้าย report

## Rules

### 1. Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 2. Health Score

- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- คำนวณเป็น percentage ของทุก metrics
- แสดง progress bar พร้อม grade
- เรียงลำดับ issues ที่ได้คะแนนต่ำก่อน

### 3. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number)
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

### 4. Severity Classification

- Critical: `SKILL.md` ขาด frontmatter หรือ sections หลัก ทำให้ skill ใช้งานไม่ได้
- High: broken references หรือ structure ไม่ตรงมาตรฐาน
- Medium: content quality ต่ำ ซ้ำซ้อน หรือไม่ชัดเจน
- Low: ไฟล์เกิน 250 บรรทัด หรือ file name ไม่เป็น kebab-case

## Expected Outcome

- รายงานคุณภาพ skills พร้อม review score และ grade
- ตาราง issues จัดลำดับตาม severity
- ตาราง skills แยก category พร้อม metrics
- Action items แยก quick wins จาก major improvements
- ไม่มี broken references
- Skills มี structure สม่ำเสมอ
