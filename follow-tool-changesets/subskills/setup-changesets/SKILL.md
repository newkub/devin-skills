---
name: follow-tool-changesets-setup-changesets
description: ติดตั้ง Changesets, init `.changeset/` และตั้งค่า version/publish flow ครั้งแรก
argument-hint: "[scope]"
related:
  - setup-cicd
  - run-release
  - follow-secret-manager
---

## Goal

ติดตั้ง `@changesets/cli`, init `.changeset/` directory และตั้งค่า changeset → version → publish workflow ให้พร้อมใช้งาน — first-time setup

## Scope

ใช้สำหรับ monorepo/workspace ที่ต้องการเริ่มใช้ Changesets — install, init, changeset flow, release workflow. รายละเอียด config keys อยู่ใน `subskills/config-changesets/SKILL.md`

- ถ้า `.changeset/` มีอยู่แล้ว → verify เท่านั้น

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ state ก่อน setup

1. ตรวจว่ามี `.changeset/` directory และ `@changesets/cli` ใน devDependencies อยู่แล้วหรือไม่ — ถ้ามี → skip ไป verify
2. ตรวจว่า project เป็น monorepo (workspaces ใน root `package.json`) หรือ single package — Changesets รองรับทั้งสอง
3. ระบุ package manager จาก lockfile

### 2. Install And Init

> Goal: ติดตั้ง CLI และ init config

1. รัน `bun add -D @changesets/cli` (หรือ package manager ของ project)
2. รัน `bunx changeset init` — สร้าง `.changeset/` พร้อม `config.json` และ `README.md`
3. ยืนยันด้วย `bunx changeset --version`

### 3. Changeset Flow

> Goal: ตั้งค่า flow การสร้าง changeset

1. รัน `bunx changeset` เพื่อสร้าง changeset file — เลือก packages, bump type (`major`/`minor`/`patch`), เขียน description สำหรับ changelog
2. commit changeset files (`.changeset/*.md`) เข้า repo พร้อม code changes
3. ตรวจว่า contributors เข้าใจ flow — document ใน CONTRIBUTING/README ถ้าจำเป็น

### 4. Version And Publish Commands

> Goal: ตั้งค่า scripts สำหรับ release

1. เพิ่ม scripts ใน root `package.json`: `"version-packages": "changeset version"`, `"release": "changeset publish"`
2. `changeset version` — consume changesets → bump versions + update CHANGELOGs + ลบ changeset files
3. `changeset publish` — publish packages ไป registry ตาม versions ใหม่
4. ตั้ง GitHub Actions release workflow ด้วย `changesets/action` — version ตามที่ parent skill pin ไว้, pair กับ CLI major version ที่ถูกต้อง
5. ใช้ `/follow-secret-manager` ตั้ง `GITHUB_TOKEN` และ `NPM_TOKEN` เป็น secrets — ห้าม hard-code

### 5. Verify

> Goal: ยืนยัน flow ทำงาน

1. สร้าง changeset ทดสอบ → รัน `bunx changeset status` ตรวจ pending changesets
2. รัน `bunx changeset version` บน test branch ดู version bump (revert หลังตรวจ)
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Idempotent

- ถ้า `.changeset/` มีอยู่แล้ว → verify เท่านั้น ห้าม `init` ซ้ำ

### 2. Flow Discipline

- ทุก PR ที่เปลี่ยน published package ต้องมี changeset file
- `version` → review generated CHANGELOGs ก่อน commit; `publish` รันใน CI หลัง merge เท่านั้น

### 3. Secrets

- `NPM_TOKEN`/`GITHUB_TOKEN` ผ่าน secrets เท่านั้น

- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น

## Expected Outcome

- `@changesets/cli` ติดตั้งและ `.changeset/` ถูก init
- Changeset → version → publish flow พร้อมใช้
- Release workflow ตั้งค่า secrets ถูกต้อง
