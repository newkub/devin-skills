---
name: review-all-skills
description: ปรับปรุง skills ทั้ง global และ project ให้สมบูรณ์และสอดคล้องกัน
related:
  - validate
  - follow-write-devin-skills
  - update-agents-md
  - update-readme
  - check-reference
  - review-quality
  - update-reference
  - report
---

## Goal

ปรับปรุง skills ทั้งหมดให้สมบูรณ์ สอดคล้องกัน และตรงตามมาตรฐาน ครอบคลุมทุก `.md` ไฟล์ในแต่ละ skill

## Scope

ปรับปรุงทุก `.md` ไฟล์ใน skill directories ทั้งใน `skills/` และ workspace รวมถึง `AGENTS.md` โดยใช้ `/validate` และ `/follow-write-devin-skills` เป็นหลักและทำ cross-skill checks

## Execute

### 1. Discover And Inventory

> Goal: วิเคราะห์สถานะปัจจุบันของทุก `.md` ไฟล์ใน skills

1. ทำตาม `/scan-codebase` หา skill directories และ `AGENTS.md` ทั้งหมด
   - ทำตาม `/check-reference` ตรวจ broken references
2. ตรวจสอบไฟล์เกิน 250 บรรทัด, description เกิน 100 ตัวอักษร, หรือ heading ผิด
3. จัดลำดับตาม impact (skills ที่ใช้บ่อย, มี broken references, หรือไฟล์ยาวก่อน)
4. ถ้าไม่มี skills directory ให้ stop และ report

### 2. Plan Batch Update

> Goal: วางแผนการปรับปรุงทีละ batch

1. จัดกลุ่ม skills ตาม category (improve, follow, use, run, test) และ priority
2. ถ้ามีไฟล์มากกว่า 10 ให้ใช้ `/use-scripts` สำหรับ batch operations
3. ทำ `/dont-over-engineer` เพื่อให้แผนไม่ over-plan

### 3. Improve Each Skill

> Goal: ปรับปรุงทีละ skill โดยใช้ `/validate` และ `/follow-write-devin-skills`

1. สำหรับแต่ละ skill เรียก `/validate` พร้อมระบุ target directory แล้วทำ `/follow-write-devin-skills`
2. ติดตาม progress ต่อ skill
3. ถ้าพบ error ให้ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)

### 4. Cross-Skill Consistency

> Goal: ตรวจสอบความสอดคล้องและลด redundancy ข้าม skill

1. ทำ `/review-quality` เพื่อตรวจภาษา, format, terminology, frontmatter ข้าม skill
2. ทำ `/review-quality` เพื่อลบเนื้อหาซ้ำซ้อนข้าม skill
3. ทำ `/update-reference` หลังการรวม/แยก/ย้าย skill หรือ sections

### 5. Validate And Report

> Goal: ตรวจสอบผลลัพธ์และสรุป

1. ทำตาม `/check-reference`
   - ทำตาม `/validate`
   - ทำตาม `/follow-write-devin-skills` กับทุก `SKILL.md`
   - ทำตาม `/update-agents-md` สำหรับ `AGENTS.md`
   - ทำตาม `/update-readme` สำหรับ `README.md`
2. ทำ `/report` เพื่อสรุปผล

## Rules

### 1. Delegate To Sub-Skills

- ใช้ `/validate` และ `/follow-write-devin-skills` สำหรับปรับปรุงแต่ละ skill
- ใช้ `/review-quality` สำหรับข้าม skill consistency
- ใช้ `/review-quality` สำหรับลด redundancy ข้าม skill
- ไม่ duplicate เนื้อหาที่มีอยู่แล้วใน `/validate` และ `/follow-write-devin-skills`

### 2. Batch Execution

- ประมวลผลตามลำดับ priority เพื่อ fail fast
- ใช้ `/use-scripts` ถ้าต้องทำงานกับไฟล์จำนวนมาก
- ตรวจสอบ progress ต่อ skill ก่อนไป step ถัดไป

### 3. Reference Integrity

- ทำ `/check-reference` ก่อนและหลังการปรับปรุง
- ทำ `/update-reference` หลังการ rename, merge, หรือ split skill
- ไม่ทิ้ง broken references ไว้

### 4. Size And Structure

- ทุก `SKILL.md` ไม่เกิน 250 บรรทัด
- ทุก `SKILL.md` มี sections ครบ (Goal, Scope, Execute, Rules, Expected Outcome)
- Execute steps ไม่เกิน 10

### 5. Scope Boundary

- ไม่แก้ไข source code ของ project โดยตรง
- ถ้าพบว่าต้องแก้ไข project ให้หยุดและแนะนำให้ใช้ `/validate` ใน project workspace

## Expected Outcome

- ทุก `.md` ไฟล์มี structure สม่ำเสมอ ผ่าน `/follow-write-devin-skills`
- Content ครอบคลุมทุก features, APIs, และ use cases
- ไม่มี broken references
- ทุก skill สอดคล้องกันในเรื่องภาษา, format, terminology
- ไม่มี redundancy ข้าม skill
- `AGENTS.md` ผ่าน `/update-agents-md`
- `README.md` ผ่าน `/update-readme`
- รายงานสรุปผลชัดเจน
