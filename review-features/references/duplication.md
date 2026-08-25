---
title: No Duplication Checks
description: ตรวจไม่มี duplicated docs ใน workspaces และ .devin/features/
related:
  - review-features
  - update-docs
---

## Goal

ตรวจว่าไม่มี duplicated docs ในแต่ละ workspace และไม่มี `.devin/features/` directory

## Scope

ใช้ใน Execute step "Check No Duplication" ของ `review-features` — ตรวจ duplication เท่านั้น ไม่ตรวจ format หรือ coverage

## Checks

### 1. No Docs In Each Workspace

1. ตรวจว่าไม่มี `docs/` directory ในแต่ละ workspace ของ monorepo
2. ถ้าเป็น monorepo ให้ตรวจทุก workspace ใน workspace list
3. docs ควรรวมอยู่ที่ root `docs/` เท่านั้น
4. ถ้าพบ `docs/` ใน workspace → flag เป็น `High` และ delegate การแก้ไขให้ `update-docs`

### 2. No .devin/features/ Directory

1. ตรวจว่าไม่มี `.devin/features/` directory ใน project
2. features documentation ควรอยู่ที่ `docs/project/features.md` เท่านั้น
3. ถ้าพบ `.devin/features/` → flag เป็น `High`

### 3. No Duplicate Docs Across Workspaces

1. ตรวจว่าไม่มี features docs ซ้ำในแต่ละ workspace
2. ตรวจไฟล์ที่ชื่อคล้าย `features.md` ในหลายที่
3. ถ้าพบ duplicate → flag เป็น `Medium` และ delegate การแก้ไขให้ `update-docs`

## Validation Steps

1. รวบรวม workspace list จาก Prepare Context step
2. ตรวจแต่ละ workspace ว่ามี `docs/` directory หรือไม่
3. ตรวจ root project ว่ามี `.devin/features/` directory หรือไม่
4. ค้นหาไฟล์ `features.md` ทั้ง project เพื่อตรวจ duplicate
5. บันทึก findings พร้อม file path และ evidence

## Severity Mapping

- `High`: พบ `docs/` ใน workspace, พบ `.devin/features/` directory
- `Medium`: พบ duplicate `features.md` ในหลายที่
- `Low`: พบ stale docs ที่ไม่ใช่ features

## Expected Outcome

- ยืนยันไม่มี duplicated docs ใน workspaces และไม่มี `.devin/features/`
- รายงาน findings พร้อม severity และ evidence
- Delegate การแก้ไขให้ `update-docs` ถ้าพบปัญหา
