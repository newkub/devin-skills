---
name: check-monorepo-boundaries
description: ตรวจ import ข้าม workspace boundary ใน monorepo ว่าผิดกฎ layering หรือ visibility
argument-hint: "[workspace-or-package]"
related:
  - follow-tool-madge
  - list-workspaces
  - check-circular-dependencies
  - report
---

## Goal

ตรวจ dependency direction ระหว่าง packages ใน monorepo — หา imports ที่ข้าม boundary ผิดกฎ เช่น app import จาก app, shared import จาก feature, หรือ bypass package entry point

## Scope

- ใช้กับ monorepo ที่ตรวจพบ (`pnpm-workspace.yaml`, `turbo.json`, `moon.yml`, `nx.json`, `lerna.json`)
- ตรวจ: cross-package imports, deep imports (`pkg/src/internal`), layer violations (app→app, infra→domain), circular workspace deps
- Read-only: รายงาน violations — ไม่แก้ imports

## Execute

### 1. Map Workspace Topology

> Goal: สร้างแผนผัง packages และกฎ boundary

1. ใช้ `/list-workspaces` หา packages ทั้งหมด
2. อ่าน workspace config (`pnpm-workspace.yaml`, `moon.yml`, `turbo.json`, `nx.json`) เพื่อดู declared deps
3. สร้าง layer map จาก convention เช่น `apps/*` → `packages/*` → `shared/*` หรือจาก tags/constraints ที่ project กำหนด

### 2. Scan Cross-Package Imports

> Goal: หา imports ทุกจุดที่ข้าม package boundary

1. ใช้ `use-astgrep` หรือ `search-files-patterns` ค้นหา import statements ที่ชี้ไป package อื่น
2. รวมทั้ง package-name imports (`@org/pkg`) และ relative imports ที่ข้าม boundary (`../../other-pkg/`)
3. ตรวจ deep imports: `pkg/src/...` หรือ subpath ที่ไม่ได้ export ผ่าน `package.json` exports

### 3. Evaluate Violations

> Goal: เทียบ imports กับกฎ boundary

1. flag imports ที่ package ไม่ได้ declare ใน `dependencies`/`devDependencies` (phantom deps)
2. flag imports ฝ้ายต่ำกว่าไปหาสูงกว่า (เช่น `shared` import จาก `features`)
3. flag app→app imports (apps ไม่ควรพึ่งกัน)
4. flag deep imports ที่ bypass public API ของ package
5. ใช้ `/check-circular-dependencies` และ `/follow-tool-madge` ตรวจ workspace-level cycles

### 4. Report

> Goal: รายงาน violations พร้อมแนวทางแก้

1. ใช้ `/report` คอลัมน์: `No.`, `Importer`, `Imported`, `Violation`, `Severity`, `Fix`
2. Severity: `critical` (circular, app→app), `high` (layer violation, phantom dep), `medium` (deep import)
3. แนะนำ fix เช่น ย้าย code ไป shared, declare dep, หรือ export ผ่าน entry point

## Rules

### 1. Evidence-Based

- ทุก violation ต้องมี file:line ของ import จริง
- ระบุกฎที่ละเมิดชัดเจน (declared deps, layer order, exports map)

### 2. Read-Only

- ไม่แก้ imports หรือ package.json — รายงานแล้วให้ `/refactor` หรือ `/update-config` แก้

### 3. Context Aware

- ถ้า project ไม่ได้กำหนด layer rules ไว้ → infer จาก convention และระบุว่าเป็น inferred rules
- dev/test imports (fixtures, test-utils) อาจยกเว้นได้ตาม convention ของ project

## Expected Outcome

- Workspace dependency graph พร้อม violations แยกตามประเภท
- รายการ phantom deps, layer violations, deep imports, cycles พร้อม severity
- คำแนะนำ fix ต่อ violation
