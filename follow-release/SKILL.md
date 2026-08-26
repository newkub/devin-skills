---
name: follow-release
description: เลือกและตั้งค่า release strategy สำหรับ npm, crates, Docker, VSCode และ monorepo versioning
---

## Goal

เลือกและตั้งค่า release strategy ทีเหมาะสมกับ project สำหรับ npm, crates.io, Docker, VS Code Marketplace, preview และ monorepo versioning พร้อม setup และ deploy บน platform ทีเลือก

## Scope

ใช้เมื่อ project ต้อง release ไปยัง external platforms หรือต้องจัดการ versioning, changelog และ preview releases สำหรับ:
- npm: ใช้ `auto`, `semantic-release` หรือ `release-it` สำหรับ automated npm publish
- crates.io: ใช้ `release-plz` หรือ `cargo-release` สำหรับ Rust crates
- Docker: ใช้ Docker Hub หรือ GHCR สำหรับ container images
- VS Code Marketplace: ใช้ `vsce` สำหรับ extension publish
- Preview: ใช้ `pkg.pr.new` หรือ Changesets Snapshot
- Monorepo: ใช้ Changesets สำหรับ versioning และ changelogs

## Execute

### 1. Detect Release Targets

> Goal: ระบุ platforms ที project จะ release

1. อ่าน `package.json` ตรวจสอบ `private`, `publisher`, `workspaces`
2. อ่าน `Cargo.toml` ถ้ามี Rust crate
3. อ่าน `Dockerfile` ถ้ามี container image
4. อ่าน `package.json` ตรวจสอบ `publisher` และ `engines.vscode` สำหรับ VS Code extension
5. ถาม user ถ้าไม่แน่ใจว่าต้องการ release แบบไหน

### 2. Choose Release Strategy

> Goal: เลือก strategy ทีเหมาะสม

ถ้าต้องการ release ไปยัง platform จริง:
- npm/bun: ทำ `/follow-tool-auto-it`, `/follow-tool-semantic-release` หรือ `/follow-tool-release-it`
- Rust: ทำ Step 3 (crates)
- Docker: ทำ Step 4 (Docker)
- VS Code: ทำ Step 5 (VS Code)

ถ้าต้องการ preview ทุก PR/commit:
- ทำ `/follow-tool-pkg-new` สำหรับ continuous preview releases

ถ้าต้องการ versioning/changelog ใน monorepo:
- ทำ `/follow-tool-changesets` สำหรับ manage versioning และ changelogs

### 3. Release To crates.io

> Goal: ตั้งค่า Cargo สำหรับ automated releases ลง crates.io

1. ตรวจสอบ `Cargo.toml` มี `name`, `version`, `authors`, `description`, `license`, `repository`, `homepage`, `keywords`, `categories`
2. ติดตั้ง `cargo install release-plz` หรือ `cargo install cargo-release` และ setup release-plz action
3. สร้าง config ใน `release-plz.toml` หรือ `.release.toml` กำหนด `changelog_config` แบบ conventional และ `release_branch: main`
4. เพิ่ม API token จาก crates.io เป็น `CARGO_REGISTRY_TOKEN` ใน GitHub secrets
5. สร้าง `.github/workflows/release.yml` กำหนด `permissions: contents write, pull-requests: write`, `fetch-depth: 0`, `persist-credentials: false` และ jobs `release-plz-release` + `release-plz-pr`

### 4. Release To Docker

> Goal: ตั้งค่า Docker images สำหรับ automated releases ลง Docker Hub หรือ GHCR

1. ตรวจสอบ `Dockerfile` มี base image, labels, multi-stage build และ `.dockerignore`
2. เลือก repository ระหว่าง Docker Hub กับ GitHub Container Registry แล้วกำหนด image name และ tags
3. สร้าง access token จาก Docker Hub หรือใช้ `GITHUB_TOKEN` สำหรับ GHCR
4. เพิ่ม `DOCKER_USERNAME`, `DOCKER_PASSWORD` เป็น environment variables
5. สร้าง `.github/workflows/release.yml` กำหนด `permissions: contents write, packages: write` และ trigger จาก push ไปยัง `main`

### 5. Release To VS Code Marketplace

> Goal: ตั้งค่า VS Code extensions สำหรับ automated releases ลง Marketplace

1. ตรวจสอบ `package.json` มี `publisher`, `name`, `version`, `displayName`, `description`, `repository`, `bugs`, `homepage`, `engines.vscode`, `categories`, `keywords`
2. ติดตั้ง `bun add -D @vscode/vsce` และใช้ `bunx vsce` ใน scripts
3. สร้าง publisher บน `marketplace.visualstudio.com` แล้วระบุใน `package.json`
4. สร้าง PAT token จาก Azure DevOps เป็น `VSCE_PAT` ใน environment variables แล้วรัน `vsce login publisher-name`
5. สร้าง `.github/workflows/release.yml` กำหนด `permissions: contents: write`, `VSCE_PAT` env และ trigger จาก push ไปยัง `main`

### 6. Combine Changesets And pkg.pr.new

> Goal: ใช้งานคู่กันได้อย่างปลอดภัย

- ใช้ `pkg.pr.new` สำหรับ preview ทุก PR/Commit โดยไม่กระทบ npm
- ใช้ `Changesets` เมื่อ merge เข้า `main` เพื่อ release จริงลง npm
- ถ้าต้องการ snapshot release ด้วย Changesets เพิ่ม script:
  ```json
  {
    "scripts": {
      "release:snapshot": "changeset version --snapshot canary && changeset publish --tag canary"
    }
  }
  ```

### 7. Compare Preview Options

> Goal: เลือก preview release tool ทีถูกต้อง

| คุณสมบัติ | `Changesets Snapshot` | `pkg.pr.new` |
| --- | --- | --- |
| ทีเก็บแพ็กเกจ | Publish ลง `npm Registry` จริง | ฝากไว้บน `CDN` ของ StackBlitz |
| วิธีติดตั้ง | `bun add package-name@0.0.0-snapshot-...` | `bun add https://pkg.pr.new/owner/repo` |
| ความสะอาด | เปรอะ `version history` บน npm | ไม่กระทบ `npm Registry` |
| การตั้งค่า | ต้องมี `NPM_TOKEN` และ Snapshot script | Zero Config ไม่ต้องใช้ Token |

### 8. Run Release

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

- npm: ตรวจสอบ `name`, `description`, `version`, `author`, `private: false`, `publishConfig.access: public`
- crates: ตรวจสอบ `name`, `version`, `authors`, `description`, `license`, `repository`, `homepage`, `keywords`, `categories`
- Docker: ตรวจสอบ `Dockerfile` valid, base image, labels, multi-stage build, `.dockerignore`
- VS Code: ตรวจสอบ `publisher`, `name`, `version`, `displayName`, `description`, `engines.vscode`, `repository`, `categories`, `keywords`

### 3. Authentication

- npm: ตรวจสอบ `NPM_TOKEN` ใน GitHub secrets หรือ `GITHUB_TOKEN`
- crates: ตรวจสอบ `CARGO_REGISTRY_TOKEN` ใน secrets หรือ trusted publishing
- Docker: ตรวจสอบ `DOCKER_USERNAME`, `DOCKER_PASSWORD` หรือ `GITHUB_TOKEN` สำหรับ GHCR
- VS Code: ตรวจสอบ `VSCE_PAT` จาก Azure DevOps ด้วย `vsce login`

### 4. GitHub Workflow

- กำหนด `permissions` ให้ตรงกับ platform
- ใช้ trigger จาก push ไปยัง `main` branch
- crates: ใช้ `fetch-depth: 0`, `persist-credentials: false`, `concurrency` สำหรับ release-pr job

### 5. Safety

- แยก workflow preview กับ release จริง
- ไม่ publish preview ลง npm จริงโดยไม่ตั้งใจ
- ตรวจสอบ tokens ก่อนรัน
- ใช้ `Changesets Snapshot` ต้องระวัง `version history` เปรอะ
- `pkg.pr.new` เหมาะกับ PR preview ไม่กระทบ npm Registry

## Expected Outcome

- Release strategy เหมาะสมกับ project
- npm, crates.io, Docker, VS Code Marketplace setup ถูกต้อง
- Tools ติดตั้งและตั้งค่าครบถ้วน
- Authentication tokens พร้อมใช้
- GitHub workflows ทำงานได้บน platform ทีเลือก
- Preview และ release จริงทำงานตาม flow
- ไม่มี conflict ระหว่าง snapshot กับ official versions
