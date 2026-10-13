---
name: refactor-to-srp
description: Canonical SRP splitter — แยก unit (ไฟล์, module, class, function) ที่มีหลาย responsibility ให้ 1 unit = 1 reason to change, ไฟล์ ≤250 บรรทัด
argument-hint: "[@files...]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - grep
  - find_file_by_name
related:
  - refactor
  - restructure
  - check-long-files
  - check-code-structure
  - deep-review
  - update-references
  - update-tests
  - resolve-errors
  - run-verify
  - git-commit
  - report-before-after
  - dont-over-engineer
  - follow-single-of-source
---

## Goal

แยก unit (ไฟล์, module, class, function) ที่มีหลาย responsibility ให้ **1 unit = 1 reason to change** — บังคับหลังทุกงานสร้าง/อัปเดต ตาม global rules (ไฟล์ ≤250 บรรทัด ยกเว้น barrel/index)

## Scope

ใช้เมื่อไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues — ถูก dispatch จาก `/refactor` (scope detect) และ callers อื่น (implement-to-production, review-issue, `/refactor` coverage scopes); สกัดกั้นด้วย `/dont-over-engineer` เมื่อไม่มี violation จริง

- Physical restructure (naming/relocate/barrel) → `/restructure`
- Mixed concerns (UI+logic+IO ปนกัน) → `/refactor` `### /separate-of-concerns` (merged)

## Execute

### 1. Identify

> Goal: รู้ว่า unit มีกี่ responsibilities

1. List responsibilities + smells (Divergent Change, Shotgun Surgery, Long Method — `refactor/references/code-smells.md`)
2. Baseline ด้วย `/deep-review` + `/check-long-files` + `/check-code-structure`
3. จัดกลุ่มตาม reason to change — ไม่มี violation จริง → stop + report (`/dont-over-engineer`)

### 2. Split

> Goal: ทีละ responsibility เดียว

1. Extract Method → Extract Class/Module → Move Method/Field
2. Content ประเภทเดียวรวมกัน (`types.ts`, `constants.ts`, `config.ts`, `schema.ts` หรือตามชื่อ domain)
3. คง public API ผ่าน barrel re-export — consumer ไม่เปลี่ยน import surface
4. หลายไฟล์อิสระ → `refactor` profile `file-worker` (`refactor/SKILL.md ## Subagents`) ขนาน
5. `/git-commit` ทุก batch (1 split = 1 concern ไม่ mix behavior)

### 3. References

> Goal: ไม่มี refs เก่าหลงเหลือ

1. `/update-references` ทุก split — rewire importers + ค้น refs เก่าไม่ให้เหลือ
2. broken → `/resolve-errors`

### 4. Verify

> Goal: ผ่านเกณฑ์เทียบ baseline

1. `/run-verify` + `/check-long-files` + `/check-code-structure` เทียบ baseline — ทุกไฟล์ ≤250 บรรทัด
2. ไม่ผ่าน → กลับ step 2 (max 3 รอบ)
3. `/report-before-after` responsibility map + file/line counts

## Rules

### 1. One Reason To Change

- 1 unit = 1 reason to change; canonical source เดียวต่อ fact (`/follow-single-of-source`)

### 2. Safety

- ไม่มี tests → characterization tests ก่อน (`/update-tests`)
- Preserve behavior/public API เสมอ (Two Hats — ห้าม mix behavior change)

### 3. Minimal Split

- Cohesion สูงที่เปลี่ยนด้วยกันเสมอ อย่าแยก — split เท่าที่จำเป็น

- ใช้ /refactor เป็น entry point เมื่อ scope ยังไม่ชัด
- ใช้ /restructure เมื่อปัญหาคือ physical layout ไม่ใช่ responsibilities

## Expected Outcome

- ทุก unit มี 1 reason to change, ทุกไฟล์ ≤250 บรรทัด
- Public API เหมือนเดิม, ไม่มี broken refs, verify ผ่าน
