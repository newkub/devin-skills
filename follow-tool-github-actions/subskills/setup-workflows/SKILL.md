---
name: follow-tool-github-actions-setup-workflows
description: สร้าง workflow files ใน `.github/workflows/` — structure, triggers, jobs, permissions
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-dot-github
  - run-verify
---

## Goal

สร้าง workflow YAML files ใน `.github/workflows/` ให้ถูกต้อง — file structure, triggers, jobs, steps, permissions ตาม best practices

## Scope

ใช้เมื่อต้องเพิ่ม workflows ใหม่หรือแก้โครงสร้าง workflow — caching/matrix/performance tuning อยู่ใน `subskills/optimize-ci/SKILL.md`

## Execute

### 1. Inventory Existing Workflows

> Goal: รู้ว่ามี workflows อะไรอยู่แล้ว

1. อ่าน `.github/workflows/` ทั้งหมด — ระบุ workflows ที่มี, triggers, และ gaps
2. ระบุว่า CI base (`ci.yml` — lint, typecheck, test) มีหรือยัง — ทุก project ต้องมี
3. ทำ `/follow-dot-github` ถ้าต้องตรวจ `.github/` ทั้งหมด

### 2. Choose Workflows

> Goal: เลือก workflows ตามความต้องการ

- Base CI/CD: `ci.yml` (lint, typecheck, test) — ทุก project
- Security: `codeql.yml`, `dependabot.yml` — production
- Testing: `coverage.yml`, `e2e.yml` — quality assurance
- Deployment: workflows ตาม platform ที่ใช้จริง
- Monitoring: notify workflows — team notifications

### 3. Write Workflow Files

> Goal: เขียน workflow YAML ตาม best practices

1. กำหนด `name`, `on` triggers ให้ชัด — `push`/`pull_request` บน branches ที่ถูกต้อง, `workflow_dispatch` สำหรับ manual
2. ตั้ง `permissions` แบบ least-privilege — `contents: read` เป็น default, เพิ่มเฉพาะที่จำเป็น
3. ใช้ `actions/checkout` และ setup actions ที่ parent skill pin ไว้ — ดู version ล่าสุดที่ระบุใน parent `SKILL.md` หรือ official docs ห้ามเดา
4. ใช้ `concurrency` group เพื่อ cancel in-progress runs บน ref เดียวกัน
5. แยก CI และ CD workflows — ไม่รัน deploy บน pull request
6. จัด jobs: ตั้ง `runs-on`, `steps`, `needs` สำหรับ job dependencies, `if` conditions ที่ชัดเจน

### 4. Secrets And Tokens

> Goal: ตั้งค่า secrets อย่างปลอดภัย

1. ทำ `/follow-secret-manager` สำหรับ secrets ที่ workflows ต้องใช้ (`NPM_TOKEN`, deploy keys)
2. อ้างอิงผ่าน `${{ secrets.* }}` เท่านั้น — ห้าม hard-code
3. prefer OIDC/trusted publishing แทน long-lived tokens เมื่อ provider รองรับ

### 5. Validate

> Goal: ตรวจ syntax และ permissions ก่อน commit

1. รัน `actionlint` ตรวจทุก workflow file (`mise use -g actionlint` ถ้ายังไม่มี)
2. ตรวจ triggers — push ไป branch ที่ไม่ตั้งใจไม่ควร trigger
3. ถ้า syntax ผิด → แก้แล้ว lint ซ้ำจนผ่าน

## Rules

### 1. Structure

- หนึ่ง workflow ต่อไฟล์ ชื่อไฟล์สื่อหน้าที่ (`ci.yml`, `release.yml`)
- `permissions` แบบ least-privilege เสมอ
- pin action versions ตามที่ parent skill ระบุหรือ official docs — ไม่ใช้ `master`/`latest` floating refs

### 2. Triggers

- CI trigger บน `push`/`pull_request` ต่อ main branches
- deploy/release trigger เฉพาะ `push` ไป release branch หรือ tags — ห้ามรันบน PR

### 3. Secrets

- secrets ผ่าน `${{ secrets.* }}` และ `/follow-secret-manager` เท่านั้น

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /follow-dot-github ถ้าจำเป็น

## Expected Outcome

- Workflow files ถูกสร้างใน `.github/workflows/` ผ่าน `actionlint`
- Triggers และ permissions ถูกต้องตาม least-privilege
- CI base ครอบคลุม lint, typecheck, test
