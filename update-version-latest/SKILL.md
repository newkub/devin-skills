---
name: update-version-latest
description: อัปเดตทุก versioned สิ่งใน project/computer ให้เป็น latest deps, runtimes, tools, config
related:
  - update-dependencies-latest
  - update-runtime-latest
  - update-all-program-in-computer
  - update-config
  - update-project
  - deep-update-project
  - follow-tool-mise
  - follow-my-package-manager
  - run-check
  - deep-validate
---

## Goal

อัปเดตทุก versioned สิ่งใน project หรือ computer ให้เป็น latest stable: dependencies, language runtimes, global tools, และ versioned config (engines, CI images, Docker)

## Scope

ใช้เมื่อต้องการ update ทุกอย่างที่มี version ใน project ให้ทันสมัย โดย delegate งานเฉพาะทางให้ subskills แล้ว sync version references ให้สอดคล้องกัน ไม่ rewrite source code logic

## Execute

### 1. Detect Version Surfaces

> Goal: รู้ว่ามี versioned อะไรบ้าง

1. รายการ manifests และ version pins:
   - `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`
   - `mise.toml`, `.tool-versions`, `.nvmrc`, `.python-version`, `rust-toolchain.toml`, `global.json`
   - `bun.lock`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `Cargo.lock`, `poetry.lock`
   - `Dockerfile`, `.github/workflows/*.yml`, `.devcontainer/devcontainer.json`
2. ทำ `/scan-codebase` เพื่อหา version references อื่นๆ
3. บันทึก category: dependencies, runtimes, tools, CI/container, config

### 2. Prepare And Should Update

> Goal: พร้อมและปลอดภัยก่อน update

1. ทำ `/check-should-update` เพื่อตรวจ git changes และตัดสินใจว่าควร update
2. สร้าง branch ใหม่ก่อน update
3. ถ้า scope ไม่ชัด -> ทำ `/ask-me`

### 3. Update Runtimes

> Goal: language runtimes เป็น latest

1. ทำ `/update-runtime-latest`
2. บันทึก runtimes ที่อัปเดตและ version ใหม่

### 4. Update Global Tools

> Goal: global tools/CLIs เป็น latest

1. ทำ `/update-all-program-in-computer` เพื่ออัปเดต programs ในเครื่อง
2. ถ้าต้องการเฉพาะ project tools ผ่าน mise -> ทำ `/follow-tool-mise` แล้ว `mise up`
3. บันทึก tools ที่อัปเดต

### 5. Update Dependencies

> Goal: project dependencies เป็น latest

1. ทำ `/update-dependencies-latest`
2. บันทึก dependencies ที่อัปเดต (major, minor, patch)

### 6. Sync Versioned Config

> Goal: config ที่เกี่ยวกับ version สอดคล้องกัน

1. ทำ `/update-config` เพื่อ sync shared config และ dependencies catalog
2. อัปเดต `package.json#engines` ให้ตรงกับ runtime ใหม่
3. อัปเดต `mise.toml` ให้ทุก tool เป็น version ที่ใช้จริง
4. อัปเดต `Dockerfile` `FROM` tag, `.github/workflows` version fields, `.devcontainer` image
5. ถ้ามี Renovate/Dependabot config -> ตรวจ schedule ให้เหมาะสม
6. บันทึก config ที่ sync

### 7. Verify

> Goal: ตรวจสอบว่า update ทั้งหมดไม่พัง

1. รัน `bun install` หรือ package manager install เพื่อ refresh lockfile
2. รัน `bun run typecheck`, `bun run lint`, `bun run test` หรือ ecosystem equivalent
3. ทำ `/run-check`
4. ทำ `/deep-validate`
5. ถ้า fail -> ทำ `/resolve-errors` แล้ว recheck (max 3 รอบ)

### 8. Report And Suggest

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป: Category, Component, Old Version, New Version, Status
2. ระบุ breaking changes, skipped items, และ failed checks
3. ทำ `/suggest-next-action`

## Rules

### 1. Delegate, Don't Reimplement

- เรียก `/update-runtime-latest`, `/update-dependencies-latest`, `/update-all-program-in-computer`, `/update-config` แทนการทำเอง
- `update-version-latest` เป็น orchestrator ไม่ลงรายละเอียด command ของแต่ละ tool

### 2. Order Matters

- Runtimes ก่อน dependencies (เพราะ deps อาจต้องการ runtime ใหม่)
- Global tools ก่อนหรือคู่กับ runtimes ตาม package manager
- Config sync หลัง update เพื่อให้ version references ตรง

### 3. Safety

- ไม่อัปเดต major runtime/dependencies โดยไม่ถาม user
- สร้าง branch/dry-run ก่อน
- ไม่ force install หรือ downgrade

### 4. Scope Control

- ถ้า user ระบุเฉพาะ project -> ไม่ update global tools โดย default
- ถ้า user ระบุ `--global` หรือ computer -> รวม `/update-all-program-in-computer`
- ถ้าไม่ชัด -> `/ask-me`

### 5. Cross-Reference Sync

- ทุก version pin ต้องตรงกันระหว่าง `package.json#engines`, `mise.toml`, `.nvmrc`, CI, Docker
- ใช้ `mise.toml` เป็น single source of truth ถ้ามี
- ทำ `/update-references` ถ้ามี rename หรือ move

## Expected Outcome

- dependencies, runtimes, global tools, versioned config ทั้งหมดเป็น latest stable
- version references สอดคล้องกันทั่ว project
- ผ่าน `/run-check` และ `/deep-validate`
- รายงานครบทุก category พร้อม next action
