---
name: refactor-skills
description: Refactor skill packages ตาม update-devin-global-skills — split, merge, subskills, naming
argument-hint: "[skill | family-prefix | all]"
related:
  - update-devin-global-skills
  - refactor
  - simplify
  - new-skills
  - use-subagents
  - use-related-skills
  - check-long-files
  - deep-validate
  - update-references
  - report
  - suggest-next-action

---

## Goal

Refactor skill packages ใน `%APPDATA%\devin\skills` ให้ SRP ชัดเจนและผ่านมาตรฐาน repo — split, reclassify, merge, fix metadata, sync references

## Scope

Restructure skill ที่มีอยู่ — skill เดียว, family (`follow-lib-*`, `review-*`) หรือ `all` — ไม่รวม: สร้างใหม่ → `/new-skills`, update content → `/update-devin-global-skills`, project code → `/refactor`

## Execute

### 1. Detect Violations

> Goal: รู้ว่า refactor skill ใด และ violation คืออะไร

1. `<skill>` → target เดียว; family prefix หรือ `all` → list ทุก skill ที่ตรง
2. เก็บ baseline ต่อ skill:

   | No. | Violation | Detect |
   |-----|-----------|--------|
   | 1 | ไฟล์เกิน 250 บรรทัด | `/check-long-files` |
   | 2 | หลาย responsibility | อ่าน `## Execute` — นับ workflow ที่ต่าง goal |
   | 3 | workflow อยู่ใน `references/` | เทียบ decision matrix (step 2) |
   | 4 | เนื้อหาซ้ำ skill อื่น | `/use-related-skills` + grep title/description |
   | 5 | `references/` ไม่ flat | list dir |
   | 6 | frontmatter ผิด | `name` ≠ dir, `description` >100 |
   | 7 | `related` dangling | `/deep-validate` |

### 2. Plan

> Goal: เลือก fix ต่อ violation จาก conventions — ไม่ ad hoc

1. อ่าน `update-devin-global-skills` `## Conventions` — `When To Split` (violation → fix) และ `Subskills And Subagents` (decision matrix + consolidation)
2. สรุป skill → violation → action → target — report ก่อนแก้ถ้า scope >3 skills
3. Merge top-level skills → `git mv` เข้า `parent/subskills/<domain>/`, parent เป็น dispatcher, bulk-update callers ก่อนลบ dir เดิม

### 3. Apply

> Goal: แก้ตาม plan โดยไม่เสีย content

| Action | How |
|--------|-----|
| Split | เนื้อหาละเอียด → `references/<topic>.md`; SKILL.md เหลือ workflow + pointer |
| Reclassify | workflow ↔ `subskills/<name>/` (`name: <parent>-<name>`), knowledge ↔ `references/` |
| Merge | รวมเนื้อหาซ้ำเข้าที่เดียว |
| Metadata | `name` = dir, `description` ≤100, `related` resolve ได้ |
| Simplify | ย่อ prose ที่ verbose → `/simplify` |
| Flatten | `references/` ไม่มี nested dirs |

ใช้ `git mv` ทุกการย้ายเพื่อเก็บ history

### 4. Dispatch Bulk Work

> Goal: family-wide refactor ทำขนานโดยไม่ชนกัน

Scope >3 skills อิสระกัน → spawn `skill-updater` subagent ทีละ skill ผ่าน `/use-subagents` — แก้เฉพาะ dir ตัวเอง; skills ที่แตะ shared files (`AGENTS.md`, `global_rules.md`) ทำ sequential ห้าม spawn

### 5. Sync And Validate

> Goal: ไม่มี stale refs ผ่าน conventions

`/update-references` → sync living docs (`AGENTS.md` count + `related:`) → `/deep-validate`

### 6. Report

> Goal: สรุปการเปลี่ยนแปลงและผลตรวจ

`/report` (skill → violation → action → result + รายการที่ข้าม) → `/suggest-next-action`

## Rules

### 1. Convention Authority

- มาตรฐานอยู่ที่ `/update-devin-global-skills` references — point ไปอ่าน ห้ามเขียนซ้ำ
- prefix contract (`check-*`/`review-*`/`deep-*`, lifecycle prefixes) ตาม `new-skills` — ห้าม refactor จนขาด
- ห้ามสร้าง `subskills/fix-*/` หรือ `references/fix-*.md` — fix อยู่ใน `## Fix`

### 2. No Content Loss

- ย้าย/แยกต้อง preserve เนื้อหา — ลบเฉพาะ duplicate จริง; destructive → dry run + confirm

### 3. Minimal Diff

- แก้เฉพาะ violation ที่ detect ได้ — ไม่ rewrite ของที่ผ่านอยู่แล้ว
- ไม่เปลี่ยน semantic ของ workflow (Two Hats เหมือน code refactor)

### 4. Deterministic Output

- ทุก violation ต้องมี evidence ก่อนแก้ — ห้ามเดา
- report บอก verify result จริง — ห้ามอ้างว่าผ่านถ้ายังไม่รัน

## Expected Outcome

- ไฟล์ ≤250 บรรทัด SRP ชัดเจน; `references/` flat, `subskills/` = invocable workflows, `subagents/` = profiles
- ไม่มี content ซ้ำ, stale refs หรือ dangling `related`; `AGENTS.md` + living docs sync
- ผ่าน `/deep-validate` พร้อมรายงาน before/after
