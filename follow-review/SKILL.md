---
name: follow-review
description: Gate ก่อนลงมือ action หลัก — ดูว่าใช้ review-* ตัวไหนได้บ้างตาม context แล้ว execute ก่อนทำงาน
argument-hint: "[action-or-context]"
related:
  - review
  - deep-review
  - review-quality
  - review-then-fix
  - follow-parallel
  - report-in-table
  - ask-me
---

## Goal

ใช้เป็น gate ก่อนลงมือ action หลัก (implement, refactor, ship, update) — ตอบคำถามว่า "context นี้ใช้ `review-*`/`check-*` ตัวไหนได้บ้าง" แล้ว execute reviews ที่เลือกก่อนทำงานหลัก

## Scope

ใช้เมื่อต้องการ pre-action review gate — เช่น ก่อน `/implement-to-production`, `/refactor`, `/ship` หรือ action เสี่ยงอื่น

- ถ้าต้องการ review แบบ standalone ครบวงจร → ใช้ `/review` (canonical router สำหรับเลือกและ execute `review-*`)
- skill นี้เน้น "ดูว่า review-* ตัวไหน applicable กับ context ที่จะทำ" แล้วรันแค่ที่จำเป็นก่อนลงมือ

## Execute

### 1. Detect Action And Context

> Goal: รู้ว่ากำลังจะทำ action อะไรกับ target อะไร

1. ระบุ action ที่จะทำ: implement, refactor, restructure, deploy, ship, update, rename, migrate
2. ระบุ target: code, docs, plan, database, API, UX/UI, dependencies, devin skills
3. ถ้าไม่ชัด → ทำ `/ask-me` (หรือ `/follow-your-suggestion` ถ้า session อยู่ใน `dont-ask-me` mode)

### 2. Map Applicable Reviews

> Goal: เลือก review-*/check-* ที่ตรง action + target

ใช้ตารางนี้เป็น baseline (อ้างอิง mapping เต็มจาก `/review`):

| No. | Action / Context | Reviews ที่ตรง |
|-----|------------------|----------------|
| 1 | ก่อน implement / productionize | `/review-implement`, `/review-implement-to-production` |
| 2 | ก่อน refactor | `/review-refactor`, `/review-architecture`, `/review-quality` |
| 3 | ก่อน restructure / move files | `/review-restructure`, `/review-references` |
| 4 | ก่อน ship / deploy / release | `/review-deploy`, `/review-release`, `/review-delivery` |
| 5 | ก่อน update docs / plan / config | `/review-docs`, `/review-plan`, `/review-update` |
| 6 | แตะ security-sensitive code | `/review-security`, `/review-compliance` |
| 7 | แตะ tests | `/review-test` |
| 8 | แตะ dependencies / tech stack | `/review-techstack`, `/review-dependencies` |
| 9 | แตะ UX/UI / frontend | `/review-uxui`, `/review-frontend` |
| 10 | ไม่ชัดหรือครอบหลายมิติ | `/deep-review`, `/review` |

1. เลือก primary 1-3 ตัวที่ตรงที่สุด — ห้ามรันทุก review-*
2. ตรวจว่า skills ที่เลือกมีอยู่จริง
3. ถ้าไม่มี review ที่ตรงเลย → report "ไม่มี `review-*` ที่เกี่ยวข้อง" แล้ว proceed ไป action หลัก

### 3. Execute Selected Reviews

> Goal: รัน reviews ที่เลือกก่อน action หลัก

1. ถ้า reviews independent → ทำ `/follow-parallel` (ไม่เกิน 10 ต่อ batch)
2. ถ้ามี dependency → รันตามลำดับ
3. บันทึก findings พร้อม severity จากแต่ละ review
4. ถ้า findings เป็น blocker → report และให้ action หลักตัดสินใจ ห้ามเงียบข้าม

### 4. Report And Hand Off

> Goal: ส่งต่อผลให้ action หลัก

1. ทำ `/report-in-table` คอลัมน์: No., Review, เหตุผลที่เลือก, Status, Findings
2. สรุปว่า gate ผ่านหรือมี blockers
3. proceed ไป action หลัก

## Rules

- เป็น pre-action gate: review แล้วส่ง findings กลับ — ไม่ fix เอง (fix เป็นหน้าที่ของ action หลัก หรือ `/review-then-fix`)
- เลือกน้อยที่สุดที่ครอบคลุม — ห้ามรัน `review-*` ทั้งหมดโดยไม่จำเป็น
- ถ้า `/review` กำลังทำงานใน flow เดียวกันอยู่แล้ว ไม่ต้องเรียกซ้ำ
- ทุก finding ต้องมี evidence (file, line, reference)
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-then-fix ถ้าจำเป็น

## Expected Outcome

- รู้ว่า `review-*`/`check-*` ตัวไหน applicable กับ context ที่จะทำ
- Reviews ที่เลือกถูก execute ก่อน action หลัก พร้อม findings + severity
- Action หลักเริ่มได้โดยรู้สถานะ quality/risk ชัดเจน
