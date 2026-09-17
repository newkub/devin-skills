---
name: follow-reusable
description: Reuse code ที่มีอยู่ก่อนเขียนใหม่ — ค้นหา ใช้ซ้ำ หรือ extract shared implementation (DRY)
argument-hint: "[feature-or-code-need]"
related:
  - refactor
  - use-lib-effective
  - follow-single-of-source
  - search-similar
  - search-files-patterns
  - search-by-astgrep
  - use-astgrep
  - follow-tool-jscpd
  - check-file-relations
  - generalize
  - dont-over-engineer
  - ask-me
---

## Goal

ก่อนเขียน function/component/module ใหม่ ให้ค้นหาและ reuse implementation ที่มีอยู่ใน codebase ก่อนเสมอ — ลด duplication (DRY) รักษา consistency และลด maintenance surface

## Scope

ใช้เมื่อ task กำลังจะเขียน code ใหม่หรือ refactor — caller หลัก: `/refactor`, `/implement-to-production`, งาน implement ทั่วไป:

- เขียน function, component, hook, util, type หรือ module ใหม่
- พบ code ซ้ำซ้อน (copy-paste, near-duplicate) ระหว่าง refactor
- ต้องตัดสินใจว่าจะ reuse, extend, extract หรือสร้างใหม่

ขอบเขตเทียบกับ skills ใกล้เคียง — skill นี้ครอบคลุม **internal code reuse** เท่านั้น:

- reuse dependencies/packages ภายนอก → `/use-lib-effective`
- dedup data/config/docs facts → `/follow-single-of-source`
- ค้นหา skill/pattern ที่คล้ายกัน → `/search-similar`

## Execute

### 1. Search Before Write

> Goal: รู้ว่า codebase มี implementation ที่ทำสิ่งเดียวกันอยู่แล้วหรือไม่

1. ค้นด้วย keyword/symbol — `rg` หรือ `/search-files-patterns` ตามชื่อ function, concept, domain term
2. ค้น structural — `/search-by-astgrep` เมื่อชื่อต่างแต่ logic เหมือนกัน (pattern เดียวกัน ต่างแค่ชื่อ/ค่า)
3. สำรวจ shared locations — `utils/`, `shared/`, `common/`, `lib/`, `hooks/`, `components/`, และ internal packages (`packages/*`, `@org/*` ใน monorepo)
4. ตรวจ exports และ consumers ของ candidate ด้วย `/check-file-relations` เพื่อยืนยันว่า reusable จริง

### 2. Detect Duplication

> Goal: หา near-duplicate ที่ควร consolidate

1. รัน `jscpd` (`/follow-tool-jscpd`) หา copy-paste blocks ใน scope
2. จำแนก candidates — identical / near-duplicate (ต่างนิดหน่อย) / ต่าง domain แต่ pattern เดียวกัน
3. ถ้าไม่มีของเดิมเลย → ข้ามไป step 3 ข้อ 4

### 3. Choose Reuse Strategy

> Goal: เลือกวิธี reuse ที่เหมาะสม — reuse > extend > extract > create

1. **Direct reuse** — import/compose implementation เดิมตรงๆ เมื่อ signature ตรง use case
2. **Extend** — เพิ่ม parameter/option หรือ compose ให้ของเดิมครอบ use case ใหม่ — ห้าม fork/copy แล้วแก้
3. **Extract** — ถ้า logic เดียวกันกระจาย ≥3 จุด (rule of three) → extract ไป canonical location เดียวตาม `/follow-single-of-source`
4. **Create new** — เฉพาะเมื่อไม่มีของเดิมจริง หรือ forcing reuse ทำ coupling ผิด domain — ต้อง justify ใน report

### 4. Apply And Wire

> Goal: reuse ทำงานจริงและไม่มี copies ค้าง

1. import จาก canonical path ของ codebase ตาม existing import style
2. แทน duplicated blocks ด้วย shared implementation — อัปเดตทุก call site ที่เจอใน step 2
3. ทำ `/update-references` เมื่อย้ายหรือเปลี่ยน location ของ implementation
4. ถ้า pattern ที่ extract ใช้ซ้ำได้ข้าม context → บันทึกผ่าน `/generalize` เมื่อจำเป็น

### 5. Verify And Report

> Goal: behavior เดิม ไม่มี regression

1. ทำ `/run-verify` — lint, typecheck, tests ต้องเขียวเหมือนเดิม
2. report ระบุ reuse decision ทุกจุด: reused `<symbol>` (แทนเขียนใหม่), extracted `<path>`, dedup findings พร้อม file:line

## Rules

- ลำดับบังคับ: **reuse > extend > extract > create** — create เป็น last resort พร้อม justification ใน report
- Rule of three — ซ้ำ 2 จุดยัง tolerate ได้; ซ้ำ ≥3 จุดต้อง extract
- Reuse ต้อง same domain — ห้าม couple code ข้าม domain เพียงเพราะหน้าตาเหมือนกัน (coincidental duplication)
- Preserve behavior — consolidation คือ refactor ห้ามเปลี่ยน observable behavior
- ห้าม over-abstract — abstraction ต้องมี consumers จริง ไม่สร้างเผื่ออนาคต (`/dont-over-engineer`)
- Match existing patterns — reuse ผ่าน mechanism เดียวกับที่ codebase ใช้ (import style, DI, composition)
- เมื่อ refactor พบ duplicates → ระบุใน report พร้อม file:line
- ใช้ `/use-lib-effective` ถ้าจำเป็น
- ใช้ `/follow-single-of-source` ถ้าจำเป็น
- ใช้ `/search-similar` ถ้าจำเป็น
- ใช้ `/ask-me` ถ้าจำเป็น

## Expected Outcome

- ไม่มี code ใหม่ที่ duplicate implementation เดิมใน codebase
- duplicates ที่พบถูก consolidate ไป canonical source เดียว
- ทุก reuse decision (reuse/extend/extract/create) มีเหตุผลระบุใน report
- ผ่าน verify ไม่มี regression
