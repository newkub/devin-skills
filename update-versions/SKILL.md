---
name: update-versions
description: Rust CLI อัปเดต deps/runtime/tools/CI versions ทุก ecosystem ทีเดียว — dry-run ก่อนเสมอ
argument-hint: "[path] [--yes] [--level patch|minor|latest] [--skip-verify] [--no-actions]"
related:
  - update-version-to-latest
  - follow-tasks
  - follow-tool-taze
  - cleanup-artifact
  - run-verify
  - test-usage
  - ask-me
  - report
---

## Goal

อัปเดต dependencies, runtime, tools และ CI versions ทุก workspace/package เป็น latest ด้วย Rust CLI ใน skill นี้ — รันทีเดียว: detect → dry-run → snapshot → update → install → diff report → verify

## Scope

- ครอบคลุมทุก ecosystem ที่ตรวจพบ: **Bun/Node** (`package.json` → `bunx taze` + `bun install`), **Rust** (`Cargo.toml` → `cargo update` + `cargo upgrade` ถ้ามี cargo-edit), **Go** (`go.mod` → `go get -u ./...` + `go mod tidy`), **Python** (`uv.lock` → `uv lock --upgrade` / `requirements.txt` → `pip install -U`), **mise** (`mise upgrade --bump`), **GitHub Actions** (`uses:` tags ผ่าน `gh api` latest release)
- `--level`: `patch` / `minor` / `latest` (default `latest` = bump ทั้ง major/minor/patch เป็น newest)
- Dockerfile `FROM img:tag` — detect และ report เท่านั้น (registry check ต้อง tool ภายนอก)
- สำหรับ flow เต็มที่มี changelog analysis, major-migration subskill และ commit แยก batch → ใช้ `/update-version-to-latest` แทน; CLI นี้คือ fast path ทีเดียวจบ

## Execute

### 1. Build CLI

> Goal: มี binary พร้อมใช้

1. `cargo build --release` ใน skill directory — binary อยู่ที่ `target/release/update-versions` (เพิ่ม `.exe` บน Windows)
2. ถ้า `cargo` ไม่มี → stop และ report

### 2. Dry-Run Detect

> Goal: รู้ว่า repo มี ecosystem อะไรให้อัปเดต

1. รัน `update-versions <path>` (default `.`) — output: ecosystems detected (bun/cargo/go/python/mise/actions/docker counts)
2. ถ้าไม่มี ecosystem → report และจบ
3. ตรวจ tools ที่จำเป็น: `bun`/`bunx` สำหรับ Node, `cargo`, `go`, `uv`/`pip`, `mise`, `gh` (สำหรับ actions) — CLI skip ที่ไม่มีเอง

### 3. Confirm And Update

> Goal: อัปเดตเป็น latest ทุก ecosystem

1. ทำ `/report` แสดง ecosystems + level ที่จะอัปเดต — ถาม user ด้วย `ask_user_question` (level `latest`/`minor`/`patch`)
2. รัน `update-versions <path> --yes` (เพิ่ม `--level minor` ถ้า user ไม่เอา major)
3. CLI ทำเอง: snapshot → run updaters ต่อ ecosystem → GitHub Actions bumps → re-snapshot → ตาราง `dep old -> new file`

### 4. Verify

> Goal: ยืนยัน project ยังเขียว

1. CLI verify อัตโนมัติ (`bun run verify`/`build`, `cargo check --workspace`, `go build ./...`) — ข้ามได้ด้วย `--skip-verify`
2. ถ้า fail → ทำ `/resolve-errors` แล้ว recheck (max 3)
3. ทำ `/test-usage` ตาม convention — usage examples ต้องยังทำงาน
4. ทำ `/report` สรุป: `No.`, `Package`, `Old`, `New`, `Type`, `Status`

## Rules

### 1. Dry-Run First

- ไม่มี `--yes` = detect + report เท่านั้น — ห้ามเขียน manifest/lockfile โดยไม่ confirm
- `--level latest` bump majors ด้วย — ถ้า major updates เสี่ยงสูงให้ user เลือก `--level minor` แทน

### 2. Tool Graceful

- CLI skip ecosystem ที่ tool ไม่มี (เช่น ไม่มี `gh` → skip actions, ไม่มี `uv` → fallback `pip`)
- `cargo upgrade --incompatible` รันเฉพาะเมื่อ cargo-edit ติดตั้ง — ไม่มีก็ bump เฉพาะ semver-compatible ผ่าน `cargo update`

### 3. Safety

- Git working tree ควร clean ก่อน `--yes` (revert ได้) — เตือน user ถ้ามี uncommitted changes
- ไม่ downgrade เพื่อแก้ปัญหา — ถ้า update แล้วพังให้ `/resolve-errors` ไม่ใช่ rollback versions เองโดยไม่ถาม

- ใช้ /update-version-to-latest ถ้าจำเป็น (full flow + major migration subskill)
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /test-usage ถ้าจำเป็น

## Expected Outcome

- Ecosystem detection report ก่อนลงมือ
- ทุก deps/tools/CI versions เป็น latest ตาม level ที่เลือก + lockfiles synced
- ตาราง `old -> new` ต่อ dep + verify results
- ไม่มี silent failures — ทุก skipped ecosystem ระบุเหตุ
