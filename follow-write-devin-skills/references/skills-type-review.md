---
name: skills-type-review
description: Template สำหรับ review-* skills วิเคราะห์ quality
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `review-*` skills ที่วิเคราะห์ quality พร้อม severity ratings, review score, และ actionable recommendations

## Scope

ใช้สำหรับ skills ที่ review เช่น `review-code-quality`, `review-security`, `review-performance`, `review-architecture` — ไม่รวม `review-codebase` ซึ่งเป็น orchestrator

## Execute

### 1. Gather Context

รวบรวม context ก่อน review

> Goal: เข้าใจ scope, target, และ criteria ของ review

1. ระบุ review target: file, directory, package หรือทั้ง project
2. อ่าน relevant configs, อ่าน dependencies, ทำ `/scan-codebase`
3. ระบุ review criteria และ rubric สำหรับแต่ละ dimension
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review

### 2. Deep Analyze

วิเคราะห์ target อย่างลึกซึ้งด้วย review CLI และ rules

> Goal: พบทุก issue พร้อม root cause และ review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules ใน `rules/` ด้วย
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยกเพื่อให้แน่ใจว่า rules ครอบคลุม
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
6. ตรวจสอบทีละ dimension ตาม criteria จาก review CLI output
7. จับ findings เป็น list พร้อม evidence (file, line, code snippet)
8. ตรวจสอบทั้ง positive และ negative aspects

### 3. Run Health

รัน review CLI เพื่อดึง metrics ล่าสุด

> Goal: มี review report พร้อม metrics สำหรับ scoring

1. ทำ `/run-review` เพื่อรัน review CLI และดึง review report
2. ใช้ review report สำหรับคำนวณ review score ในขั้นตอนถัดไป

### 4. Validate Findings

ตรวจสอบ findings อย่างละเอียดหลายมิติ

> Goal: findings ที่ผ่าน validation เท่านั้น ลด noise และ rework

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. cross-check: แต่ละ finding ต้องมี evidence ชัดเจน (file, line, code) — ถ้าไม่มี → discard
3. ตรวจสอบว่า finding เป็นปัญหาจริง ไม่ใช่ false positive จาก tool
4. ถ้า finding ซ้อนทับกับ review อื่น → อ้างอิงแทน ไม่ duplicate
5. ถ้า finding นอก scope → ระบุเป็น info เท่านั้น ไม่ rate severity

### 5. Rate Severity And Review Score

ให้คะแนน severity ของแต่ละ finding และคำนวณ review score

> Goal: ผู้ใช้รู้ลำดับความสำคัญและสถานะ overall review score

1. ให้ severity: Critical, High, Medium, Low, Info
2. พิจารณา impact (security, performance, maintainability, UX)
3. พิจารณา effort: quick fix, moderate, major refactor
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. จัดลำดับ findings ตาม severity

### 6. Recommend

แนะนำ actions ที่ actionable และจัดลำดับตาม priority

> Goal: ผู้ใช้รู้ว่าต้องทำอะไรก่อน พร้อม estimated effort

1. สำหรับแต่ละ finding → แนะนำ fix หรือ skill ที่เหมาะสม
2. จัดกลุ่ม recommendations: immediate, short-term, long-term
3. ระบุ estimated effort สำหรับแต่ละ action
4. ทำ `/report-review`, ทำ `/report-table` สำหรับ summary
5. ทำ `/suggest-next-action`

### 7. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Objectivity

- ให้คะแนนตาม criteria ที่กำหนด ไม่ตามความชอบส่วนตัว
- ระบุ evidence ทุก finding — file, line, code snippet
- ถ้าไม่แน่ใจ → ระบุระดับความไม่แน่นอน

### 2. Actionable

- ทุก finding ต้องมี recommendation
- ถ้า recommendation คือ "ทำ skill X" → ระบุว่าทำยังไง
- ถ้า issue ไม่สามารถแก้ได้ในปัจจุบัน → ระบุเป็น long-term

### 3. Balance

- รายงานทั้ง strengths และ weaknesses
- ไม่ focus เฉพาะ negative
- ชื่นชม patterns ที่ดี

### 4. Scope

- ไม่ review นอก scope ที่กำหนด
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ถ้า issue ซ้อนทับกับ review อื่น → อ้างอิง

### 5. Evidence Quality

- แต่ละ finding ต้องมี: file path, line number, code snippet หรือ config evidence
- ถ้า evidence ไม่เพียงพอ → ทำ `/scan-codebase` เพิ่มเติม
- ห้าม report โดยไม่มี evidence หรืออ้างอิงจากความจำเพียงอย่างเดียว

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Review report พร้อม severity ratings, review score, และ recommendations
- ผู้ใช้รู้ลำดับการแก้ไขและ estimated effort
- ทุก finding มี evidence และ actionable fix
- Review score ต่อ dimension และ overall
