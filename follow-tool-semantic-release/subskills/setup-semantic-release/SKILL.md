---
name: follow-tool-semantic-release-setup-semantic-release
description: ติดตั้ง semantic-release และตั้งค่า CI auth tokens สำหรับ automated releases
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-tool-github-actions
  - follow-tool-git
  - run-release
---

## Goal

ติดตั้ง `semantic-release` และตั้งค่า CI authentication (`GITHUB_TOKEN`, `NPM_TOKEN`, OIDC) ให้ automated versioning และ publishing ทำงานได้

## Scope

ใช้สำหรับ projects ที่ใช้ conventional commits และต้องการ automated release — install, auth, CI integration. รายละเอียด branches/plugins config อยู่ใน `subskills/config-semantic-release/SKILL.md`

- ถ้า `semantic-release` ติดตั้งและ release config มีอยู่แล้ว → verify เท่านั้น

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ readiness ก่อน setup

1. ตรวจ `package.json` — `name`, `version`, `repository` URL ต้องถูกต้อง (semantic-release ใช้ repository เพื่อหา GitHub repo)
2. ตรวจว่า project ใช้ conventional commits — `feat`, `fix`, `BREAKING CHANGE` เป็นหัวใจของ version bump
3. ตรวจ Node.js version ตรง requirement (ดู parent skill หรือ official docs)
4. ถ้า `semantic-release` อยู่ใน devDependencies แล้ว → skip ไป verify

### 2. Install

> Goal: ติดตั้ง semantic-release และ core plugins

1. รัน `bun add -D semantic-release` (หรือ package manager ของ project)
2. ติดตั้ง plugins ตามต้องการ เช่น `bun add -D @semantic-release/changelog @semantic-release/git` — plugin list ดู [references/semantic-release.md](../../references/semantic-release.md)
3. ยืนยันด้วย `bunx semantic-release --version`

### 3. Setup Auth Tokens

> Goal: ตั้งค่า authentication สำหรับ CI

1. `GITHUB_TOKEN` — ใช้ built-in `${{ secrets.GITHUB_TOKEN }}` ใน GitHub Actions พร้อม permissions `contents: write`, `pull-requests: write`, `issues: write`
2. `NPM_TOKEN` — สร้าง npm automation token แล้วตั้งเป็น repository secret — ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret`
3. Prefer trusted publishing (OIDC) สำหรับ npm ถ้าได้ — ไม่ต้องใช้ long-lived token
4. ตรวจ secrets ด้วย `gh secret list`

### 4. CI Workflow

> Goal: สร้าง release workflow

1. สร้าง/แก้ workflow — release job รันหลัง tests ผ่าน (`needs: test`)
2. ใช้ `fetch-depth: 0` ใน checkout — semantic-release ต้องการ full git history
3. รัน `bunx semantic-release` ใน release job — trigger เฉพาะ push ไป release branch ห้ามรันบน PR
4. ตั้ง `permissions` ตาม step 3.1

### 5. Verify

> Goal: ยืนยันด้วย dry run

1. รัน `bunx semantic-release --dry-run` local — ตรวจ version ที่จะได้และ release notes
2. ใช้ `--debug` ถ้าต้องการ verbose output
3. ถ้า version ไม่ตรงคาด → ตรวจ conventional commits ใน history แล้วแก้ config (ดู `subskills/config-semantic-release/SKILL.md`)
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Commits

- conventional commits ทุก commit — ไม่ใช่ → ไม่มี release
- ตรวจ commit history ก่อนคาดหวัง version bump

### 2. Auth

- tokens ผ่าน secrets เท่านั้น ห้าม hard-code
- prefer OIDC/trusted publishing แทน long-lived tokens

### 3. CI Discipline

- รัน release ใน CI เท่านั้น ยกเว้น local `--dry-run`
- `fetch-depth: 0` บังคับ — shallow clone = version detection พัง

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น

## Expected Outcome

- `semantic-release` ติดตั้งพร้อม plugins ที่ต้องการ
- CI workflow รัน release อัตโนมัติหลัง tests ผ่าน
- `--dry-run` แสดง version/release notes ถูกต้อง
