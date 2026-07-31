---
name: improve-windsurf-global-workflows-all
description: ปรับปรุง skills, global rules, workflows ให้สอดคล้องกัน
---

## Goal

ปรับปรุง skills, global rules, workflows ทั้งหมดให้สอดคล้องกัน พร้อม review ก่อน improve

## Scope

ครอบคลุม `global_workflows/`, `skills/`, `global_rules.md` — ไม่รวม project-level workflows หรือ project rules

## Execute

### 1. Commit And Analyze

Commit changes ที่มีอยู่และวิเคราะห์โครงสร้างปัจจุบัน

> Goal: Working directory สะอาด และเข้าใจโครงสร้างปัจจุบัน

1. ทำ `/git-commit` เพื่อ commit changes ที่มีอยู่ — ตรวจสอบ working directory สะอาด
2. สำรวจ workflows, skills, และ `global_rules.md` ทั้งหมด — จัดกลุ่มตาม type
3. ระบุไฟล์ที่ซ้ำซ้อน ขัดแย้ง หรือไม่สอดคล้องกัน — ถ้าไม่พบปัญหา → stop และ report

### 2. Review Quality

Review คุณภาพของ workflows, skills, และ global rules

> Goal: ระบุ issues ทั้งหมดก่อน improve

1. Review workflows ตาม `/follow-write-devin-skills`, Review skills ตาม `/follow-write-skill-md`, Review `global_rules.md` ตาม content quality
2. ตรวจสอบ cross-references: workflows → skills, skills → workflows, rules → both
3. ระบุ broken references, missing related, unused related — จัดลำดับตาม severity

### 3. Improve Workflows

ปรับปรุง workflows ให้สอดคล้องกับ `/follow-write-devin-skills`

> Goal: ทุก workflow ผ่าน validation

1. ทำ `/improve-all-skills` เพื่อปรับปรุง skills ทั้งหมด
2. ถ้ามี skills ซ้ำซ้อน → รวมหรือลบ และทำ `/update-reference`
3. ถ้า fail → retry (max 3 → stop/report)

### 4. Improve Skills

ปรับปรุง skills ให้สอดคล้องกับ `/follow-write-skill-md`

> Goal: ทุก skill ผ่าน validation

1. ทำ `/improve-all-skills` เพื่อปรับปรุง skills ทั้งหมด
2. ตรวจสอบ skill folders มี prefix ตรงตาม skill types — rename ถ้าจำเป็น
3. ถ้า fail → retry (max 3 → stop/report)

### 5. Improve Global Rules

ปรับปรุง `global_rules.md` และ rule files ให้สอดคล้องกับ workflows และ skills

> Goal: Rules สอดคล้องกับ workflows และ skills

1. ทำ `/improve-rules` เพื่องปรับปรุง `global_rules.md`, `.devin/rules/`, และ `rules/` (ast-grep)
2. ตรวจสอบ consistency: terminology, references, cross-references ระหว่าง rules → workflows → skills
3. ถ้า fail → retry (max 3 → stop/report)

### 6. Validate And Report

ตรวจสอบผลลัพธ์และรายงาน

> Goal: ทุกอย่างสอดคล้องกัน และมี report ชัดเจน

1. ทำ `/validate`, `/check-correctness` — validate structure และ check correctness ของ cross-references
2. ทำ `/update-reference` เพื่ออัปเดท references ทั้งหมด
3. รายงานเป็นตาราง: component | files checked | issues found | issues fixed | status
4. ทำ `/suggest-next-action` — แนะนำ action ถัดไป

## Rules

### 1. Review Before Improve

- ต้อง review ทุก component ก่อนแก้ไข — ไม่แก้ไฟล์ที่ผ่านแล้ว
- ใช้ `/follow-write-devin-skills` สำหรับ workflows, `/follow-write-skill-md` สำหรับ skills
- ถ้า component ผ่านทุกข้อ → ข้าม ไม่ force change

### 2. Cross-Reference Alignment

- Skills อ้างอิง workflows ที่ถูกต้อง — Workflows อ้างอิงกัน — Global rules สอดคล้องกับ both
- ไม่ซ้ำซ้อนระหว่าง skills, workflows, global rules — ใช้ terminology สม่ำเสมอ
- ไฟล์ที่อ้างอิงต้องมีอยู่จริง — ถ้าไม่มี → ลบ reference หรือสร้างไฟล์

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler

## Expected Outcome

- Skills, global rules, workflows สอดคล้องกัน — ไม่ซ้ำซ้อน ไม่ขัดแย้ง
- ตาราง report: component | files checked | issues found | issues fixed | status
- ไม่มี broken references — ทุก step มี `, ` markers สำหรับ parallel execution
