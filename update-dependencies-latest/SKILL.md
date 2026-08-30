---
name: update-dependencies-latest
description: อัพเดท dependencies ในทุก workspace ให้เป็น latest version ทั้ง major, minor, patch
related:
  - update-version-latest
  - update-runtime-latest
  - update-config
  - run-check
  - deep-validate
---

## Goal

อัพเดท dependencies ในทุก workspace/package ให้เป็น latest version ทั้งหมด ไม่ว่าจะเป็น major, minor หรือ patch updates

## Scope

อัพเดท dependencies ในทุก workspace, packages ใน monorepo และ manifest ของทุก ecosystem ทีตรวจพบ ไม่รวม runtime หรือ global tools

## CLI: `updatedeps`

CLI นี้อยู่ใน `src/cli.ts` (bin `updatedeps` ชี้มาที `src/cli.ts` สำหรับ Bun)

### Install

```bash
bun install
```

หรือใช้โดยตรง:

```bash
bun src/cli.ts --help
```

### Commands

| Command | Description |
|---------|-------------|
| `updatedeps [update] [path]` | อัพเดท dependencies (default) |
| `updatedeps convert-submodules <path> --remote <url>` | แปลง package/path เป็น git submodule |
| `updatedeps refactor [path]` | รัน refactor command ใน repo |
| `updatedeps retest [path]` | รัน tests ใหม่หลังอัพเดท |
| `updatedeps commit [path]` | stage + commit + push |

### `update` flags

```bash
updatedeps [update] [path] --type all|patch|minor|major --write --interactive --recursive --dry-run
```

- `--type`: ระดับการอัพเดท (default `all`)
- `--write`: เขียนลง manifest
- `--interactive`: ใช้ taze interactive mode
- `--recursive`: recursive workspaces
- `--dry-run`: แสดงผลโดยไม่อัพเดท

### ตัวอย่าง

```bash
# ดูว่ามีอะไร outdate บ้าง
cd /path/to/project
bun src/cli.ts update --dry-run

# อัพเดททั้งหมดเป็น latest แล้วเขียนลงไฟล์
bun src/cli.ts update --type all --write --recursive

# อัพเดท major versions เท่านั้น
bun src/cli.ts update --type major --write

# แปลง directory เป็น submodule แล้ว commit/push
bun src/cli.ts convert-submodules packages/legacy --remote https://github.com/org/legacy.git --push

# refactor ใน temp clone ด้วยคำสั่งกำหนดเอง
bun src/cli.ts refactor --temp --command "bunx @ast-grep/cli scan"

# retest บน temp clone
bun src/cli.ts retest --temp

# commit ทั้งหมดแล้ว push
bun src/cli.ts commit -m "chore: update dependencies" --push
```

## Auto-Detected Manifests

CLI ตรวจหาไฟล์อัตโนมัติ:

- `package.json` -> Bun/Node
- `Cargo.toml` -> Rust
- `pyproject.toml`, `requirements.txt` -> Python
- `go.mod` -> Go
- `Dockerfile` -> Docker
- `.github/workflows/*.yml` -> GitHub Actions

## Ecosystem Update Methods

| Ecosystem | Method |
|-----------|--------|
| Bun/Node | `bunx taze` ถ้ามี, มิฉะนั้น `bun update --latest` หรือ query `registry.npmjs.org` |
| Rust | `cargo update` + query `crates.io/api/v1/crates/<crate>` |
| Python | query `pypi.org/pypi/<pkg>/json` แล้วอัปเดท `pyproject.toml` / `requirements.txt` |
| Go | `go get -u ./...` + `go list -m -u all` |
| Docker/CI | แก้ `FROM` tag ด้วย Docker Hub API และ `uses:` ใน workflows ด้วย GitHub API |

## Execute

### 1. Pre-Update Analysis

1. รัน `bun src/cli.ts update --dry-run`
2. แยกตามประเภทการอัพเดท: major, minor, patch
3. ตรวจสอบ breaking changes จาก major updates
4. สร้าง branch ใหม่ก่อนอัพเดท (แนะนำ)

### 2. Update Dependencies

1. รัน `bun src/cli.ts update --type patch --write`
2. รัน `bun src/cli.ts update --type minor --write`
3. รัน `bun src/cli.ts update --type major --write` (ระวัง breaking changes)

### 3. Post-Update Verification

1. รัน `bun src/cli.ts retest` (หรือ `bun src/cli.ts retest --temp`)
2. รัน `bun src/cli.ts refactor` เพื่อ lint / refactor
3. รัน `bun src/cli.ts commit -m "chore: update deps" --push`

## Rules

### 1. Update Strategy

- อัพเดททีละประเภท: patch -> minor -> major
- ไม่อัพเดททุกอย่างพร้อมกันในครั้งเดียวถ้ามี breaking changes
- แยก commit ตามประเภทการอัพเดท

### 2. Safety First

- สร้าง branch ใหม่ก่อนอัพเดท
- รัน tests ก่อนและหลังอัพเดท
- ใช้ `--dry-run` ก่อน `--write`
- `convert-submodules --push` ต้องยืนยันก่อน หรือใช้ `--force`

### 3. Tooling

- ใช้ `bun` เป็นหลัก ห้ามใช้ npm/pnpm
- `bunx taze` สำหรับ Node/Bun
- `cargo update` สำหรับ Rust
- `go get -u ./...` สำหรับ Go
- ใช้ registry APIs ถ้า CLI tool ไม่อยู่

### 4. Automated Updates

- แนะนำ Renovate / Dependabot
- กำหนด schedule สำหรับ automated updates
- ตั้ง auto-merge สำหรับ patch updates ทีผ่าน tests

## Expected Outcome

- ทุก dependencies อัพเดทเป็น latest versions
- Lock file อัพเดทและไม่มี conflicts
- Tests ยังผ่านหลังอัพเดท
- ไม่มี security vulnerabilities ใหม่
- รายการอัพเดทมีรายละเอียดครบถ้วน
- Version consistency ใน monorepo
