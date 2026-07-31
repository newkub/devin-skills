---
name: refactor-workflow
description: Refactor โครงสร้าง workflow files แยก/รวม/restructure ลด redundancy
---

## Goal

Refactor โครงสร้าง workflow files เพื่อปรับปรุง organization, ลด redundancy, และเพิ่ม maintainability

## Scope

ใช้สำหรับ refactor โครงสร้าง workflow files ทั้งใน `global_workflows/` และ workspace (`.devin/workflows` หรือ `.windsurf/workflows`) ครอบคลุมการแยก, รวม, restructure steps, ลด redundancy ระหว่าง workflows ไม่รวมการสร้าง workflow ใหม่ (ใช้ `/follow-write-devin-skills`) หรือปรับปรุงเนื้อหา (ใช้ `/improve-workflows`)

## Execute

### 1. Analyze Current Workflows

วิเคราะห์ workflows ปัจจุบันเพื่อระบุปัญหาโครงสร้าง

1. ทำ `/deep-review` เพื่อ review structure และระบุ issues
2. ทำ `/read-related-workflows` เพื่อสร้าง dependency graph
3. ระบุ workflows ที่มี scope ซ้อนทับกัน
4. ระบุ workflows ที่มี steps เกิน 10 หรือไฟล์เกิน 250 บรรทัด
5. ระบุ workflows ที่มี single responsibility ไม่ชัดเจน

### 2. Plan Refactor Strategy

วางแผนการ refactor ตาม findings

1. จัดกลุ่ม workflows ที่มีปัญหาเป็น categories: Split, Merge, Restructure, Deduplicate
2. สำหรับแต่ละ category กำหนด action:
   - Split: workflow ใหญ่เกินไป → แยกเป็นหลายไฟล์
   - Merge: workflows ที่ซ้ำซ้อน → รวมเป็นไฟล์เดียว
   - Restructure: steps ไม่เป็นระบบ → จัดลำดับใหม่
   - Deduplicate: เนื้อหาซ้ำกัน → ใช้ references แทน
3. จัดลำดับตาม impact: High redundancy ก่อน, Large files ก่อน, Broken structure ก่อน
4. ทำ `/dont-over-engineer` เพื่อตรวจสอบว่าไม่ refactor เกินจำเป็น

### 3. Split Large Workflows

แยก workflows ที่ใหญ่เกินไปหรือมีหลาย responsibilities

1. ระบุ workflow ที่เกิน 250 บรรทัดหรือมีหลาย responsibilities
2. ทำ `/refactor` เพื่อระบุ responsibility ของ workflow ก่อน split — แบ่งเป็น sub-workflows ตาม single responsibility principle
3. สร้าง orchestrator workflow ที่อ้างถึง sub-workflows ผ่าน `related_workflows`
4. ทำ `/follow-write-devin-skills` สำหรับ sub-workflows ใหม่
5. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด

### 4. Merge Redundant Workflows

รวม workflows ที่มี scope ซ้อนทับหรือซ้ำซ้อนกัน

1. ระบุ workflows ที่มี scope ซ้อนทับหรือเนื้อหาซ้ำกัน
2. ทำ `/merge` เพื่อรวมเนื้อหาเป็นไฟล์เดียว
3. รักษา workflow intent เดิม ไม่สูญเสียข้อมูล
4. ลบ workflow files เดิมที่ถูกรวมแล้ว
5. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด

### 5. Restructure Steps

จัดระเบียบ steps ใน Execute section ให้เป็นระบบ

1. ตรวจสอบลำดับ: Foundation ก่อน, High impact ก่อน, Dependencies ก่อน
2. รวม steps ที่เกี่ยวข้องเป็นกลุ่มเดียวกัน
3. แยก steps ที่ไม่เกี่ยวข้องออกจากกัน
4. ตรวจสอบว่าแต่ละ step มีเงื่อนไขการเสร็จชัดเจน
5. ลดจำนวน steps ไม่เกิน 10 ตาม context rot mitigation

### 6. Deduplicate Content

ลดเนื้อหาซ้ำซ้อนระหว่าง workflows

1. ระบุเนื้อหาที่ซ้ำกันระหว่าง workflows
2. แทนที่เนื้อหาซ้ำด้วย references ไปยัง workflow ต้นทาง
3. ตรวจสอบว่าไม่ซ้ำซ้อนระหว่าง Execute และ Rules
4. ใช้ `related_workflows` ใน frontmatter สำหรับ dependencies
5. ทำ `/follow-content-quality` เพื่อตรวจสอบคุณภาพหลัง deduplicate

### 7. Update References And Sort

อัปเดท references และจัดเรียง workflows

1. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมดที่เกี่ยวข้อง
2. ทำ `/check-reference` เพื่อยืนยัน references ถูกต้อง
3. ทำ `/follow-ordering-workflows` เพื่อจัดเรียง workflows ตาม prefix และ alphabetical
4. ตรวจสอบ bidirectional references: ถ้า A อ้างถึง B, B ควรอ้างถึง A

### 8. Verify Quality

ตรวจสอบคุณภาพหลัง refactor

1. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
2. ตรวจสอบ sections ครบ: Goal, Scope, Execute, Rules, Expected Outcome
3. ทำ `/refactor` เพื่อตรวจสอบว่าทุก workflow มี single responsibility ชัดเจน
4. ทำ `/deep-review` เพื่อ verify ผลการ refactor
5. ทำ `/report` เพื่อสรุปการ refactor

## Rules

### 1. Structural Focus

- เน้น refactor โครงสร้าง: split, merge, restructure, deduplicate
- ไม่แก้ไขเนื้อหาเชิงคุณภาพ (ใช้ `/improve-workflows` แทน)
- ไม่สร้าง workflow ใหม่ (ใช้ `/follow-write-devin-skills` แทน)
- รักษา workflow intent เดิม

### 2. Non-Redundancy

- ใช้ references แทนการ duplicate เนื้อหาระหว่าง workflows
- Orchestrator workflow อ้างถึง sub-workflow โดยไม่ระบุรายละเอียดภายใน
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- แต่ละ workflow มี single responsibility ชัดเจน — ทำ `/refactor` เพื่อ verify

### 3. Safety Measures

- ทำ `/deep-review` ก่อนแริ่ม refactor เสมอ
- สร้าง commit checkpoint ก่อน refactor เพื่อ rollback ได้
- ทำ `/update-reference` หลังทุกการ split, merge, หรือ restructure
- ทำ `/check-reference` เพื่อยืนยันไม่มี broken references

### 4. Avoid Over-Refactoring

- ทำ `/dont-over-engineer` เพื่อตรวจสอบว่าไม่ refactor เกินจำเป็น
- ไม่แยก workflows เล็กเกินไป (micro-workflows)
- ไม่รวม workflows ที่มี responsibilities แตกต่างกัน
- พิจารณา change frequency และ usage patterns ก่อนตัดสินใจ

### 5. Size Limits

- ไฟล์ไม่เกิน 250 บรรทัด
- Execute steps ไม่เกิน 10 ตาม context rot mitigation
- ถ้าเกินขีดจำกัด ให้ split ออกเป็น sub-workflows

### 6. Non-Duplication With Related Workflows

- ใช้ `/follow-write-devin-skills` สำหรับสร้าง workflow ใหม่
- ใช้ `/improve-workflows` สำหรับปรับปรุงเนื้อหา
- ใช้ `/deep-review` สำหรับ review ก่อน refactor
- ใช้ `/restructure` สำหรับ restructure ไฟล์และโฟลเดอร์ทั่วไป
- Workflow นี้เน้นเฉพาะ structural refactor ของ workflow files เท่านั้น

## Expected Outcome

- Workflows มี single responsibility ชัดเจน
- ไม่มีเนื้อหาซ้ำซ้อนระหว่าง workflows
- ไฟล์ไม่เกิน 250 บรรทัด
- Execute steps ไม่เกิน 10 และเป็นระบบ
- ไม่มี broken references
- Workflows จัดเรียงตาม `/follow-ordering-workflows`
- ผ่าน `/deep-review` หลัง refactor
