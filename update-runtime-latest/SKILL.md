---
name: update-runtime-latest
description: อัปเดต language runtimes และ dev tool versions ใน project และ global ให้เป็น latest
related:
  - update-version-latest
  - update-all-program-in-computer
  - follow-tool-mise
  - follow-my-package-manager
  - follow-runtime-bun
  - follow-lang-nodejs
  - follow-lang-python
  - follow-lang-rust
---

## Goal

อัปเดต language runtimes และ version pins (Bun, Node.js, Python, Rust, Go, Java, .NET) ใน project และ global ให้เป็น latest stable version

## Scope

ใช้เมื่อ project ต้องการ upgrade runtime version หรือ sync version pins ต่างๆ (`package.json#engines`, `mise.toml`, `.nvmrc`, `rust-toolchain.toml`, `go.mod`, `.python-version`, `Dockerfile`) รองรับทั้ง project-level และ global-level โดยไม่แก้ source code logic

## Execute

### 1. Detect Runtime Version Pins

> Goal: รู้ว่ามี runtime ใดบ้าง และ version ปัจจุบัน

1. รายการไฟล์ version pins:
   - `package.json` -> `engines`
   - `mise.toml`, `.tool-versions` -> tool versions
   - `.nvmrc`, `.node-version`
   - `.python-version`, `pyproject.toml` -> `requires-python`
   - `rust-toolchain.toml`
   - `go.mod` -> `go` directive
   - `global.json` -> `sdk` (.NET)
   - `Dockerfile` -> `FROM` base image
2. รัน `--version` ของแต่ละ runtime เพื่อบันทึก current version
3. ระบุ target scope: project หรือ global (`-g` สำหรับ mise, `rustup default stable`, ฯลฯ)

### 2. Choose Version Manager

> Goal: เลือก version manager ที่พร้อมใช้

1. ทำ `/follow-my-package-manager` เพื่อ detect package manager ที่มี
2. ถ้ามี `mise` ให้ใช้ `mise` เป็นหลัก (project: `mise use`, global: `mise use -g`)
3. ถ้าไม่มี `mise` ใช้ runtime-specific manager:
   - Node: `nvm`, `fnm`, `n`
   - Python: `pyenv`, `conda`
   - Rust: `rustup`
   - Go: `gvm` หรือ official installer
   - Java: `sdkman`
   - .NET: installer หรือ package manager
4. บันทึก manager ที่เลือก

### 3. Update Bun Runtime

> Goal: Bun เป็น latest

1. `bun --version` บันทึก current
2. `bun upgrade` หรือ `bun upgrade --canary` (ถ้า user ระบุ)
3. ถ้าใช้ `mise`: `mise use bun@latest` หรือ `mise use -g bun@latest`
4. อัปเดต `mise.toml`, `package.json#engines` ให้ตรงกับ version ใหม่
5. `bun --version` ยืนยัน

### 4. Update Node.js Runtime

> Goal: Node.js เป็น latest LTS หรือ latest

1. หา latest version: `mise latest node`, `nvm ls-remote`, `fnm ls-remote`
2. ถ้าใช้ `mise`: `mise use node@latest` หรือ `mise use -g node@latest`
3. ถ้าใช้ `nvm`: `nvm install node`, `nvm use node`, `nvm alias default node`
4. ถ้าใช้ `fnm`: `fnm install --lts`, `fnm use --lts` หรือ `fnm use latest`
5. อัปเดต `.nvmrc`, `.node-version`, `package.json#engines.node`, `mise.toml`
6. `node --version` ยืนยัน

### 5. Update Python Runtime

> Goal: Python เป็น latest

1. หา latest version: `mise latest python`, `pyenv install --list`
2. ถ้าใช้ `mise`: `mise use python@latest` หรือ `mise use -g python@latest`
3. ถ้าใช้ `pyenv`: `pyenv install <latest>`, `pyenv global <latest>` หรือ `pyenv local <latest>`
4. อัปเดต `.python-version`, `pyproject.toml#requires-python`, `mise.toml`
5. `python --version` ยืนยัน

### 6. Update Rust Runtime

> Goal: Rust เป็น latest stable

1. `rustup update stable` หรือ `rustup toolchain install stable`
2. `rustup default stable` ถ้าจำเป็น
3. อัปเดต `rust-toolchain.toml` -> `channel = "stable"` หรือ pin latest version
4. `rustc --version` ยืนยัน
5. ถ้ามี `Cargo.toml` ตรวจ `rust-version` ให้ตรงกับ toolchain

### 7. Update Go Runtime

> Goal: Go เป็น latest

1. หา latest version: `mise latest go`, official Go release page
2. ถ้าใช้ `mise`: `mise use go@latest` หรือ `mise use -g go@latest`
3. ถ้าใช้ `gvm`: `gvm install go<version>`, `gvm use go<version>`
4. อัปเดต `go.mod` -> `go <version>` ด้วย `go mod edit -go=<version>`
5. `go mod tidy` ถ้าจำเป็น
6. `go version` ยืนยัน

### 8. Update Other Runtimes

> Goal: Java, .NET, และ runtime อื่นๆ เป็น latest

1. Java:
   - `mise use java@latest` หรือ `sdkman` -> `sdk install java <version>`, `sdk use java <version>`
   - อัปเดต `mise.toml` หรือ `.sdkmanrc`
2. .NET:
   - `dotnet --version` บันทึก current
   - ติดตั้ง latest SDK ผ่าน installer หรือ package manager (`winget`, `scoop`, `brew`)
   - อัปเดต `global.json` -> `sdk/version`
3. ระบุ runtime อื่นที่พบ เช่น Ruby, PHP, แล้วใช้ package manager ที่เหมาะสม

### 9. Sync Version Pins

> Goal: version pins ทุกไฟล์ตรงกัน

1. ตรวจสอบ `package.json#engines` ตรงกับ `mise.toml`, `.nvmrc`, `.python-version`
2. ตรวจสอบ `Dockerfile` `FROM` tag ตรงกับ runtime ที่อัปเดต
3. ตรวจสอบ `.github/workflows` ที่ระบุ `node-version`, `bun-version`, `python-version`, `go-version` ตรงกับปัจจุบัน
4. ตรวจสอบ `.devcontainer/devcontainer.json` image ตรงกับ runtime
5. ถ้ามี `mise.toml` -> ใช้ `mise use <tool>@<version>` ให้ทุก tool เป็น latest ตาม need
6. บันทึกไฟล์ที่ถูกแก้ไข

### 10. Verify And Report

> Goal: ตรวจสอบว่า runtime ทำงานได้

1. รัน `--version` ของทุก runtime ที่อัปเดต
2. รัน project checks:
   - `bun run typecheck`
   - `bun run test` หรือ `cargo test` หรือ `go test`
3. ทำ `/run-check` ถ้ามี
4. ใช้ `/report-table` สรุป: Runtime, Old Version, New Version, Manager, Status
5. ทำ `/suggest-next-action`

## Rules

### 1. Safety

- สร้าง branch ใหม่ก่อนอัปเดต runtime เสมอ
- ถ้า major version change มี breaking changes สูง -> ถาม user ก่อน
- ไม่ downgrade runtime
- ทำ dry run สำหรับ config ที่มีผลกระทบกว้าง

### 2. Order

- อัปเดต runtime ก่อน dependencies (เพราะ dependencies อาจต้องใช้ runtime ใหม่)
- global tools -> project pins -> install -> verify

### 3. Version Pinning

- ใช้ exact version สำหรับ CI/CD, Docker, `.nvmrc`
- ใช้ range/caret ใน `package.json#engines` เฉพาะถ้า project ต้องการยืดหยุ่น
- ใช้ `mise.toml` เป็น single source of truth ถ้ามี

### 4. Ecosystem Awareness

- ใช้ `mise` เป็นหลักถ้าติดตั้ง
- ถ้าไม่มี mise ใช้ runtime-specific manager ที่เหมาะสม
- ใช้ `/follow-lang-*` skills สำหรับ best practices ของแต่ละภาษา

### 5. Breaking Changes

- อ่าน release notes / migration guide ก่อน major version upgrade
- ตรวจสอบ `rust-version`, `go` directive, `engines` ให้ compatible
- ถ้า test fail หลัง upgrade -> ทำ `/resolve-errors` ก่อน commit

- ใช้ /update-version-latest ถ้าจำเป็น
- ใช้ /update-all-program-in-computer ถ้าจำเป็น
- ใช้ /follow-tool-mise ถ้าจำเป็น
- ใช้ /follow-runtime-bun ถ้าจำเป็น
- ใช้ /follow-lang-nodejs ถ้าจำเป็น
- ใช้ /follow-lang-python ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น

## Expected Outcome

- ทุก runtime ที่พบถูกอัปเดตเป็น latest stable version
- version pins (`mise.toml`, `.nvmrc`, `package.json#engines`, `rust-toolchain.toml`, `go.mod`, ฯลฯ) สอดคล้องกัน
- runtime ทำงานได้จริงผ่าน `--version` และ project checks
- รายงาน before-after พร้อม next action
