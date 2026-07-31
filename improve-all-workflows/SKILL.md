---
name: improve-all-workflows
description: ปรับปรุง global workflows ทั้งหมดให้สมบูรณ์และสม่ำเสมอ
---

## Goal

ปรับปรุง workflows ทั้งหมดให้สมบูรณ์ สม่ำเสมอ และตรงตามมาตรฐาน `/write-workflows`

## Scope

ปรับปรุง workflows ทั้งใน `global_workflows/` และ workspace (`.devin/workflows` หรือ `.windsurf/workflows`) ครอบคลุม structure, content, references, และ best practices ไม่รวมการสร้าง workflow ใหม่

## Execute

### 1. Review And Inventory

Review workflows ก่อนปรับปรุง

1. ทำ `/all-folders` เพื่อรีวิว workflows ทีละ folder ถ้ามีหลาย workspace
2. ทำ `/deep-review` เพื่อ review workflows ทั้งหมดและระบุ issues พร้อม severity
3. ทำ `/read-related-workflows` เพื่ออ่านและสร้าง dependency graph
4. ถ้าอยู่ใน workspace ตรวจสอบว่ามี `.devin/workflows` หรือ `.windsurf/workflows`
5. จัดลำดับ workflows ที่ต้องปรับปรุงตาม severity จาก review report
6. ตรวจสอบไฟล์ที่เกิน 250 บรรทัด

### 2. Apply Structure Improvements

ปรับปรุง structure ตาม `/write-workflows` สำหรับทุก workflow

1. ตรวจสอบ frontmatter ถูกต้อง (title, description, auto_execution_mode, related_workflows)
2. ตรวจสอบ sections ครบถ้วน (Goal, Scope, Execute, Rules, Expected Outcome)
3. ปรับ heading ใน Execute เป็น English Title Case
4. ปรับ Rules เป็นภาษาไทย
5. ลดจำนวนบรรทัดไม่เกิน 250
7. ทำ `/improve-flow` เพื่องปรับ step ordering, dependencies, parallelism ให้ fail-fast
6. ถ้าอยู่ใน workspace ตรวจสอบว่า workflow สอดคล้องกับ project context

### 3. Apply Content Quality

ปรับปรุงคุณภาพเนื้อหาตาม `/follow-content-quality`

> Goal: เนื้อหาชัดเจน ไม่ซ้ำซ้อน ครอบคลุม

1. ทำให้เนื้อหา explicit แทน implicit
2. ลดความซ้ำซ้อนระหว่าง Execute และ Rules
3. ใช้ references แทนการ duplicate เนื้อหา
4. ปรับปรุง content ตาม `/follow-content-quality` (clarity, completeness, consistency)
5. ทำ `/review-workflow-content` เพื่อง review คุณภาพเนื้อหา ลด noise และกรอง high-impact content
6. ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`


### 4. Fix References

แก้ไข references ที่เสียหาย

1. ตรวจสอบ workflows ที่อ้างถึงมีอยู่จริง
2. ตรวจสอบ skills ที่อ้างถึงมีอยู่จริง
3. ลบ references ที่ไม่มีอยู่จริง
4. เพิ่ม references ที่ขาดหาย
5. ทำ `/check-reference` หลังแก้ไข

### 5. Align With Best Practices

ปรับให้สอดคล้องกับ best practices

1. ทำ `/follow-best-practice` สำหรับ topics ที่เกี่ยวข้อง
2. ตรวจสอบ workflow structure สอดคล้องกับ markdown best practices
3. อ้างอิง official documentation สำหรับ tools/libraries เฉพาะเจาะจง
4. ปรับให้สอดคล้องกับ execution guidelines
5. ตรวจสอบว่า `analyze-*` workflows มี report step (เช่น `/report-format-table`)
6. ตรวจสอบว่า `review-*` workflows มี report step (เช่น `/report-review`)

### 6. Batch Update Workflows

อัพเดท workflows เป็น batch เพื่อประสิทธิภาพ

1. จัดกลุ่ม workflows ตาม category (improve, follow, use, run, test)
2. ถ้าจำนวน workflows มากกว่า 10 ไฟล์ ให้ทำ `/use-scripts` เพื่อ batch processing
3. อัพเดทตามลำดับความสำคัญจาก review report
4. ตรวจสอบว่า changes รักษาความหมายเดิม
5. ทำ `/check-reference` หลังแต่ละ batch
6. ถ้าอยู่ใน workspace ตรวจสอบว่าไม่มี conflicts กับ project-specific workflows

### 7. Verify Improved Workflows

ตรวจสอบ workflows ที่ปรับปรุงแล้วอย่างละเอียดทุกขั้นตอน

> Goal: workflows ผ่าน criteria เฉพาะและ references ถูกต้อง

1. ตรวจสอบว่า workflows ที่ปรับปรุงแล้วทำตามได้จริงทุก step — อ่าน workflow และทำตาม step โดยไม่ข้ามขั้นตอน
2. ตรวจสอบว่าทุก step ใน workflow ที่ปรับปรุงแล้ว deterministic และ idempotent
3. ทำ `/validate-workflow` สำหรับแต่ละ workflow ที่ปรับปรุงแล้ว
4. ตรวจสอบว่า references ทั้งหมดยังใช้งานได้หลังปรับปรุง
5. ถ้าพบ issue จาก verification → กลับไปแก้ที่ Step 2-6 แล้ว verify ใหม่


## Rules

### 1. Follow Write Standards

- ทำตาม `/write-workflows` สำหรับ structure, content, language, และ reference standards
- ไม่ duplicate Rules จาก `/write-workflows` — ใช้ reference แทน

### 2. Batch Processing

- อัพเดทตามลำดับความสำคัญจาก review report
- ตรวจสอบไม่มี broken references หลัง updates
- รักษา workflow intent เดิม
- ถ้าจำนวน workflows มากกว่า 10 ไฟล์ ให้ทำ `/use-scripts`

### 3. Review Before Improve

- ทำ `/deep-review` ก่อนปรับปรุงเสมอ
- ปรับปรุงตาม severity จาก review report
- ไม่แก้ไข workflows ที่ผ่านมาตรฐานแล้ว

## Expected Outcome

- Workflows ทั้งหมดมี structure สม่ำเสมอ (global และ workspace)
- Content quality สูงและชัดเจน
- ไม่มี broken references
- ไฟล์ไม่เกิน 250 บรรทัด
- สอดคล้องกับ best practices
- เป็น single source of truth
- ถ้าอยู่ใน workspace: workflows สอดคล้องกับ project context
