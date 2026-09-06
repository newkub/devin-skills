---
name: update-version-to-latest
description: อัปเดต dependencies, runtime, tools, CI และ versioned config ในทุก workspace ให้เป็น latest แล้ว verify ด้วย build/test/usage
argument-hint: "[scope]"
related:
  - resolve-errors
  - report-table
  - run-check
  - deep-validate
  - test-usage
  - run-verify
  - follow-tool-taze
  - ask-me
---

## Goal

อัปเดต dependencies, runtime, tools, CI versions และ versioned config ในทุก workspace/package ให้เป็น latest ทั้งหมด แล้ว verify ว่า build, test, typecheck, lint และ usage examples ยังผ่าน

## Scope

- อัปเดตทุก versioned surface ที่ตรวจพบใน repo: dependencies, devDependencies, peerDependencies, catalog versions, mise tools, GitHub Actions versions, Docker base images, packageManager field, runtime config
- ใช้เครื่องมือตาม ecosystem: `bun`/`bunx taze` สำหรับ Node/Bun, `cargo update` สำหรับ Rust, `go get -u ./...` สำหรับ Go, `pip install -U` หรือ `uv` สำหรับ Python
- รองรับ monorepo: Moon, Turbo, pnpm workspace, Cargo workspace
- รันทีเดียวจบ: dry-run → update → install → build → test → test-usage → report

## Execute

รัน `/update-version-to-latest [scope]` ครั้งเดียว ระบบจะทำตามลำดับนี้โดยอัตโนมัติ

### 1. Detect Versioned Surfaces

> Goal: รู้ว่าต้องอัปเดตอะไรบ้าง

1. หา manifest ทั้งหมด: `package.json`, `bun.lockb`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `Cargo.toml`, `Cargo.lock`, `go.mod`, `go.sum`, `mise.toml`, `.tool-versions`, `pyproject.toml`, `uv.lock`, `.github/workflows/*.yml`
2. บันทึก dependencies, devDependencies, peerDependencies, catalog versions, `packageManager`, `engines`, action versions, mise tool versions
3. ระบุ ecosystems ทีใช้

### 2. Dry-Run Analysis

> Goal: ดูก่อนว่าจะอัปเดตอะไร

1. รัน `bunx taze --dry-run` หรือ `bun outdated` สำหรับ Node/Bun
2. รัน `cargo update --dry-run` สำหรับ Rust
3. รัน `go list -u -m all` สำหรับ Go
4. รวม major/minor/patch updates และสร้างตาราง `No.`, `Package`, `Current`, `Latest`, `Type`, `Risk`
5. ถ้ามี major updates → อ่าน changelogs คร่าวๆ แล้วถ้าเสี่ยงสูงให้ `/ask-me` ก่อน write

### 3. Update Dependencies

> Goal: อัปเดตทุก dependency เป็น latest

1. อัปเดต patch → `bunx taze --patch --write` หรือ `bun update`
2. อัปเดต minor → `bunx taze --minor --write`
3. อัปเดต major → `bunx taze --major --write` (ทีละ batch พร้อมตรวจ breaking changes)
4. ถ้ามี catalog versions ใน root `package.json` → อัปเดต catalog ก่อน แล้ว install
5. `cargo update` สำหรับ Rust workspace
6. `go get -u ./...` แล้ว `go mod tidy` สำหรับ Go
7. อัปเดต `packageManager` field ถ้ามี

### 4. Update Runtime / Tools / CI

> Goal: อัปเดต runtime, dev tools, GitHub Actions และ versioned config

1. อัปเดต `mise.toml` / `.tool-versions` เครื่องมือเป็น latest stable
2. อัปเดต GitHub Actions versions ใน `.github/workflows/*.yml` (ตรวจ latest release tag)
3. อัปเดต Docker base images (`FROM ...:`) ถ้ามี `Dockerfile`
4. อัปเดต `engines` ใน `package.json` ถ้าจำเป็น
5. ถ้ามี `biome.jsonc`, `.node-version`, `.nvmrc` ที่ระบุ version → sync ให้ตรง

### 5. Install And Sync

> Goal: ให้ lockfile สอดคล้อง

1. `bun install` สำหรับ Bun/Node
2. `cargo fetch` หรือ `cargo generate-lockfile` สำหรับ Rust
3. `go mod tidy` สำหรับ Go
4. ตรวจ `bun.lockb`/`pnpm-lock.yaml` ไม่มี conflicts

### 6. Verify

> Goal: ยืนยัน project ยังใช้งานได้

1. รัน `/run-verify` หรือเทียบเท่า: build, typecheck, lint, test
2. สำหรับ Rust: `cargo check --workspace`, `cargo test --workspace`
3. สำหรับ Go: `go build ./...`, `go test ./...`
4. ถ้ามี Moon: `moon run :build :typecheck :lint :test`
5. ถ้า fail → `/resolve-errors` แล้ว recheck

### 7. Test Usage

> Goal: ยืนยัน usage examples ยังทำงาน

1. ทำ `/test-usage [scope]` เพื่อทดสอบ examples ใน `README.md`, `USAGE.md`, `package.json` scripts
2. บันทึก examples ที่พังหรือต้องปรับ

### 8. Commit And Report

> Goal: เก็บ changes พร้อมสรุป

1. แยก commit ตามประเภท: `chore: update patch dependencies`, `chore: update minor dependencies`, `chore: update major dependencies`, `chore: update runtime/CI versions` (ถ้า user ยินยอม push)
2. ใช้ `/report-table` สรุป: `No.`, `Package`, `Old`, `New`, `Type`, `Status`
3. รายงาน breaking changes หรือ action ที่ต้องทำต่อ

## Rules

### 1. One-Shot Flow

- ผู้ใช้เรียก `/update-version-to-latest [scope]` ครั้งเดียว ระบบต้องวนทำ steps ให้ครบเอง
- ถ้า step ใด fail → หยุด แจ้งสาเหตุ และ suggest next action
- ไม่ต้องให้ user เรียก sub-command ซ้ำ

### 2. Update Order

- patch → minor → major
- runtime/tools → dependencies
- อัปเดต catalog ก่อน install ถ้าเป็น monorepo
- ไม่อัปเดต major ทุกตัวพร้อมกัน ถ้ามี breaking changes ให้ batch และ test ทีละ batch

### 3. Safety

- ต้อง dry-run ก่อน write
- ตรวจ `minimumReleaseAge` ถ้ามี security policy
- ไม่ downgrade เพื่อแก้ปัญหา
- ถ้า major update มี breaking changes สูง → `/ask-me`
- ไม่ commit ถ้า verify ไม่ผ่าน

### 4. Ecosystem Tools

- Bun: `bunx taze`, `bun update`, `bun install`
- Rust: `cargo update`, `cargo check --workspace`
- Go: `go get -u ./...`, `go mod tidy`
- Python: `pip install -U` หรือ `uv pip compile`
- GitHub Actions: ตรวจ latest release tag จาก GitHub API

### 5. Usage Verification

- ต้องทำ `/test-usage` ทุกครั้งหลัง update เสร็จ
- ถ้า usage example พัง → แก้ไขหรืออัปเดต docs ก่อน commit

## Expected Outcome

- ทุก dependencies, runtime, tools, CI versions อัปเดตเป็น latest stable
- Lock file อัปเดตและไม่มี conflicts
- Build, typecheck, test, lint ผ่าน
- `/test-usage` ผ่าน
- รายงาน versions ที่เปลี่ยน, breaking changes, และ action ถัดไป
