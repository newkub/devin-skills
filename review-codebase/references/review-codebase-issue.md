---
name: review-codebase-issue
description: Review codebase สำหรับระบุ issues พร้อม severity และ actionable recommendations
---

## Goal

Review codebase อย่างเป็นระบบ ระบุ issues พร้อม severity และ actionable recommendations

## Scope

ใช้สำหรับ review codebase ทุกประเภท: code, content, documentation, configuration, workflows, skills ถ้าต้องการ comprehensive quality gate ให้ใช้ `/deep-review` แทน

## Execute

### 1. Define Review Target

กำหนดขอบเขตสิ่งที่จะ review

> Goal: รู้ target, criteria, และ scope ของการ review

1. ระบุสิ่งที่จะ review (code file, content, docs, config, workflow, ฯลฯ)
2. กำหนด review criteria ตามประเภทของ target
3. ระบุ scope: ไฟล์ที่เกี่ยวข้อง, modules, หรือ sections
4. ถ้าเป็น comprehensive review ให้ใช้ `/deep-review` แทน

### 2. Gather Context

รวบรวมบริบทก่อน review

> Goal: เข้าใจ context, dependencies, และ impact areas

1. อ่านไฟล์หรือเนื้อหาที่จะ review
2. อ่าน conventions, standards, หรือ `AGENTS.md` ที่เกี่ยวข้อง
3. ระบุ dependencies และ impact areas
4. ตรวจสอบว่ามี tests ครอบคลุมส่วนที่ review หรือไม่

### 3. Review Against Criteria

ตรวจสอบตาม criteria ที่กำหนด

> Goal: ทุก finding มี evidence และถูกบันทึก

1. ตรวจสอบความถูกต้อง: logic, syntax, facts, หรือ content accuracy
2. ตรวจสอบคุณภาพ: readability, consistency, completeness, best practices
3. ตรวจสอบความเหมาะสม: สอดคล้องกับ context, requirements, และ constraints
4. ใช้ `Grep` หรือ `ast-grep` สำหรับ pattern-based checks ถ้าเกี่ยวข้อง
5. บันทึกทุก finding พร้อม evidence (file path, line number, หรือ section)

### 4. Classify Severity

จัดประเภทความรุนแรงของแต่ละ finding

> Goal: ทุก finding มี severity rating และ root cause

1. ระบุ severity ของแต่ละ finding:
   - Critical: blocking, security risk, data loss, ผิดพื้นฐาน
   - High: core functionality at risk, ผิดหลักการสำคัญ
   - Medium: quality issue, minor gap, ไม่ follow best practice
   - Low: cosmetic, naming, minor improvement
2. ระบุ root cause ของแต่ละ finding ถ้าเป็นไปได้
3. ระบุ false positives ที่พบ

### 5. Provide Recommendations

ให้คำแนะนำที่ actionable สำหรับแต่ละ finding

> Goal: Recommendations ที่ concrete และจัดลำดับตาม priority

1. ให้ recommendation ที่ concrete และ actionable สำหรับทุก finding
2. จัดลำดับ recommendations ตาม severity และ impact
3. ระบุ quick wins และ strategic fixes
4. ถ้า finding ต้องแก้ไข ให้ชี้ไปยัง `/resolve-errors` หรือ workflow ที่เกี่ยวข้อง

### 6. Report Results

รายงานผลการ review

> Goal: รายงานเป็นตารางพร้อม overall assessment

1. ทำ `/report` เพื่อรายงานในแชทเป็นตาราง
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. จัดกลุ่ม findings ตาม category และเรียงตาม severity
4. สรุป overall assessment และ health indicator
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number, code snippet, หรือ section)
- ไม่เดา ใช้ tools สำหรับ verification
- อ้างอิง standards หรือ best practices ที่ตรวจสอบได้

### 2. Review Independence

- ทำ review เท่านั้น ไม่แก้ไขระหว่าง review
- ใช้ `/comment-todo` สำหรับระบุ issues ใน code
- แยก review process จาก fix process

### 3. Non-Redundancy

- ใช้ `/deep-review` สำหรับ comprehensive quality gate review
- ใช้ `/review-codebase` สำหรับ PR-specific review
- ใช้ `/validate` สำหรับ general validation
- Workflow นี้เน้น general-purpose review ที่ไม่ซ้ำซ้อนกับ specialized workflows

### 4. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- Findings ทั้งหมดมี severity rating และ evidence
- Recommendations ที่ actionable และจัดลำดับตาม priority
- รายงานในแชทเป็นตารางตาม `/report`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- แยก review จาก fix process
