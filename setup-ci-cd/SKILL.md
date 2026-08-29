---
name: setup-ci-cd
description: ตรวจจับ platform และตั้งค่า CI/CD config files, secrets และ workflows
related:
  - follow-tool-github-actions
  - follow-secret-manager
  - open-github-secrets
  - follow-tasks
  - review-delivery
  - review-config
  - run-verify
  - ship-to-cloud
  - report-table
  - suggest-next-action
---

## Goal

ตรวจจับ CI/CD platform ที project ใช้ แล้วตั้งค่า workflow files, secrets, และ package scripts ให้พร้อมรัน verify, test, build, deploy, release บน CI

## Scope

ใช้ครั้งเดียวตอน setup หรือเมื่อ CI/CD config ไม่พร้อม ไม่รวมรัน pipeline, commit, push, release, หรือ deploy

ถ้าต้องการรัน cloud verify หรือ ship บน cloud ให้ใช้ `/run-verify` หรือ `/ship-to-cloud` แทน

## Execute

### 1. Detect Platform

> Goal: รู้ว่า project ใช้ CI/CD platform อะไร

1. ตรวจหาไฟล์ config ทีมีอยู่:
   - GitHub Actions: `.github/workflows/*.{yml,yaml}`
   - GitLab CI: `.gitlab-ci.yml`
   - Azure DevOps: `azure-pipelines.yml`
   - CircleCI: `.circleci/config.yml`
   - Jenkins: `Jenkinsfile`
   - Cloudflare Pages: `wrangler.toml`, `wrangler.jsonc`
   - Vercel: `vercel.json`
2. ถ้าพบหลาย platform → เลือกตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins → Cloudflare → Vercel
3. ถ้าไม่พบ → ทำ `/ask-me` ถาม user หรือ default เป็น GitHub Actions

### 2. Verify Package Scripts

> Goal: มั่นใจว่า package manifest มี scripts ที CI จะเรียก ตามขนาด project

1. อ่าน `package.json` หรือ `Cargo.toml` หรือไฟล์ manifest ที่เหมาะสม
2. ตรวจสอบขนาด project:
   - ถ้า project เล็ก (ไม่ monorepo, build/test ไม่หนัก) → `verify` ต้องรวม `scan`, `lint`, `typecheck`, `test`, `build` ใน package manifest เลย
   - ถ้า project ใหญ่ (monorepo หรือ build/test หนัก) → CI/CD pipeline จะรัน full suite แทน; package manifest ต้องมี `test:all`, `build` และ `verify` อย่างน้อย `check && test`
3. ถ้าไม่มี scripts `verify`, `test:all`, `build` → ทำ `/follow-tasks` เพื่อตั้งค่า
4. ตรวจว่า `verify` ครบตามขนาด project
5. ถ้า project ไม่มี package manifest → ทำ `/review-delivery` เพื่อตั้งค่า

### 3. Setup Secrets

> Goal: ตั้งค่า secrets ที CI/CD ต้องใช้

1. ทำ `/follow-secret-manager` เพื่อจัดการ secrets อย่างปลอดภัย
2. ถ้าใช้ GitHub Actions → เปิดหน้า GitHub Secrets ด้วย `/open-github-secrets`
3. ตรวจสอบว่ามี secrets ทีจำเป็น เช่น `NPM_TOKEN`, `CARGO_REGISTRY_TOKEN`, `CLOUDFLARE_API_TOKEN`, `VERCEL_TOKEN`
4. ไม่ hardcode secrets ลงในไฟล์ config

### 4. Create Workflow Files

> Goal: สร้าง CI/CD config files ตาม platform

#### GitHub Actions

1. ทำ `/follow-tool-github-actions` เพื่อตั้งค่า workflows ครบถ้วน
2. ถ้าอยากสร้างเอง → สร้าง `.github/workflows/ci.yml` ด้วยเนื้อหาพื้นฐาน:

```yaml
name: ci
on:
  push:
    branches: [main, master]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install
      - run: bun run verify
  test:
    runs-on: ubuntu-latest
    needs: verify
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run test:all
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
```

3. เพิ่ม `deploy.yml` หรือ `release.yml` ตามความต้องการ โดยเรียก `bun run deploy` หรือ `bun run release`

#### GitLab CI

สร้าง `.gitlab-ci.yml` ด้วย stages: `verify`, `test`, `build`, `deploy`, `release`

#### Azure DevOps

สร้าง `azure-pipelines.yml` ด้วย jobs: `verify`, `test`, `build`, `deploy`

#### CircleCI

สร้าง `.circleci/config.yml` ด้วย workflows: `verify`, `test`, `build`, `deploy`

#### Cloudflare Pages

ตรวจ `wrangler.toml` แล้วเพิ่ม GitHub Actions workflow สำหรับ deploy ถ้าขาด

#### Vercel

ตรวจ `vercel.json` แล้วเพิ่ม GitHub Actions workflow หรือใช้ Vercel Git Integration

### 5. Validate Config

> Goal: ตรวจสอบว่า CI/CD config ถูกต้อง

1. ทำ `/review-config` เพื่อตรวจ drift และ duplication
2. ทำ `/review-delivery` เพื่อตรวจว่า config ครอบคลุม security, testing, deployment
3. รัน dry run ถ้า platform รองรับ (เช่น `act` สำหรับ GitHub Actions) — optional
4. ถ้ามี syntax error → แก้ไขก่อนจบ

### 6. Report

> Goal: สรุปสถานะ setup

1. ใช้ `/report-table` สรุป: platform, workflow files, missing scripts, missing secrets, next action
2. ทำ `/suggest-next-action`

## Rules

### 1. Setup Only

- `setup-ci-cd` ทำเฉพาะตั้งค่า config ไม่รัน pipeline
- ไม่ commit, ไม่ push, ไม่ deploy, ไม่ release
- ถ้าต้องการรัน pipeline ให้ใช้ `/run-verify` หรือ `/ship-to-cloud`

### 2. Platform First

- ตรวจหา platform ทีมีอยู่ก่อนสร้างไฟล์ใหม่
- ถ้ามี config แล้ว → ตรวจสอบและเติมส่วนทีขาด ไม่ทับซ้ำ
- ถ้าไม่พบ → default เป็น GitHub Actions หรือถาม user

### 3. Secrets Safety

- ใช้ `/follow-secret-manager` หรือ GitHub Secrets / GitLab CI Variables
- ไม่ hardcode secrets ลง workflow files
- ไม่ log secrets

### 4. Package Scripts

- ต้องมี package scripts ก่อนสร้าง CI workflow
- project เล็ก: `verify` ต้องรวม `scan`, `lint`, `typecheck`, `test`, `build` ใน package manifest เลย
- project ใหญ่: CI/CD pipeline รัน full suite; package manifest มี `test:all`, `build` และ `verify` อย่างน้อย `check && test`
- `test:all` ควรรวม unit, integration, e2e, coverage ตาม project

### 5. No Auto Commit

- ไม่ commit หรือ push config files โดยอัตโนมัติ
- ถ้า user ต้องการ commit → ทำ `/git-commit` หรือ `/ship` หลัง setup

## Expected Outcome

- CI/CD platform ถูก detect หรือถาม user
- Workflow files สร้างถูกต้องตาม platform
- Package scripts ครบถ้วนสำหรับ verify, test, build, deploy, release
- Secrets ถูก setup อย่างปลอดภัย
- ไม่มีการ commit/push/deploy/release โดยอัตโนมัติ
- มีรายงาน setup status และ next action ชัดเจน
