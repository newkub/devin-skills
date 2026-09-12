---
name: follow-monorepo-migrate-to-monorepo
description: ย้าย single repo ไปเป็น monorepo — workspace config, dep hoisting, git history
argument-hint: "[tool]"
related:
  - follow-monorepo
  - check-monorepo
  - check-monorepo-boundaries
  - plan
  - run-verify
  - resolve-errors
  - ask-me
---

## Goal

ย้าย single-package repo ไปเป็น monorepo อย่างปลอดภัย — workspace config ถูกต้อง, dependencies hoist ได้, git history ไม่หาย และ rollback ได้

## Scope

- ใช้เมื่อต้องแยก repo เดียวออกเป็น `apps/*`, `packages/*` หรือรวมหลาย repos เข้าด้วยกัน
- รองรับ bun/npm/pnpm workspaces และ task orchestrators (moon, turbo)
- ไม่ครอบคลุมการ config workspaces บน monorepo ที่มีอยู่แล้ว — ใช้ `subskills/config-workspaces/SKILL.md`

## Execute

### 1. Plan Layout And Tool

> Goal: กำหนดโครงสร้างและ tool ก่อนขยับไฟล์

1. ทำ `/plan` — ระบุ target layout (`apps/`, `packages/`, `tools/`) และ package manager + orchestrator ที่จะใช้
2. เลือก tool ตาม ecosystem ที่มีอยู่ — bun, pnpm, npm, moon, turbo — ดู official docs ถ้าไม่แน่ใจ
3. map ทุก top-level directory/config ว่าจะไปอยู่ที่ไหน หรือคงไว้ที่ root

### 2. Preserve Git History

> Goal: ไม่เสีย history ระหว่างย้าย

1. ย้ายไฟล์ด้วย `git mv` เสมอ — ห้าม copy-delete
2. ถ้ารวมหลาย repos → ใช้ `git subtree` หรือ merge ด้วย `--allow-unrelated-histories` เพื่อเก็บ history ของแต่ละ repo — ดู official git docs
3. แยก commit "ย้ายไฟล์" ออกจาก commit "แก้ config" เพื่อให้ rename detection ทำงาน

### 3. Setup Workspaces

> Goal: workspace config ทำงานและ install ผ่าน

1. สร้าง workspace config ตาม tool — `package.json#workspaces` (bun/npm), `pnpm-workspace.yaml` (pnpm)
2. ย้าย shared devDependencies ขึ้น root, package ลูกใช้ `workspace:*` (pnpm/bun) สำหรับ internal deps
3. ตรวจ dep hoisting — external deps ที่ซ้ำหลาย packages ให้ version เดียวกัน หรือใช้ catalogs ถ้า tool รองรับ
4. `install` แล้วตรวจ lockfile ไม่มี conflicts

### 4. Verify

> Goal: monorepo ใช้งานได้เหมือนเดิม

1. ทำ `/run-verify` — build, typecheck, lint, test ผ่านทุก workspace
2. ทำ `/check-monorepo-boundaries` เพื่อยืนยันไม่มี cross-import ผิด boundary
3. ถ้า fail → `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ต้อง `/plan` และ user confirm ก่อนย้าย — migration เป็น high-impact change
- แยก commit ต่อ step: move → workspace config → dep dedupe → verify ให้ bisect ได้
- ห้ามลบ repo/config เดิมจนกว่า verify จะผ่าน — เก็บ rollback path
- internal deps ใช้ workspace protocol ไม่ใช่ published versions
- CI, scripts, docs ที่อ้าง path เดิมต้องอัปเดตตาม — ทำ `/update-references`

## Expected Outcome

- repo เป็น monorepo ที่ install/build/test ผ่านครบ
- git history ถูก preserve, deps ไม่ duplicate
- commit history แยกตาม step ทำให้ rollback ได้
