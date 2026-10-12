---
name: restructure
description: Canonical structure refactor — จัด physical file/folder structure ให้ตรง architecture — naming, split, relocate, barrel imports (หนึ่งไฟล์ = หนึ่ง responsibility, หนึ่งโฟลเดอร์ = หนึ่ง domain)
argument-hint: "[@files... | path]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - grep
  - find_file_by_name
related:
  - refactor
  - refactor-to-srp
  - idea-naming
  - follow-architecture
  - create-plan-in-dot-devin
  - check-code-structure
  - check-long-files
  - deep-review
  - relocation
  - update-references
  - run-check
  - deep-validate
  - update-agents-md
  - report-before-after
---

## Goal

จัด physical file/folder structure ให้ตรง architecture — naming, split, relocate, barrel imports — หนึ่งไฟล์ = หนึ่ง responsibility, หนึ่งโฟลเดอร์ = หนึ่ง domain

## Scope

ใช้เมื่อปัญหาคือ physical layout (ชื่อ generic, ไฟล์ผิด folder, imports ซับซ้อน, barrel ไม่สม่ำเสมอ) — procedure ละเอียด `refactor/references/structure.md`; ถูก dispatch จาก `/refactor` (scope `structure`) และ `/follow-architecture` (align step)

- SRP split ของ unit เดียว → `/refactor-to-srp`; concerns ปนกัน → `/refactor` `### /separate-of-concerns` (merged)

## Execute

### 1. Scope And Baseline

> Goal: รู้ target และปัญหาก่อนแตะ

1. `@files`/target path; architecture ก่อนแตะ (`/follow-architecture`); scope กว้าง → `/create-plan-in-dot-devin`
2. Evidence ด้วย `/check-code-structure` + `/check-long-files` + `/deep-review` → ตาราง No./File/Problem/Target/severity — ไม่พบปัญหา → stop + report

### 2. Naming

> Goal: ชื่อไฟล์สื่อ domain

1. `/idea-naming` ทีละไฟล์ + `/update-references` ทันที
2. ชื่อ generic (`utils.ts`, `helpers.ts`, `misc.ts`) → แยกตาม concern หรือเปลี่ยนเป็นชื่อ domain

### 3. Split And Align

> Goal: ทุกไฟล์/โฟลเดอร์มี responsibility เดียว

1. >250 บรรทัด/หลาย responsibility → `/refactor-to-srp`
2. Content ประเภทเดียวรวมกัน (`types.ts`, `constants.ts`, `config.ts`, `schema.ts`)
3. **Grouping** — โฟลเดอร์ที่มีไฟล์เยอะเกินไป (~>10-15 ไฟล์ flat) → group เป็น subfolder ตาม domain/feature (เช่น `components/` → `components/{billing,auth,shared}/`); เกณฑ์ grouping = ไฟล์ที่เปลี่ยนด้วยกันเสมออยู่ด้วยกัน
4. Map ไฟล์ → layer/domain เป็นตารางก่อนย้าย — ห้าม mix pattern

### 4. Relocate

> Goal: ย้ายอย่างปลอดภัย

1. `/relocation` dry-run + confirm ก่อนย้ายจริงเสมอ
2. ย้ายทีละชุด + `/update-references` + `/run-check`; แดง → rollback

### 5. Imports

> Goal: import surface สะอาด

1. Public API ผ่าน barrel `index` เท่านั้น; alias แทน relative ซับซ้อน
2. Imports ตาม convention (external → alias → relative)

### 6. Validate And Sync

> Goal: layout ใหม่ verified และ documented

1. `/run-check` + tests + `/deep-validate` (fail → retry max 3 → stop)
2. Layout เปลี่ยน → `/update-agents-md`; `/report-before-after` structure + move table

## Rules

### 1. One File One Responsibility

- หนึ่งไฟล์ = หนึ่ง responsibility, หนึ่งโฟลเดอร์ = หนึ่ง domain — ห้าม mix pattern ใน target เดียว
- Naming ปรับผ่าน `/idea-naming` ทุกไฟล์ที่ touch; placement/เลือก layer ผ่าน `/follow-architecture` — ห้ามตัดสินใจเองถ้าไม่ชัด

### 2. Safe Moves

- Dry-run + confirm ก่อน relocate เสมอ; ย้ายทีละชุดพร้อม verify green ระหว่างชุด

### 3. Preserve API

- Barrel re-export คง import surface เดิม — consumer ไม่แตะ

- ใช้ /refactor เป็น entry point เมื่อ scope ยังไม่ชัด
- ใช้ /refactor-to-srp เมื่อปัญหาคือหลาย responsibility ใน unit เดียว

## Expected Outcome

- Structure ตรง architecture, naming สื่อ domain, imports ผ่าน barrel/alias
- ไม่มี broken refs, verify ผ่าน, AGENTS.md sync กับ layout ใหม่
