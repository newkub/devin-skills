---
name: setup-package
description: ตั้งค่า package manifest ให้พร้อม build, publish และ release
argument-hint: "[path]"
related:
  - follow-package-manifest
  - follow-monorepo
  - setup-cicd
  - setup-release
  - run-verify
  - run-release
  - use-scripts
  - review-config
---

## Goal

ตั้งค่า package manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) ให้พร้อมสำหรับ build, verify, publish และ release

## Scope

ใช้ครั้งเดียวตอนเริ่มโปรเจกต์ หรือเมื่อ package manifest ไม่พร้อม publish
ไม่รัน build/publish/release เอง

## Execute

### 1. Detect Ecosystem

1. ถ้ามี `package.json` → Node/Bun ecosystem
2. ถ้ามี `Cargo.toml` → Rust
3. ถ้ามี `pyproject.toml` หรือ `setup.py` → Python
4. ถ้ามี `go.mod` → Go
5. ถ้ามีหลาย ecosystems → ทำทีละตัว
6. ถ้าไม่มีอันใดเลย → stop และ report

### 2. Setup Node/Bun package.json

1. ตรวจสอบ required fields: `name`, `version`, `description`, `license`, `repository`, `homepage`, `files`
2. ถ้า `private: true` → ถาม user ว่าจะ release public ไหม ถ้าใช่ → เปลี่ยน `private` เป้น `false`
3. ตรวจ `files` ต้องระบุสิ่งทีจะ publish (เช่น `dist`, `src`, `README.md`, `LICENSE`)
4. ตรวจ `exports` หรือ `main` ให้ชี้ไปยัง build output
5. ตรวจ `scripts` ต้องมี `build`, `test:all`, `verify` (ไม่มี `release` — ใช้ `/setup-release` หรือ CI/CD workflow)
6. ถ้าขาด field → ให้ user กรอก หรือใช้ค่า default จาก project
7. ทำ `/follow-package-manifest` เพื่อปรับ scripts ให้สมบูรณ์

### 3. Setup Rust Cargo.toml

1. ตรวจสอบ `package.name`, `version`, `description`, `license`, `repository`, `categories`, `keywords`, `edition`, `rust-version`
2. ถ้าขาด → ให้ user กรอก หรือใช้ค่า default
3. ตรวจ `[[bin]]` หรือ `[lib]` ตาม project type
4. ตรวจ `workspace` ถ้าเป้น monorepo → `/follow-monorepo`

### 4. Setup Python pyproject.toml

1. ตรวจสอบ `project.name`, `version`, `description`, `license`, `readme`, `requires-python`, `classifiers`
2. ตรวจ `build-system` มี `setuptools`, `hatchling`, หรือ `flit`
3. ถ้าขาด → ให้ user กรอก
4. ตรวจ `project.scripts` ถ้ามี CLI

### 5. Setup Go go.mod

1. ตรวจ `module` path
2. ตรวจ `go` version
3. ถ้าไม่มี `LICENSE` หรือ `README.md` → แนะนำเพิ่ม

### 6. Validate

1. ทำ `/review-config` เพื่อตรวจ package manifest
2. ทำ `/run-verify` เพื่อตรวจ build/test ผ่าน
3. ถ้า verify ไม่ผ่าน → แก้ไขและ retry สูงสุด 3 ครั้ง

## Rules

### 1. Required Fields

- ทุก ecosystem ต้องมี name, version, description, license
- Node/Bun: ต้องมี repository, homepage, files, exports หรือ main
- Rust: ต้องมี categories, keywords, edition, rust-version
- Python: ต้องมี requires-python, readme, build-system
- Go: ต้องมี module path และ go version

### 2. Scripts

- ไม่ใส่ `release` script ลง package manifest
- ใช้ `build`, `test:all`, `verify` เป้นหลัก
- `verify` ควรรวม `check && test` หรือ `lint && typecheck && test`

### 3. Monorepo

- ถ้าเป้น monorepo ให้ทำ `/follow-monorepo` ก่อน
- workspace packages ไม่ต้องมี `private: false` ถ้า publish ที root level

### 4. No Publish

- `setup-package` ไม่ publish package
- publish ให้ใช้ `/publish-package-to-registry` หรือ `/run-release`

## Expected Outcome

- package manifest มี required fields ครบถ้วน
- ไม่มี `release` script ใน package manifest
- `build`, `test:all`, `verify` scripts พร้อมใช้
- package พร้อม publish/release
- ผ่าน `/run-verify`
