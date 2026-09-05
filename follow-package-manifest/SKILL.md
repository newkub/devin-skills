---
name: follow-package-manifest
description: ตั้งค่า scripts สำหรับ packages และ workspaces ใน monorepo
argument-hint: "[target]"
related:
  - review-delivery
  - follow-monorepo
  - follow-tool-taze
  - use-scripts
  - use-bun-scripts
  - run-test-all
  - follow-secret-manager
  - open-web-for-config-secret
  - deep-review-codebase
  - follow-tool-hk
  - use-astgrep
---

## Goal

ตั้งค่า scripts ใน `package.json` หรือ `Cargo.toml` ตามมาตรฐาน Minimal, Standard, Complete

## Scope

ตั้งค่า scripts สำหรับ packages และ workspaces ใน monorepo ไม่รวมการเขียน config files เอง (ใช้ `/review-delivery`)

ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ project structure และ tools ก่อนเริ่มตั้งค่า scripts

1. ตรวจสอบ `package.json` หรือ `Cargo.toml` ว่ามีอยู่ — ถ้าไม่มี → stop และ report
2. ตรวจสอบ monorepo (หลาย `package.json`, workspace config, git submodules) — ถ้าเป็น monorepo ทำ `/follow-monorepo` ก่อน
3. ยืนยัน tools ติดตั้งแล้ว: Node.js/Bun (`biome`, `vitest`), Rust (`cargo-nextest`, `cargo-llvm-cov`), Python (`pytest`, `ruff`), Go (`go test`, `golangci-lint`)
4. ถ้า tool จำเป็นไม่มี → stop และ report

### 2. Update Dependencies

> Goal: ตรวจสอบ package manager และ update dependencies ตาม ecosystem

1. ตรวจสอบ package manager (`bun`, `npm`, `pnm`, `yarn`, `cargo`, `pip`, `go`)
2. สำหรับ Node.js/Bun → ทำ `/follow-tool-taze` เพื่อตั้งค่า Taze สำหรับ dependency updates
3. สำหรับ tools ที่จัดการด้วย mise → รัน `mise upgrade` เพื่ออัปเดต dev tools (เช่น `bun`, `gitleaks`, `hk`); ถ้าต้องการ bump version ใน `mise.toml` ด้วย → ใช้ `mise upgrade --bump`
4. Update ตาม ecosystem: Node.js/Bun ใช้ `taze` (Root Only), Rust ใช้ `cargo update`, Python ใช้ `pip install -U`, Go ใช้ `go get -u ./... && go mod tidy`
5. สำหรับ monorepo ที่ใช้ Bun: `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` — workspace packages ไม่มี `prepare` script — root: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`
6. ถ้า update fail → retry (max 3 → stop/report)

### 3. Select Template Level

> Goal: เลือกระดับ scripts ตามขนาดและความซับซ้อนของโปรเจกต์

1. ประเมินขนาดโปรเจกต์และความต้องการ testing/deployment
2. เลือกระดับตาม Rules section 1: Minimal (ทุกโปรเจกต์), Standard (testing + deps management), Complete (infra/tooling team)
3. ถ้าไม่แน่ใจ → เริ่มด้วย Minimal และขยายภายหลัง

### 4. Apply Scripts

> Goal: ตั้งค่า scripts ในทุก workspace ตาม tech stack และ template level ที่เลือก

1. ทำ `/use-scripts` ตาม tech stack จากตาราง Rules — Single workspace: แก้ไข `package.json` หรือ `Cargo.toml` โดยตรง
2. Multiple workspaces: ทำ `/follow-monorepo` ก่อน แล้วใช้ `/use-bun-scripts` สำหรับ batch update
3. ถ้า operations > 10 ไฟล์ → ใช้ `/use-scripts` เพื่อ batch update
4. ถ้า apply fail → retry (max 3 → stop/report)

### 5. Setup Config And Secrets

> Goal: ตั้งค่า config files, ตั้งค่า secrets management ไปพร้อมกัน

1. `/review-delivery` ตาม tech stack ที่ detect ได้, ตรวจสอบ `.infisical.json` ว่ามีหรือไม่
2. ถ้ามี `.infisical.json` หรือใช้ secret manager → ทำ `/follow-secret-manager` เพื่อตั้งค่า secrets scripts
3. ตรวจสอบว่า scripts ที่ต้องการ secrets (`dev`, `build`, `deploy`) ใช้ `infisical run -- <command>` ครอบ — เพิ่ม root scripts: `secrets:dev`, `secrets:build`, `secrets:export`, `secrets:run`
4. ตรวจสอบว่า `INFISICAL_TOKEN` ตั้งค่าใน CI/CD แล้ว — ถ้าไม่มี → report และขอให้ตั้งค่า
5. รันเฉพาะ workflows ที่จำเป็น ไม่รันทุก workflow — ถ้า config fail → retry (max 3 → stop/report)

### 6. Validate

> Goal: ตรวจสอบ scripts syntax และยืนยัน commands ทำงานได้จริง

1. ตรวจสอบ scripts syntax ใน `package.json` หรือ `Cargo.toml` — ถ้า syntax invalid → fix และ recheck (max 3 → stop)
2. ยืนยัน `check` script = `lint && typecheck && scan` และ `verify` = `check && test`
3. ทำ `/run-test-all` เพื่อรัน unit, integration, e2e, coverage
4. ทดสอบรัน `bun run verify` — ถ้า fail → แก้ไขและ retry (max 3 → stop/report)
5. ถ้า project มี `tools/review-codebase` workspace → รัน `bun run review-codebase` เพื่อ review codebase ครั้งแรก — ถ้า fail → ใช้ `/deep-review` เพื่อสร้าง/อัปเดต CLI แล้ว retry

## Rules

### 1. Scripts Levels And Root Only

เลือกระดับตามขนาดและความซับซ้อนของโปรเจกต์
- Minimal (Default): dev, build, typecheck, lint, format, test, scan, check, verify, ci
- Standard: Minimal + test:watch, test:coverage, deps:analyze, clean, security, db scripts, predeploy, deploy:staging
- Complete: Standard + build:watch, typecheck:watch, test:integration, test:e2e, benchmarks, prerelease, release, db:studio

สำหรับ monorepo ที่ใช้ Bun:
- `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` เท่านั้น
- Workspace packages ไม่มี `prepare` script
- Root `package.json`: `"prepare": "bunx taze -r -w -i && bunx lefthook install"`

### 2. Script Tables

คำสั่ง scripts สำหรับแต่ละ tech stack ดูได้ใน:
- [references/scripts-tables.md](references/scripts-tables.md) — Required, Watch, Testing, Dependency, Database, Release, Security, Deployment, Documentation, Review CLI
- [references/package-json-examples.md](references/package-json-examples.md) — ตัวอย่าง `package.json` สำหรับแต่ละ template

### 3. Verify And CI Pipeline

| Script | Definition |
|---|---|
| check | `lint && typecheck && scan` |
| verify | `check && test` |
| ci | `verify && build` |

### 4. Secrets And Config

- อย่าเก็บ secret values ใน `package.json` หรือ `Cargo.toml`
- ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret` เมื่อต้องการ config/secrets
- scripts ทีต้องการ secrets ให้ใช้ `infisical run -- <command>`

- ใช้ /follow-tool-hk ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น

## Expected Outcome

- `package.json` มี scripts ตาม template ที่เลือก (state change)
- Scripts สอดคล้องกับ tech stack (ตาราง Rules)
- `verify` และ `ci` pipeline ทำงานได้ถูกต้อง — `bun run verify` ผ่าน
- ถ้ามี `tools/review-codebase` รัน `bun run review-codebase` ผ่านหรือทราบสาเหตุที่ยังไม่ผ่าน
- ถ้ามี Infisical: root `package.json` มี `secrets:*` scripts และ `INFISICAL_TOKEN` ตั้งค่าใน CI/CD

