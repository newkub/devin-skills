---
name: release-package-to-registry
description: Auto-detect registry และ release package ไปยัง npm, crates.io หรือ registry อืน
related:
  - follow-secret-manager
  - run-release
  - run-verify-on-local
  - gen-changelog-md
  - follow-runtime-bun
  - follow-create-cli
  - list-my-npm-packages
  - use-my-packages-on-registry
  - ship
  - ask-me
---

## Goal

Auto-detect registry จาก project manifest แล้ว release package ไปยัง npm, crates.io หรือ registry ที่กำหนด

## Scope

ใช้สำหรับ release package หนึ่ง package ไปยัง registry ที่ detect ได้จาก project files

## Execute

### 1. Detect Registry

> Goal: ระบุ registry และ package manager ของ project

1. อ่าน `package.json` → npm/bun registry
2. อ่าน `Cargo.toml` → crates.io
3. อ่าน `pyproject.toml` → PyPI
4. ถ้า `package.json` มี `private: true` → ไม่ release ยกเว้น user confirm
5. ถ้า detect ไม่ได้หรือหลาย registry → ทำ `/ask-me`

### 2. Verify

> Goal: ตรวจสอบคุณภาพก่อน release

1. ทำ `/run-verify-on-local`
2. ตรวจสอบ version ถูกต้องตาม semver
3. ทำ `/gen-changelog-md` หรือตรวจสอบ `CHANGELOG.md`
4. ตรวจสอบ authentication:
   - npm: `npm whoami`
   - cargo: `cargo login` หรือ `CARGO_REGISTRY_TOKEN`
   - python: `twine check` + token

### 3. Build

> Goal: Build package ก่อน publish

1. npm/bun: `bun run build` หรือ `npm run build`
2. cargo: `cargo build --release`
3. python: `python -m build`
4. ถ้า build ไม่ผ่าน → แก้ไขก่อน release

### 4. Dry Run

> Goal: ทดสอบ publish ก่อนของจริง

1. npm/bun: `npm publish --dry-run` หรือ `bun publish --dry-run`
2. cargo: `cargo publish --dry-run`
3. python: `twine check dist/*` แล้ว `twine upload --repository testpypi dist/*` ถ้าจำเป็น
4. ตรวจสอบ warnings และ size limits

### 5. Publish

> Goal: Release package ไปยัง registry

1. npm/bun: `bun publish` หรือ `npm publish`
2. cargo: `cargo publish`
3. python: `twine upload dist/*`
4. ถ้า release ไม่สำเร็จ → แก้ไขแล้วรันใหม่

### 6. Verify Publish

> Goal: ยืนยัน release สำเร็จ

1. ตรวจสอบ registry ว่ามี version ใหม่
2. ทำ `/list-my-npm-packages` ถ้าเป็น npm เพื่อยืนยัน
3. ทำ `/suggest-next-action`

## Rules

### 1. Auto-Detection

- ใช้ manifest หลักของ project ในการระบุ registry
- ถ้าหลาย manifest ให้ user เลือก หรือ release ตามลำดับ
- ไม่ assume registry ถ้าไม่มี manifest

### 2. Verify Before Publish

- ทำ `/run-verify-on-local` เสมอก่อน release
- version ต้อง bump ก่อน publish
- changelog ต้อง gen ด้วย `/gen-changelog-md`

### 3. Dry Run First

- ทำ dry run ก่อน publish จริงทุกครั้งถ้าเป็นไปได้
- ตรวจสอบ package contents และ warnings

### 4. Authentication And Security

- ตรวจสอบ tokens ก่อน release
- ไม่ expose secrets ใน output
- ใช้ `/follow-secret-manager` สำหรับจัดการ tokens แล้ว sync ไป CI/CD หรือใช้ `gh secret set` แบบ manual

### 5. Scripts

- ถ้าต้อง process ข้อมูลซับซ้อน → ทำ `/use-scripts`
- ใช้ `/create-files-in-os-temp` สำหรับ temp files หรือ build artifacts ชั่วคราว

## Expected Outcome

- Package ถูก release ไปยัง registry ที่ detect ได้
- Version, changelog, และ build ถูกต้อง
- Verify ผ่านก่อน release
- Dry run ผ่านก่อนของจริง
- ไม่ expose secrets