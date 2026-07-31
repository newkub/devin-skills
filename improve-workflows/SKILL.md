---
name: improve-workflows
description: ปรับปรุง workflow ให้ถูกต้อง ครอบคลุม และเป็นไปตาม best practices
---

## Goal

ปรับปรุง workflow ให้ถูกต้อง ครอบคลุม สม่ำเสมอ และเป็นไปตาม best practices

## Scope

ใช้สำหรับปรับปรุง workflow หนึ่งไฟล์หรือกลุ่มย่อย ทั้งใน `global_workflows/` และ workspace (`.devin/workflows` หรือ `.windsurf/workflows`)

หมายเหตุ: สำหรับ batch update ทั้งหมด ใช้ `/improve-all-workflows` แทน

## Execute

### 1. Identify Target Workflows

ระบุ workflow ที่ต้องปรับปรุง

1. ระบุ workflow file ที่ต้องปรับปรุง (เดียวหรือกลุ่มย่อย)
2. ทำ `/read-related-workflows` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
3. ตรวจสอบว่า workflow สอดคล้องกับ project context ถ้าอยู่ใน workspace

### 2. Check Correctness

ตรวจสอบความถูกต้องตามมาตรฐาน

1. ทำ `/check-correctness` เพื่อตรวจสอบ structure, frontmatter, sections ครบถ้วน
2. ทำ `/check-reference` เพื่อตรวจสอบ references ที่อ้างถึงมีอยู่จริง
3. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
4. บันทึก issues ที่พบพร้อม priority (Critical, High, Medium, Low)

### 3. Research Best Practices

ค้นหา best practices สำหรับ topics ที่เกี่ยวข้อง

1. ทำ `/deep-research` สำหรับ tools/libraries ที่ workflow เกี่ยวข้อง
2. ทำ `/follow-best-practice` สำหรับ context ของ workflow นั้นๆ
3. ตรวจสอบว่าข้อมูลเป็นปัจจุบันและสอดคล้องกับ official documentation
4. ระบุ patterns และ conventions ที่แนะนำจาก findings

### 4. Apply Improvements

ปรับปรุง workflow ตาม findings

1. แก้ไข issues ตาม priority จาก `/check-correctness` (Critical ก่อน)
2. ทำ `/review-code-quality` สำหรับ issues ด้านเนื้อหาและ structure
3. ปรับปรุง content ตาม `/follow-content-quality` (clarity, completeness, consistency)
4. ทำ `/improve-flow` เพื่องปรับ step ordering, dependencies, parallelism, transitions ให้ fail-fast และชัดเจน
6. ทำ `/review-workflow-content` เพื่อง review คุณภาพเนื้อหา ลด noise และกรอง high-impact content
7. อัปเดตเนื้อหาตาม best practices ที่ research ได้
8. ใช้ references แทนการ duplicate เนื้อหาจาก workflows อื่น
7. ตรวจสอบว่าไม่ซ้ำซ้อนระหว่าง `Execute` และ `Rules`


### 5. Improve Coverage

ปรับปรุงความครอบคลุมของเนื้อหา

1. ทำ `/review-delivery` เพื่อตรวจสอบว่า workflow ครอบคลุม use cases ครบถ้วน
2. ทำ `/review-code-quality` เพื่อตรวจสอบ missing sections หรือ steps
3. เพิ่ม edge cases และ conditional execution ที่ขาดหาย
4. ตรวจสอบว่า Expected Outcome สอดคล้องกับ Goal

### 6. Verify And Report

ตรวจสอบผลการปรับปรุง

1. ทำ `/check-correctness` อีกครั้งเพื่อ verify
2. ทำ `/check-reference` เพื่อยืนยัน references ทั้งหมดถูกต้อง
3. ทำ `/validate-workflow` เพื่องตรวจสอบ criteria เฉพาะของ workflow
4. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
5. ทำ `/report` เพื่อสรุปการปรับปรุง
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Correctness First

แก้ไข Critical issues ก่อนเสมอ

- แก้ไข Critical issues ก่อนเสมอ
- ตรวจสอบ frontmatter ถูกต้อง (title, description, `auto_execution_mode: 3`)
- ตรวจสอบ sections ครบถ้วน (Goal, Scope, Execute, Rules, Expected Outcome)
- ทำ `/check-reference` ก่อนและหลังแก้ไข

### 2. Research-Driven Improvements

ใช้ research เป็นพื้นฐานสำหรับการปรับปรุง

- ทำ `/deep-research` สำหรับ tools/libraries ที่เกี่ยวข้อง
- อ้างอิง official documentation เป็น primary source
- ตรวจสอบ version compatibility และ information freshness
- ใช้ `/follow-best-practice` สำหรับ context ของ workflow

### 3. Coverage Quality

ครอบคลุม use cases และ edge cases ครบถ้วน

- ครอบคลุม use cases ครบถ้วน (ทำ `/review-code-quality`)
- ครอบคลุม edge cases และ conditional execution
- Expected Outcome สอดคล้องกับ Goal
- ไม่มี missing sections หรือ steps (ทำ `/review-code-quality`)

### 4. Content Quality

เนื้อหามีคุณภาพและไม่ซ้ำซ้อน

- ใช้ references แทนการ duplicate เนื้อหา
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- เนื้อหา explicit แทน implicit
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`
- Execute headings: English Title Case, Rules: ภาษาไทย

### 5. Minimal Changes

แก้ไขเฉพาะสิ่งที่จำเป็น

- แก้ไขเฉพาะสิ่งที่จำเป็น (ทำ `/dont-over-engineer`)
- รักษา workflow intent เดิม
- หลีกเลี่ยงการเขียนใหม่ทั้งไฟล์ถ้าไม่จำเป็น
- ใช้ `/edit-only` เมื่อเป็นไปได้

### 6. Verification

ตรวจสอบผลการปรับปรุงหลังแก้ไข

- ทำ `/check-correctness` อีกครั้งหลังแก้ไข
- ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
- ทำ `/check-reference` เพื่อยืนยัน references ถูกต้อง
- ทำ `/report` เพื่อสรุปการปรับปรุง

## Expected Outcome

- Workflow ถูกต้องตามมาตรฐาน `/write-workflows`
- ไม่มี broken references
- เนื้อหาครอบคลุมและเป็นไปตาม best practices
- ไฟล์ไม่เกิน 250 บรรทัด
- สอดคล้องกับ official documentation และ current best practices
- Expected Outcome สอดคล้องกับ Goal
