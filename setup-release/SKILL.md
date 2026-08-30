---
name: setup-release
description: ตั้งค่า release tool, workflow และ changelog generation
argument-hint: "[path]"
related:
  - run-release
  - ship-release
  - setup-cicd
  - setup-package
  - test-release
  - follow-release
  - follow-tool-changelogen
  - follow-tool-changesets
  - follow-tool-semantic-release
  - gen-changelog-md
---

## Goal

ตั้งค่า release tool และ CI/CD workflow สำหรับ release บน tag `v*` พร้อม changelog generation

## Scope

ใช้ครั้งเดียว ไม่รัน release เอง
ครอบคลุม npm, crates, vscode, webstore, docker

## Execute

### 1. Detect Release Needs

1. ตรวจ package manifest จาก project files
2. ระบุ platforms ทีต้อง release:
   - `package.json` มี `private: false` → `npm`
   - `package.json` มี `publisher` → `vscode`
   - `Cargo.toml` → `crates`
   - `manifest.json` → `webstore`
   - `Dockerfile` → `docker`
3. ถ้า package manifest ไม่พร้อม → `/setup-package` ก่อน

### 2. Choose Release Tool

1. ถ้า project ใช้ conventional commits และต้องการ PR-based release → `/follow-tool-changesets`
2. ถ้า project ใช้ git tags เป้นหลัก → `/follow-tool-changelogen` หรือ `/gen-changelog-md`
3. ถ้า project ใช้ npm publish ง่ายๆ → `/follow-tool-semantic-release`
4. ถ้า project เป้น Rust → `/follow-tool-cargo`
5. ถ้ามีหลาย platform → ใช้ release tool ทีรองรับทั้งหมด หรือแยก workflow ตาม platform

### 3. Setup Release Workflow

1. สร้าง `.github/workflows/release.yml` trigger บน `push` tag `v*`
2. workflow รัน verify, build, แล้ว publish ตาม platform:
   - npm: `npm publish`
   - crates: `cargo publish`
   - vscode: `npx vsce publish`
   - webstore: `npx chrome-webstore-upload`
   - docker: `docker build` + `docker push`
3. ใส่ secrets ใน `env`:
   - `NPM_TOKEN`
   - `CARGO_REGISTRY_TOKEN`
   - `VSCE_PAT`
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `REFRESH_TOKEN`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
4. ถ้าใช้ changesets → ใช้ `changesets/action` ใน workflow

### 4. Setup Changelog

1. ถ้าใช้ `/gen-changelog-md` → เพิ่มคำสั่งรัน script หรือ `bunx run skills/gen-changelog-md/scripts/gen-release-md`
2. ถ้าใช้ `changelogen` → เพิ่ม `changelogen` เป้น devDependency
3. ถ้าใช้ `changesets` → รัน `changeset init` สร้าง `.changeset/config.json`

### 5. Validate

1. ทำ `/review-config` ตรวจ release config
2. ทำ `/run-verify` ตรวจ verify/build ผ่าน
3. ถ้า platform รองรับ dry-run (เช่น `npm publish --dry-run`, `cargo publish --dry-run`) → รัน
4. ถ้ามี release artifact ทีต้อง smoke test → ทำ `/test-release`
5. ถ้า validate ไม่ผ่าน → แก้ไขและ retry สูงสุด 3 ครั้ง

## Rules

### 1. Condition

- release workflow trigger บน tag `v*` เท่านั้น
- ไม่ release ทุก merge
- `/run-release` ต้อง check conditions ก่อน publish

### 2. No Package Release Script

- ไม่ใส่ `release` script ใน package manifest
- ไม่ใส่ `prerelease` ทีทำ publish
- `prerelease` ได้เฉพาะ build/package

### 3. Secrets

- ใช้ `NPM_TOKEN`, `VSCE_PAT`, `CARGO_REGISTRY_TOKEN`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `DOCKER_USERNAME`, `DOCKER_PASSWORD` จาก GitHub Secrets
- ไม่ hardcode secrets

### 4. Tool Selection

- ถ้าไม่แน่ใจ → ใช้ `/follow-release` ก่อน
- ถ้าใช้ changesets → `/follow-tool-changesets`
- ถ้าใช้ semantic-release → `/follow-tool-semantic-release`
- ถ้าใช้ changelogen → `/follow-tool-changelogen`

## Expected Outcome

- release tool ถูกตั้งค่าถูกต้อง
- `.github/workflows/release.yml` สร้างพร้อม trigger บน tag `v*`
- secrets requirements ชัดเจน
- changelog generation ถูกตั้งค่า
- ไม่มี `release` script ใน package manifest
- `/run-verify` ผ่าน
