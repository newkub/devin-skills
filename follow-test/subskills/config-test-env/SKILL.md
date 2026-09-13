---
name: follow-test-config-test-env
description: ตั้งค่า test environment — env vars, fixtures, test db และ CI test env
argument-hint: "[scope]"
related:
  - follow-test
  - follow-config
  - check-secrets
  - check-test-isolation
  - follow-secret-manager
  - follow-monorepo
  - setup-cicd
  - run-test
  - resolve-errors
  - ask-me
---

## Goal

ตั้งค่า test environment ให้ tests รันได้ deterministic — env vars, fixtures dir, test database และ CI test env ครบและ merge กับ config เดิม

## Scope

- ใช้เมื่อต้อง config environment สำหรับ testing — หลังเลือก strategy level ใน `/follow-test`
- ครอบคลุม: test env vars, fixtures/helpers directories, test database/services, CI test environment
- ไม่ครอบคลุมการเขียน tests (ใช้ `/update-tests`) หรือ coverage tooling (ใช้ `follow-tdd/subskills/setup-coverage`)

## Execute

### 1. Read Current Test Config

> Goal: รู้ config เดิมก่อนแก้ — ห้าม clobber

1. ตรวจ test config ที่มี: `vitest.config.*`, `pytest.ini`, `Cargo.toml`, CI workflows
2. ทำ `/check-secrets env-vars` — vars ที่ tests ต้องใช้ vs ที่ define
3. ถ้า monorepo → ทำ `/follow-monorepo` เพื่อระบุ test env ต่อ workspace
4. ถ้าไม่พบ test config เลย → กลับไปทำ `/follow-test` setup flow ก่อน

### 2. Configure Test Env Vars

> Goal: test env แยกจาก dev/prod ชัดเจน

1. สร้าง/อัปเดต `.env.test` หรือ test env file ตาม framework convention — merge กับของเดิม
2. test vars ต้องชี้ test resources เท่านั้น — ห้ามชี้ production db/services
3. secrets ที่ tests ต้องใช้ → `/follow-secret-manager`; CI secrets ตั้งใน repo settings ไม่ใช่ในไฟล์
4. เพิ่ม `.env.test` pattern ใน `.gitignore` ถ้ามีค่าจริง — เก็บ `.env.test.example` เป็น placeholder

### 3. Setup Fixtures And Test Database

> Goal: test data และ db isolation พร้อม

1. สร้าง `tests/fixtures/` และ `tests/helpers/` ตาม structure ของ parent — หรือตาม convention ที่ project ใช้
2. test database: แยก db name/schema จาก dev — ใช้ ephemeral option (container, in-memory, per-run db) ตาม stack
3. seed/migration strategy สำหรับ test db — deterministic และ reset ระหว่าง runs
4. ทำ `/check-test-isolation` — tests ไม่ share state และไม่ depend กัน

### 4. Configure CI Test Env

> Goal: CI รัน tests ได้เหมือน local

1. เพิ่ม test env vars/secrets ใน CI workflow — อ่านจาก CI secrets ไม่ hardcode
2. เพิ่ม services ที่ tests ต้องการใน CI (เช่น database service container)
3. ถ้ายังไม่มี CI test step → ทำ `/setup-cicd`

### 5. Verify

> Goal: tests รันได้ทั้ง local และ CI

1. ทำ `/run-test` — suite ผ่านด้วย test env ใหม่
2. ทดสอบ missing var → error ชัดเจน ไม่ใช่ silent fallback
3. ถ้า fail → revert keys ที่เพิ่งแก้แล้ว report diff — หรือ `/resolve-errors` max 3 รอบ
4. report before/after config สั้นๆ ให้ user

## Rules

- merge กับ config เดิม — ห้าม overwrite test config/env ทั้งไฟล์ถ้าไม่จำเป็น
- test env ต้องแยกจาก dev/prod — ห้าม tests แตะ production resources
- ห้าม commit secrets หรือค่าจริง — placeholder เท่านั้นใน example files
- tests ต้อง deterministic — fixtures fixed, db reset ระหว่าง runs

## Expected Outcome

- test env vars ครบและแยกจาก dev/prod
- fixtures/helpers structure ตาม convention และ test db isolate ได้
- CI รัน tests ผ่านด้วย env เดียวกัน

