---
name: follow-alignment
description: จัดให้ project artifacts, rules, skills, docs และ code มี alignment สอดคล้องกัน
related:
  - update-project
  - update-project-rules
  - update-project-skills
  - update-dot-devin
  - review-references
  - review-consistency
  - update-agents-md
  - update-readme-md
  - update-usage-md
  - follow-architecture
  - check-code-structure
  - run-scan
  - validate
---

## Goal

ตรวจสอบและแก้ไขให้ project artifacts ทั้งหมดมี alignment สอดคล้องกัน ครอบคลุม devin rules, ast-grep rules, `AGENTS.md`, docs, skills, และ code

## Scope

ใช้หลังจากมีการเปลี่ยน rules, architecture, dependencies, skills, หรือ docs เพื่อ sync ความสอดคล้องระหว่างทุก layer

## Execute

### 1. Inventory Artifacts

> Goal: รวบรวมสิ่งที่ต้อง align

1. สแกน `.devin/rules/`, `rules/`, `sgconfig.yml`
2. อ่าน `AGENTS.md`, `README.md`, `USAGE.md`, `package.json`
3. อ่าน `global_rules.md` และ skills ที่เกี่ยวข้อง
4. บันทึก list ของ artifacts พร้อม version/last-updated

### 2. Detect Misalignment

> Goal: หาความไม่สอดคล้อง

1. ทำ `/review-references` เพื่อตรวจ broken/stale/circular references
2. ทำ `/review-consistency` เพื่อตรวจภาษา, terminology, format ข้ามไฟล์
3. เปรียบเทียบ devin rules กับ ast-grep rules
4. เปรียบเทียบ `AGENTS.md` กับ skills/rules จริง
5. เปรียบเทียบ docs (`README.md`, `USAGE.md`) กับ code และ config
6. ระบุ gaps พร้อม severity

### 3. Align Rules

> Goal: ทำให้ rules ทั้งสองระบบตรงกัน

1. ถ้า rules ล้าหลัง dependencies หรือ architecture → ทำ `/update-project-rules`
2. ถ้า `.devin` structure ไม่ถูกต้อง → ทำ `/update-dot-devin`
3. ถ้า `sgconfig.yml` ไม่ตรง rule directories → แก้ไข
4. รัน `/run-scan` และปรับ false positives/negatives

### 4. Align Docs

> Goal: ทำให้ docs สะท้อนสถานะปัจจุบัน

1. ถ้า `AGENTS.md` ไม่ครอบคลุม skills/workflows → ทำ `/update-agents-md`
2. ถ้า `README.md` ล้าหลัง → ทำ `/update-readme-md`
3. ถ้า `USAGE.md` ล้าหลัง → ทำ `/update-usage-md`
4. ตรวจ cross-references ระหว่าง docs

### 5. Align Code And Architecture

> Goal: ทำให้ code สอดคล้องกับ rules และ docs

1. ทำ `/follow-architecture` เพื่อตรวจโครงสร้างและ boundaries
2. ทำ `/check-code-structure` สำหรับ code patterns ที่ผิด conventions
3. ตรวจ `package.json` dependencies กับ rules ใน `libs/`
4. ปรับ code หรือ rules ให้ตรงกัน

### 6. Validate

> Goal: ยืนยันว่าทุกอย่างสอดคล้อง

1. ทำ `/validate` สำหรับ project
2. รัน `bun run typecheck`, `bun run lint`, `bun run scan`
3. ทำ `/run-scan` กับ ast-grep rules
4. รัน tests ถ้ามี

### 7. Report

> Goal: สรุป alignment status

1. ทำ `/report-markdown-table` คอลัมน์: Artifact, Before, After, Status
2. ระบุสิ่งที่ยังไม่ตรงและเหตุผล
3. ทำ `/suggest-next-action`

## Rules

### 1. Start With Detection

- ไม่แก้ไขก่อนตรวจจับ misalignment ครบ
- แยก auto-fixable กับ manual
- ทำ dry run ก่อนการเปลี่ยนแปลงใหญ่

### 2. Preserve Intent

- ไม่เปลี่ยน rules หรือ docs โดยไม่เข้าใจ context
- ถ้า rule กับ code ขัดแย้ง → ถาม user ก่อนว่าฝ่ายใดเป็นตัวตั้ง
- รักษา public API และ backward compatibility ถ้าไม่จำเป็น

### 3. Minimal Scope

- แก่เฉพาะสิ่งที่ misalign จริง
- ไม่ rewrite ทั้ง docs/rules ถ้าไม่จำเป็น
- แก้ root cause ไม่ใช่ symptoms

### 4. Cross-Reference Safety

- ทุกการ rename หรือย้ายต้อง update references
- ใช้ `/review-references` ก่อนและหลังแก้ไข
- ไม่สร้าง circular references

## Expected Outcome

- devin rules, ast-grep rules, `sgconfig.yml` สอดคล้องกัน
- `AGENTS.md`, `README.md`, `USAGE.md` สะท้อนสถานะปัจจุบัน
- code สอดคล้องกับ rules และ architecture
- ไม่มี broken/stale/circular references
- `bun run typecheck`, `lint`, `scan` ผ่าน
- รายงาน alignment status พร้อม action items
