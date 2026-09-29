---
name: update-config-update-shared-config
description: รวม duplicate config/dependencies ข้าม workspaces ไป shared config หรือ catalog
argument-hint: "[scope]"
related:
  - update-config
  - refactor-to-packages-shared
  - follow-monorepo
  - follow-config
  - check-config-drift
  - review-config
  - update-references
  - run-typecheck
---

## Goal

รวม tool config และ dependency versions ที่ซ้ำกันข้าม workspaces ไปไว้ที่ shared config หรือ catalog จุดเดียว — หนึ่ง fact หนึ่ง source — แล้วให้แต่ละ workspace อ้างอิงกลับผ่าน `extends`/`catalog:`

## Scope

- ใช้เมื่อ config เดียวกัน (`tsconfig`, `eslint`, `prettier`, `vitest`, build config) ถูก duplicate ใน 2+ workspaces
- ใช้เมื่อ dependency version เดียวกันกระจายใน package manifests หลายตัว
- สำหรับ shared code (utils, types, components) ที่ duplicate ข้าม packages → `/refactor-to-packages-shared` แทน
- สำหรับ env vars → `subskills/config-env/SKILL.md` แทน

## Execute

### 1. Find Duplicate Config

> Goal: รู้ว่า config ไหนซ้ำจริงและคุ้มรวม

1. ทำ `/check-config-drift` — หา config ที่ซ้ำหรือ drift ข้าม workspaces
2. เทียบ config ต่อ domain: `tsconfig*.json`, `eslint.config.*`, `prettier.config.*`, `vitest.config.*`, build configs
3. เทียบ dependency versions ข้าม package manifests — หา version drift และ duplicates
4. เก็บ candidates เฉพาะที่ซ้ำจริงใน 2+ workspaces — ห้ามรวมเผื่อ

### 2. Extract To Shared

> Goal: config หลักอยู่จุดเดียว workspaces อ้างกลับ

1. สร้าง/อัปเดต root shared config ตาม ecosystem:
   - `tsconfig.base.json` → workspaces `extends`
   - `eslint.config.js` flat config ที่ root → workspaces import/extend
   - `prettier.config.*` ที่ root → อ้างผ่าน `package.json#prettier`
   - test/build config → `defineConfig` จาก shared
2. ย้าย dependency versions ที่ซ้ำไป catalog ตาม package manager (`pnpm-workspace.yaml` catalogs, `bun.catalogs`, หรือ root `overrides`)
3. แทนที่ version ใน package manifests ด้วย `catalog:` reference
4. ถ้างานนี้มี shared code duplication ปน → dispatch `/refactor-to-packages-shared` สำหรับส่วน code

### 3. Rewire And Verify

> Goal: ทุก workspace ใช้ shared config จริงและไม่พัง

1. ทำ `/update-references` — ลบ config ลูกที่ duplicate, เก็บเฉพาะ workspace-specific overrides
2. รัน validate ตาม ecosystem: `tsc -b`, `eslint .`, `prettier --check .`, install ใหม่เพื่อ resolve catalog
3. ทำ `/check-config-drift` อีกครั้ง — ยืนยันว่าเหลือ canonical config เดียวต่อ domain
4. ถ้า fail → revert batch นั้นแล้วแก้ สูงสุด 3 รอบ → stop/report

## Rules

- รวมเฉพาะ config ที่ซ้ำจริง — workspace-specific options อยู่ที่ workspace เดิม
- shared config ห้ามพึ่ง workspace ใดๆ — เป็น foundation เท่านั้น
- behavior เหมือนเดิม — resolved config หลัง extends ต้องเท่าเดิม (ยกเว้น drift ที่ตั้งใจ unify)
- lockfile ต้อง regenerate หลังย้าย deps ไป catalog — commit lockfile ด้วย

## Expected Outcome

- config แต่ละ domain มี canonical version เดียวที่ root — workspaces แค่ extends/override
- dependency versions อยู่ใน catalog — manifests ใช้ `catalog:` ไม่ pin ซ้ำ
- validate ผ่านทุก workspace — ไม่มี config drift เหลือ
