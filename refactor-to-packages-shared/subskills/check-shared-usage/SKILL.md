---
name: refactor-to-packages-shared-check-shared-usage
description: ตรวจว่าทุกไฟล์ใน packages/shared มี external reference อย่างน้อย 1 จุด — ไฟล์ที่ไม่มี consumer ไม่ควรอยู่ใน shared
argument-hint: "[--fix]"
related:
  - refactor-to-packages-shared
  - check-repo-hygiene
  - scan-codebase
  - update-references
  - report
  - ask-me
  - delete
---

## Goal

Audit ทุกไฟล์ใน `packages/shared` (หรือ shared package ที่ระบุ) — ไฟล์ใดก็ตามต้องมี reference จริงอย่างน้อย 1 จุดจาก workspace member อื่น ถ้าไม่มี consumer ภายนอกเลย ไฟล์นั้นไม่ควรอยู่ใน shared และต้อง report/move out

## Scope

- Target: `packages/shared/src/**` (หรือ shared package ตาม workspace convention)
- Reference ที่นับ = import/require/re-export จาก workspace อื่น (`apps/*`, `packages/*` อื่น, `tools/*`) เท่านั้น
- ไม่นับ: internal imports ภายใน shared เอง, docs/comments, config references ที่ไม่ใช่ code consumer
- ใช้ร่วมกับ `/refactor-to-packages-shared` — รันหลัง inventory (ก่อน extract) และหลัง rewire (ก่อนลบ local copies)

## Execute

### 1. Inventory Shared Files

> Goal: ได้รายการไฟล์ใน shared ทั้งหมดที่ต้อง audit

1. list ไฟล์ทั้งหมดใน `packages/shared/src/` (ข้าม `node_modules`, dist, `*.d.ts` ที่ generate)
2. อ่าน `package.json` `exports` map และ barrel `index.ts` — map entry points → files ที่ reachable
3. แยกกลุ่ม: `entrypoints` (ไฟล์ที่อยู่ใน export map/barrel chain), `source` (implementation files), `tests` (`*.test.*`, `*.spec.*`, `__tests__/`), `config`

### 2. Build Reference Graph

> Goal: รู้ว่าใคร reference ไฟล์ไหนจากภายนอก

1. หา external consumers ของ package — `rg "@wrikka/shared"` หรือ alias/import path ตาม convention ของ project ใน `apps/`, `packages/` อื่น, `tools/`
2. resolve แต่ละ external import → symbol → source file ใน shared (ผ่าน barrel chain: entry → domain barrel → file)
3. หา internal references แยก — import ระหว่างไฟล์ภายใน shared (ใช้ classify เท่านั้น ไม่นับเป็น consumer)
4. ข้าม references ที่ไม่ใช่ code consumer: markdown/docs, comments, string literals ใน config, test fixtures

### 3. Classify Each File

> Goal: ทุกไฟล์ได้ status ชัดเจน

1. `used` — มี ≥1 external workspace reference ที่ resolve ถึงไฟล์นี้ (โดยตรงหรือผ่าน barrel)
2. `internal-only` — ถูก reference เฉพาะภายใน shared เอง ไม่มี external consumer
3. `unused` — ไม่มี reference เลยจากทุกที่ (orphan)
4. `entrypoint` — barrel/export-map file ที่เป็นสะพานให้ไฟล์อื่น — เก็บไว้ได้ถ้ามีไฟล์ downstream ที่ `used`
5. `blocked` — resolve ไม่ได้ (dynamic import, generated code) — flag ให้ตรวจ manual

### 4. Report

> Goal: สรุปผลและ action ต่อไฟล์

1. ทำ `/report` table คอลัมน์: `No.`, `File`, `Refs`, `Consumers`, `Status`, `Action`
2. Action mapping: `used` → keep; `entrypoint` → keep (ถ้า serve used files); `internal-only` → ตรวจว่าเป็น helper ของ used file จริงหรือไม่ ถ้าไม่ → move out; `unused` → ข้างนอก shared หรือ delete (confirm ก่อน); `blocked` → manual review
3. สรุป counts: total files, used, internal-only, unused, blocked
4. ถ้ามี `--fix` → ย้าย `unused`/`internal-only` ที่ไม่ใช่ helper ออกจาก shared แล้วทำ `/update-references` — ยืนยันกับ `/ask-me` ก่อนลบไฟล์

## Rules

### 1. At Least One External Reference

- ทุกไฟล์ใน shared ต้องมี ≥1 reference จาก workspace member อื่น — internal-only ไม่นับ
- Barrel/entrypoint ยกเว้นได้เฉพาะเมื่อมัน serve ไฟล์ที่ `used` — empty barrel ต้องถูก flag

### 2. No Speculative Retention

- ห้ามเก็บไฟล์ใน shared "เผื่อใช้ภายหลัง" — ไม่มี consumer วันนี้ = ไม่อยู่ใน shared วันนี้
- Helper ภายใน (เช่น internal util ที่ใช้กันเอง) อยู่ได้ก็ต่อเมื่อไฟล์ที่เรียกมัน `used` — ต้อง trace ถึง leaf

### 3. Confirm Before Mutate

- รายงานก่อนแก้ — `--fix` ต้อง `/ask-me` confirm ก่อน move/delete เสมอ
- ห้ามลบไฟล์ที่ยังมี test reference หรือ config reference โดยไม่ตรวจ manual

## Expected Outcome

- ได้ reference graph ครบของทุกไฟล์ใน shared พร้อม status
- ไฟล์ที่ไม่มี external consumer ถูกระบุชัดเจนพร้อม recommended action
- ไม่มีไฟล์ "อยู่เผื่อ" ใน shared หลัง apply fix
