---
name: follow-tasks
description: ตั้งค่า scripts ใน package.json, Cargo.toml หรือ moon.yml ตามมาตรฐาน
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - run-test-all
  - run-task-all
  - run-check
  - run-verify
  - run-scan
  - run-lint
  - run-typecheck
  - run-build
  - run-test
  - use-scripts
  - follow-monorepo
  - follow-tool-moonrepo
  - deep-review
  - update-version-to-latest

---
## Goal

ตั้งค่า scripts ใน `package.json` หรือ `Cargo.toml` ตามมาตรฐาน Minimal, Standard, Complete

## Scope

ตั้งค่า scripts สำหรับ packages และ workspaces ใน monorepo ไม่รวมการเขียน config files เอง (ใช้ `/deep-review`); ประสานงานกับ `/run-scan`, `/run-lint`, `/run-typecheck`, `/run-build`, `/run-test` (coverage) เพื่อรัน scripts ที่ตั้งค่า

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ project structure และ tools ก่อนเริ่มตั้งค่า scripts

1. ตรวจสอบ `package.json` หรือ `Cargo.toml` ว่ามีอยู่ — ถ้าไม่มี → stop และ report
2. ตรวจสอบ monorepo (หลาย `package.json`, workspace config, git submodules) — ถ้าเป็น monorepo ทำ `/follow-monorepo` ก่อน
   - ถ้ามี `.moon/workspace.yml` หรือ `moon.yml` → ทำ `/follow-tool-moonrepo` ก่อน แล้วใช้ moonrepo mode (ดู Rules §3)
3. ยืนยัน tools ติดตั้งแล้ว: Node.js/Bun (`biome`, `vitest` หรือ `bun test`), Rust (`cargo-nextest`, `cargo-llvm-cov`), Python (`pytest`, `ruff`), Go (`go test`, `golangci-lint`)
4. ถ้า tool จำเป็นไม่มี → stop และ report

### 2. Update Dependencies

> Goal: ตรวจสอบ package manager และ update dependencies ตาม ecosystem

1. ตรวจสอบ package manager (`bun`, `npm`, `pnpm`, `yarn`, `cargo`, `pip`, `go`)
Latest: `taze@21.1.0`, `lefthook@2.1.14` (verified 2026-09-16)

2. สำหรับ Node.js/Bun → ทำ `/follow-tool-taze` เพื่อตั้งค่า Taze สำหรับ dependency updates
3. สำหรับ tools ที่จัดการด้วย mise → รัน `mise upgrade` เพื่ออัปเดต dev tools (เช่น `bun`, `gitleaks`, `hk`); ถ้าต้องการ bump version ใน `mise.toml` ด้วย → ใช้ `mise upgrade --bump`
4. Update ตาม ecosystem: Node.js/Bun ใช้ `taze` (Root Only), Rust ใช้ `cargo update`, Python ใช้ `pip install -U`, Go ใช้ `go get -u ./... && go mod tidy`
5. หลังตั้งค่าเสร็จ → ทำ `/update-version-to-latest` เพื่อ bump dependencies ทั้งหมดเป็น latest เสมอ
6. สำหรับ monorepo ที่ใช้ Bun: `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` — workspace packages ไม่มี `prepare` script — root: `"prepare": "bunx taze -r -w && bunx lefthook install"` (ห้าม `-i` ใน `prepare` — interactive จะ hang ใน CI; ใช้ `-i` เฉพาะ `deps:update` ที่รันด้วยมือ)
7. ถ้า update fail → retry (max 3 → stop/report)

### 3. Select Template Level

> Goal: เลือกระดับ scripts ตามขนาดและความซับซ้อนของโปรเจกต์

1. ประเมินขนาดโปรเจกต์และความต้องการ testing/deployment
2. เลือกระดับตาม Rules section 1: Minimal (ทุกโปรเจกต์), Standard (testing + deps management), Complete (infra/tooling team)
3. ถ้าไม่แน่ใจ → เริ่มด้วย Minimal และขยายภายหลัง

### 4. Apply Scripts

> Goal: ตั้งค่า scripts ในทุก workspace ตาม tech stack และ template level ที่เลือก

1. เลือก command จาก [references/scripts-tables.md](references/scripts-tables.md) ตาม tech stack — JS/Bun แก้ `package.json` โดยตรง; Rust/Python/Go ใช้ task runner ตาม Script Mechanism (`justfile`, `cargo-make`, `xtask`, `Makefile`, `poe`, `Taskfile.yml`)
2. ทำ `/use-scripts` สำหรับ apply — Single workspace แก้ไข manifest/task file โดยตรง; Multiple workspaces ทำ `/follow-monorepo` ก่อน
3. ถ้า operations > 10 ไฟล์ → ใช้ `/use-scripts` เพื่อ batch update
4. ถ้า apply fail → retry (max 3 → stop/report)

### 5. Setup Config And Secrets

> Goal: ตั้งค่า config files, ตั้งค่า secrets management ไปพร้อมกัน

1. `/deep-review` ตาม tech stack ที่ detect ได้, ตรวจสอบ `.infisical.json` ว่ามีหรือไม่
2. ถ้ามี `.infisical.json` หรือใช้ secret manager → ทำ `/follow-secret-manager` เพื่อตั้งค่า secrets scripts
3. ตรวจสอบว่า scripts ที่ต้องการ secrets (`dev`, `build`, `deploy`) ใช้ `infisical run -- <command>` ครอบ — เพิ่ม root scripts `secrets:dev`, `secrets:build`, `secrets:export`, `secrets:run` (ตารางใน reference)
4. ตรวจสอบว่า `INFISICAL_TOKEN` ตั้งค่าใน CI/CD แล้ว — ถ้าไม่มี → report และขอให้ตั้งค่า
5. รันเฉพาะ workflows ที่จำเป็น ไม่รันทุก workflow — ถ้า config fail → retry (max 3 → stop/report)

### 6. Validate

> Goal: ตรวจสอบ scripts syntax และยืนยัน commands ทำงานได้จริง

1. ตรวจสอบ scripts syntax ใน `package.json` หรือ task runner file — ถ้า syntax invalid → fix และ recheck (max 3 → stop)
2. ยืนยัน `check` script = `format && lint && typecheck && scan` (format ก่อน lint) และ `verify` = `check && test && build` สำหรับ project เล็ก; project ใหญ่ `verify` อย่างน้อย `check && test` — `ci` ต้อง read-only ผ่าน `format:check` ไม่ใช่ `format`
3. ทำ `/run-test-all` เพื่อรัน unit, integration, e2e, coverage
4. ทำ `/run-task-all` เพื่อรันทุก task/script ที่ตั้งค่าไว้ครบถ้วน
5. ทดสอบรัน `bun run verify` — ถ้า fail → แก้ไขและ retry (max 3 → stop/report)
6. ถ้า project มี `tools/review-codebase` workspace → รัน `bun run review-codebase` เพื่อ review codebase ครั้งแรก — ถ้า fail → ใช้ `/deep-review` เพื่อสร้าง/อัปเดต CLI แล้ว retry

## Rules

### 1. Scripts Levels And Root Only

เลือกระดับตามขนาดและความซับซ้อนของโปรเจกต์
- Minimal (Default): dev, build, typecheck, lint, format, test, scan, check, verify, ci - เหมาะสำหรับโปรเจกต์ส่วนใหญ่
- Standard: Minimal + test:watch, test:coverage, deps:analyze, clean, security, db scripts, predeploy, deploy:staging - เหมาะสำหรับโปรเจกต์ที่ต้องการ testing และ dependency management เพิ่มเติม
- Complete: Standard + build:watch, typecheck:watch, test:integration, test:e2e, benchmarks, prerelease, db:studio - เหมาะสำหรับ infra/tooling team

สำหรับ monorepo ที่ใช้ Bun:
- `taze` และ `lefthook install` ต้องอยู่เฉพาะ root `package.json` เท่านั้น
- Workspace packages ไม่มี `prepare` script
- Root `package.json`: `"prepare": "bunx taze -r -w && bunx lefthook install"` — ห้าม `-i` ใน `prepare` (interactive hang ใน CI); `-i` ใช้เฉพาะ `deps:update` ที่รันด้วยมือ

### 2. Script Tables

ตาราง command lookup ทั้งหมดอยู่ที่ [references/scripts-tables.md](references/scripts-tables.md) — single source of truth ครอบ:

- `Script Mechanism` — `Cargo.toml`/Python/Go ไม่มี script runner ในตัว → ใช้ `justfile`, `cargo-make`, `xtask`, `Makefile`, `poe`, `nox`, `Taskfile.yml` (ห้ามใส่ scripts ใน `Cargo.toml`)
- `Bun-Native Alternatives` — `bun test`, `bun audit`, `bun ci`, `bun run --workspaces`, `bun --filter`
- `Required / Watch / Testing / Deps / Database / Prerelease+Bench / Security / Deploy / Docs` — ครบทุก stack: Bun, Nuxt (`nuxi` commands), Next.js, Solid Start, SvelteKit, Tauri, Rust, Python, Go
- `Secrets, Monorepo, Review CLI, Other Ecosystems` (Kotlin, PHP, Swift, Zig, Lua, C#)

กฎสำคัญที่ผูกกับตาราง:
- `check` = `format && lint && typecheck && scan` (format write — local dev)
- `ci` = `format:check && lint && typecheck && scan && test && build` (read-only — ไม่ mutate files ใน pipeline)
- `verify` = `check && test && build` (project เล็ก); project ใหญ่อย่างน้อย `check && test`
- `release` ไม่อยู่ใน package manifest — release ทำผ่าน CI/CD workflow บน tag หรือ `/run-release`
- ถ้ามี `tools/review-codebase` workspace → เพิ่ม `review-codebase` scripts (ตารางใน reference) แล้วรัน `bun run review-codebase` ครั้งแรก — ถ้า fail ใช้ `/deep-review`

### 3. Moonrepo Mode

ถ้า project ใช้ moonrepo (มี `.moon/workspace.yml` หรือ `moon.yml`):

- ใช้ `moon.yml` แทน `package.json` scripts ทั่วไป — แก้ไขเพิ่มเติม `.moon/tasks/all.yml` สำหรับ shared tasks เช่น `build`, `test`, `typecheck`, `lint`
- แต่ละ workspace `moon.yml` กำหนดเฉพาะ project-specific tasks — ไม่ต้องกำหนด `project` ซ้ำทุกไฟล์ ใช้ `id` และ `.moon/tasks/all.yml` เป็นหลัก
- กำหนด `package.json` scripts ให้ชี้ไปที่ `moon run <task>` เฉพาะที่จำเป็น
- ห้ามนิยาม task เดียวกันทั้งใน `moon.yml` และ `package.json` scripts — `package.json` มีเฉพาะ scripts ที่ไม่อยู่ใน `moon.yml`
- Validate ด้วย `moon run :check`
- รายละเอียดเต็มทำตาม `/follow-tool-moonrepo`

- ใช้ /open-web-for-config-secret ถ้าจำเป็น (tasks)
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น

## Expected Outcome

- `package.json` หรือ task runner file มี scripts ตาม template ที่เลือก (state change)
- Scripts สอดคล้องกับ tech stack (ตารางใน [references/scripts-tables.md](references/scripts-tables.md))
- `verify` และ `ci` pipeline ทำงานได้ถูกต้อง — `bun run verify` ผ่าน, `ci` read-only
- ถ้ามี `tools/review-codebase` รัน `bun run review-codebase` ผ่านหรือทราบสาเหตุที่ยังไม่ผ่าน
- ถ้ามี Infisical: root `package.json` มี `secrets:*` scripts และ `INFISICAL_TOKEN` ตั้งค่าใน CI/CD
