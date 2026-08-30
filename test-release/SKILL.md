---
name: test-release
description: สร้าง release artifact, รัน smoke test, และตรวจสอบก่อน publish จริง
related:
  - setup-release
  - run-release
  - ship
  - review-release
  - run-verify
  - run-check
  - run-test
  - setup-package
  - watch-release
  - resolve-errors
---

## Goal

Build release artifact ตาม platform แล้วรัน smoke test ก่อน publish เพื่อยื่นยันว่า artifact ใช้งานได้จริง

## Scope

ใช้หลัง build/prerelease และก่อน publish จริง
- รองรับ `npm`, `crates`, `vscode`, `webstore`, `docker`, `binary`
- ไม่ publish ในขั้นตอนนี้
- ถ้า test ไม่ผ่าน ให้ stop และแก้ไขก่อน release

## Execute

### 1. Detect Platform

> Goal: ระบุ platform ทีต้องทดสอบ

1. ตรวจ `package.json` มี `private: false` → `npm`
2. ตรวจ `package.json` มี `publisher` → `vscode`
3. ตรวจ `Cargo.toml` → `crates` หรือ `binary`
4. ตรวจ `manifest.json` → `webstore`
5. ตรวจ `Dockerfile` → `docker`
6. ถ้าหลาย platform → รันตามลำดับ
7. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Build Release Artifact

> Goal: สร้าง artifact ทีจะ publish

0. ถ้ามี artifact จาก step ก่อนหน้า เช่น `/run-release` prerelease หรือ CI และ version ตรง → ใช้ artifact เดิมได้
1. `npm`: รัน `npm run build` หรือ `bun run build` แล้วตรวจ `dist/`
2. `crates`: รัน `cargo build --release` แล้วตรวจ `target/release/`
3. `binary`: รัน build สำหรับ release แล้วตรวจ executable
4. `vscode`: รัน `vsce package` แล้วตรวจ `.vsix`
5. `webstore`: สร้าง zip หรือ validate ด้วย `chrome-webstore-upload validate`
6. `docker`: รัน `docker build -t <image>:test` แล้วตรวจ image

### 3. Smoke Test

> Goal: ตรวจสอบว่า artifact ใช้งานได้

1. `npm`: ติดตั้งลง temp dir ด้วย `npm pack` + `npm install <tarball>` แล้ว import ด้วย `node -e "require('...')"`
2. `crates`: รัน `cargo test --release` และ `cargo publish --dry-run`
3. `binary`: รัน executable ด้วย `--help`, `--version`, หรือ smoke command
4. `vscode`: validate `.vsix` ด้วย `vsce ls` หรือ `code --install-extension` ใน temp profile
5. `webstore`: validate ด้วย `chrome-webstore-upload validate` หรือ upload แบบ draft
6. `docker`: รัน `docker run --rm <image>:test --help` หรือ health check

### 4. Final Checks

> Goal: ตรวจสอบรายละเอียดทั่วไปของ artifact

1. ตรวจขนาดไฟล์/ภาพไม่ผิดปกติ
2. ตรวจ version ใน artifact ตรงกับ `package.json`, `Cargo.toml`, หรือ `manifest.json`
3. ตรวจ dependencies ไม่มี security issue ด้วย `npm audit`, `cargo audit`, หรือเครื่องมือที่ project กำหนด
4. ถ้ามี `CHANGELOG.md` entry สำหรับ version นี้ → ตรวจว่าครบ

### 5. Report

> Goal: สรุปผล test

1. ทำ `/report-table`: platform, artifact path, smoke test, status
2. รายงานขนาด, version, และ findings
3. ทำ `/suggest-next-action` เช่น `/run-release` หรือ `/resolve-errors`

## Rules

### 1. No Publish

- ไม่ publish ในขั้นตอน test
- ใช้ `--dry-run` หรือ draft mode เท่านั้นถ้าจำเป็น

### 2. Safe Cleanup

- ใช้ temp directory สำหรับ install test
- ล้าง temp files/artifacts หลัง test ถ้าไม่จำเป็น

### 3. Stop on Failure

- ถ้า smoke test ไม่ผ่าน → stop และทำ `/resolve-errors`
- ไม่ข้ามไป `/run-release` ถ้า test ไม่ผ่าน

### 4. No Hardcoded Secrets

- ใช้ env vars สำหรับ tokens ถ้าต้อง validate กับ store
- ไม่ hardcode credentials

### 5. No Force

- ไม่ใช้ `--force` หรือ `--force-with-lease`
- ไม่ rewrite history

- ใช้ /setup-release ถ้าจำเป็น
- ใช้ /ship ถ้าจำเป็น
- ใช้ /review-release ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /setup-package ถ้าจำเป็น
- ใช้ /watch-release ถ้าจำเป็น

## Expected Outcome

- Release artifact ถูกสร้างสำเร็จตาม platform
- Smoke tests ผ่านตาม platform
- ไม่มี publish เกิดขึ้นในขั้นตอนนี้
- รายงาน test results ชัดเจน
