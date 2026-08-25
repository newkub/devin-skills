---
name: follow-release
description: เลือกและตั้งค่า release strategy ครอบคลุม npm, crates, Docker, VSCode และ monorepo versioning
---

## Goal

เลือกและตั้งค่า release strategy ที่เหมาะสมกับ project ครอบคลุม npm, crates.io, Docker, VS Code Marketplace, preview และ monorepo versioning พร้อม setup และ deploy แต่ละ platform

## Scope

ใช้เมื่อ project ต้อง release ไปยัง external platforms หรือต้องจัดการ versioning, changelog และ preview releases ครอบคลุม:
- npm — Auto หรือ semantic-release สำหรับ automated npm publish
- crates.io — release-plz หรือ cargo-release สำหรับ Rust crates
- Docker — Docker Hub หรือ GHCR สำหรับ container images
- VS Code Marketplace — VSCE สำหรับ extension publish
- Preview — pkg.pr.new หรือ Changesets Snapshot
- Monorepo — Changesets สำหรับ versioning และ changelogs

## Execute

### 1. Detect Release Targets

> Goal: ระบุ platforms ที่ project จะ release

1. อ่าน `package.json` ตรวจสอบ `private`, `publisher`, `workspaces`
2. อ่าน `Cargo.toml` ถ้ามี Rust crate
3. อ่าน `Dockerfile` ถ้ามี container image
4. อ่าน `package.json` ตรวจสอบ `publisher` และ `engines.vscode` สำหรับ VS Code extension
5. ถาม user ถ้าไม่แน่ใจว่าต้องการ release แบบไหน

### 2. Choose Release Strategy

> Goal: เลือก strategy ที่เหมาะสม

ถ้าต้องการ release ไปยัง platform จริง:
- npm/bun: ทำ Step 3 (npm) หรือ `/follow-tool-auto-it` สำหรับ conventional commits
- Rust: ทำ Step 4 (crates)
- Docker: ทำ Step 5 (Docker)
- VS Code: ทำ Step 6 (VS Code)
- semantic-release: ทำ `/follow-tool-semantic-release`

ถ้าต้องการ preview ทุก PR/commit:
- ทำ `/follow-tool-pkg-new` สำหรับ continuous preview releases

ถ้าต้องการ versioning/changelog ใน monorepo:
- ทำ `/follow-tool-changesets` สำหรับ manage versioning และ changelogs

### 3. Release To npm

> Goal: ตั้งค่า Auto สำหรับ automated releases ไปยัง npm

1. ตรวจสอบ `package.json` มี `name`, `description`, `version`, `author` ครบ
2. ตั้งค่า `private: false` และ `publishConfig.access: public`
3. รัน `bun add -D auto` และเพิ่ม config ใน `package.json`
4. เพิ่ม script `release: auto shipit` และตั้งค่า `baseBranch` เป็น `main`
5. สร้าง NPM token (Automation token) และเพิ่ม `NPM_TOKEN` ใน GitHub secrets ด้วย `gh secret set NPM_TOKEN`
6. สร้าง `.github/workflows/release.yml` พร้อม `permissions: contents write, pull-requests write` และ trigger บน push ไป main

### 4. Release To crates.io

> Goal: ตั้งค่า Cargo สำหรับ automated releases ไปยัง crates.io

1. ตรวจสอบ `Cargo.toml` มี `name`, `version`, `authors`, `description`, `license`, `repository`, `homepage`, `keywords`, `categories`
2. รัน `cargo install release-plz` หรือ `cargo install cargo-release` หรือใช้ release-plz action
3. เพิ่ม config ใน `release-plz.toml` หรือ `.release.toml` พร้อม `changelog_config` conventional และ `release_branch: main`
4. สร้าง API token จาก crates.io และเพิ่ม `CARGO_REGISTRY_TOKEN` ใน GitHub secrets
5. สร้าง `.github/workflows/release.yml` พร้อม `permissions: contents write, pull-requests write`, `fetch-depth: 0`, `persist-credentials: false` และ `release-plz-release` + `release-plz-pr` jobs

### 5. Release To Docker

> Goal: ตั้งค่า Docker images สำหรับ automated releases ไปยัง Docker Hub หรือ GHCR

1. ตรวจสอบ `Dockerfile` มี base image, labels, multi-stage build และ `.dockerignore`
2. สร้าง repository บน Docker Hub หรือ GitHub Container Registry และตั้งค่า image name และ tags
3. สร้าง access token จาก Docker Hub หรือใช้ `GITHUB_TOKEN` สำหรับ GHCR
4. เพิ่ม `DOCKER_USERNAME`, `DOCKER_PASSWORD` ใน environment variables
5. สร้าง `.github/workflows/release.yml` พร้อม `permissions: contents write, packages write` และ trigger บน push ไป main

### 6. Release To VS Code Marketplace

> Goal: ตั้งค่า VS Code extensions สำหรับ automated releases ไปยัง Marketplace

1. ตรวจสอบ `package.json` มี `publisher`, `name`, `version`, `displayName`, `description`, `repository`, `bugs`, `homepage`, `engines.vscode`, `categories`, `keywords`
2. รัน `bun add -D @vscode/vsce` หรือ `npm install -g @vscode/vsce`
3. สร้าง publisher บน `marketplace.visualstudio.com` และเพิ่มใน `package.json`
4. สร้าง PAT token จาก Azure DevOps และเพิ่ม `VSCE_PAT` ใน environment variables หรือใช้ `vsce login publisher-name`
5. สร้าง `.github/workflows/release.yml` พร้อม `permissions: contents write`, `VSCE_PAT` env และ trigger บน push ไป main

### 7. Combine Changesets And pkg.pr.new

> Goal: ใช้งานคู่กันได้อย่างปลอดภัย

- ใช้ `pkg.pr.new` สำหรับ preview ทุก PR/Commit โดยไม่กระทบ npm
- ใช้ `Changesets` เมื่อ merge เข้า main เพื่อ release จริงลง npm
- ถ้าต้องการ snapshot release ด้วย Changesets เพิ่ม script:
  ```json
  {
    "scripts": {
      "release:snapshot": "changeset version --snapshot canary && changeset publish --tag canary"
    }
  }
  ```

### 8. Compare Preview Options

> Goal: เลือก preview release tool ที่ถูกต้อง

| คุณสมบัติ | `Changesets Snapshot` | `pkg.pr.new` |
| --- | --- | --- |
| ที่เก็บแพ็กเกจ | Publish ลง `npm Registry` จริง | ฝากไว้บน `CDN` ของ StackBlitz |
| วิธีติดตั้ง | `bun add package-name@0.0.0-snapshot-...` | `bun add https://pkg.pr.new/owner/repo` |
| ความสะอาด | เปรอะ `version history` บน npm | ไม่กระทบ `npm Registry` |
| การตั้งค่า | ต้องมี `NPM_TOKEN` และ Snapshot script | Zero Config ไม่ต้องใช้ Token |

### 9. Run Release

> Goal: Release ให้สำเร็จ

1. ตรวจสอบ tokens/permissions ก่อน release (`NPM_TOKEN`, `CARGO_REGISTRY_TOKEN`, `VSCE_PAT`, `DOCKER_PASSWORD`)
2. ทำ `/run-release` สำหรับ multi-platform release อัตโนมัติ
3. ตรวจสอบ tags, changelogs และ published artifacts

## Rules

### 1. Strategy Selection

- ใช้ `pkg.pr.new` สำหรับ preview ทุก Commit/PR
- ใช้ `Changesets` สำหรับ release จริงและ changelog
- ใช้ `semantic-release` หรือ `auto` สำหรับ conventional commit based release

### 2. Package Configuration

- npm: ต้องมี `name`, `description`, `version`, `author`, `private: false`, `publishConfig.access: public`
- crates: ต้องมี `name`, `version`, `authors`, `description`, `license`, `repository`, `homepage`, `keywords`, `categories`
- Docker: ต้องมี `Dockerfile` valid, base image, labels, multi-stage build, `.dockerignore`
- VS Code: ต้องมี `publisher`, `name`, `version`, `displayName`, `description`, `engines.vscode`, `repository`, `categories`, `keywords`

### 3. Authentication

- npm: ต้องมี `NPM_TOKEN` ใน GitHub secrets และ `GITHUB_TOKEN`
- crates: ต้องมี `CARGO_REGISTRY_TOKEN` ใน secrets หรือใช้ trusted publishing
- Docker: ต้องมี `DOCKER_USERNAME`, `DOCKER_PASSWORD` หรือ `GITHUB_TOKEN` สำหรับ GHCR
- VS Code: ต้องมี `VSCE_PAT` จาก Azure DevOps หรือ `vsce login`

### 4. GitHub Workflow

- ต้องมี `permissions` ที่เหมาะสมสำหรับแต่ละ platform
- ตั้งค่า trigger บน push ไป main branch
- crates: ต้องมี `fetch-depth: 0`, `persist-credentials: false`, `concurrency` สำหรับ release-pr job

### 5. Safety

- แยก workflow preview กับ release จริง
- ไม่ publish preview ลง npm จริงโดยไม่ตั้งใจ
- ตรวจสอบ tokens ก่อนรัน
- ใช้ `Changesets Snapshot` ต้องระวัง `version history` เปรอะ
- `pkg.pr.new` เหมาะกับ PR preview ไม่กระทบ npm Registry

## Expected Outcome

- Release strategy เหมาะสมกับ project
- npm, crates.io, Docker, VS Code Marketplace setup ครบถ้วน
- Tools ติดตั้งและตั้งค่าถูกต้อง
- Authentication tokens พร้อมใช้งาน
- GitHub workflows สร้างอัตโนมัติสำหรับแต่ละ platform
- Preview และ release จริงทำงานตาม flow
- ไม่มี conflict ระหว่าง snapshot และ official versions
