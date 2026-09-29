---
name: review-alignment
description: ตรวจ cross-layer alignment — code↔docs↔tests↔config↔API contracts อ้างกันถูก ไม่ drift — report-only
argument-hint: "[scope]"
related:
  - review
  - update-references
  - review-api
  - update-devin-harness
  - align-devin-layers
  - report
  - use-subagents
---

## Goal

ตรวจว่า layers ของระบบอ้างกันถูกต้องและ sync กัน — code↔tests↔docs↔config↔public API↔harness (rules/skills/subagents) — หา drift, broken contracts, stale references; report-only

## Scope

- Alignment pairs: `code↔tests` (coverage ของ public surface), `code↔docs` (README/USAGE ตรง implementation), `code↔config` (env vars, defaults), `API↔contract` (exported signatures vs docs/clients), `harness layers` (global_rules↔skills↔subagents↔hooks↔MCP)
- report-only — fix ทำผ่าน `/update-references`, `/update-devin-harness` (alias `/align-devin-layers`), `/update-docs` หลัง confirm

## Execute

### 1. Inventory Pairs

> Goal: ระบุ layer pairs ที่ต้องเทียบใน scope

1. ระบุ layers ที่มีจริงใน scope — code, tests, docs, config, API surface, harness (rules/skills/subagents)
2. สร้าง pair matrix: layer A อ้าง layer B ด้วยอะไร (imports, references, names, paths, contracts)

### 2. Check Alignment

> Goal: หา drift แต่ละ pair พร้อม evidence

1. `code↔tests`: exported functions ไม่มี test; test อ้าง symbols ที่ไม่มีแล้ว
2. `code↔docs`: docs อ้าง API/command/flag ที่ไม่มีจริง; features ที่ docs ไม่ได้บอก
3. `code↔config`: env vars ที่ code อ่านแต่ config/example ไม่มี (และกลับกัน); defaults ไม่ตรง
4. `API↔contract`: semver/docs contract vs exported surface — ใช้ `/review-api`
5. `harness`: `global_rules.md` อ้าง skills ที่มีจริง; skill `related` ↔ reverse สมมาตร; subagent profiles ↔ `agents/`; `AGENTS.md` ↔ actual dirs
6. ทุก finding ระบุ: pair, direction (A→B broken หรือ B→A stale), evidence (paths+lines)

### 3. Score And Report

> Goal: severity ตาม blast radius + report

1. severity: Critical = broken contract/runtime error / High = stale public API docs / Medium = drift ภายใน / Low = cosmetic mismatch
2. ทำ `/report` ตาราง: `No.`, `Layer A`, `Layer B`, `Direction`, `Finding`, `Severity`, `Evidence`, `Fix Skill`
3. Fix skill mapping: refs → `/update-references`, docs → `/update-docs`, harness layers → `/update-devin-harness` (alias `/align-devin-layers`), contracts → `/review-api` follow-up

## Rules

### 1. Report Only

- ห้ามแก้ references/docs/config ใน review pass — fix หลัง confirm ผ่าน skill ที่ตรง domain

### 2. Bidirectional Check

- ทุก pair ตรวจ 2 ทิศ — A อ้าง B (broken ref) และ B ไม่รู้จัก A (stale/orphan)
- finding เดียวกันใน 2 pairs ให้รายงานครั้งเดียวที่ root cause

### 3. Evidence Based

- ทุก finding ต้องมี paths+lines ทั้งสองฝั่งของ pair
- แยก "ไม่มี reference" (gap) จาก "reference พัง" (drift) — ต่าง severity

- ใช้ /update-references ถ้าจำเป็น
- ใช้ /update-devin-harness ถ้าจำเป็น
- ใช้ /review-api ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- Alignment matrix ครบทุก pair ที่มีใน scope
- Findings พร้อม direction, severity, evidence ทั้งสองฝั่ง
- Fix mapping ชัดต่อ finding — ไม่มี unresolved drift ที่ไม่ระบุ
