---
name: follow-tool-release-it-setup-release-it
description: ติดตั้ง release-it, เพิ่ม release script และตั้งค่า hooks/plugins พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-tool-github-actions
  - run-release
---

## Goal

ติดตั้ง `release-it` ใน project และตั้งค่า release workflow พื้นฐาน — script, hooks, plugins — ให้ `bun run release` ทำงานได้ทั้ง local และ CI

## Scope

ใช้สำหรับ Node.js projects ที่ต้องการเริ่มใช้ release-it — install, scripts, basic hooks/plugins. รายละเอียด config options อยู่ใน `subskills/config-release-it/SKILL.md`

- ถ้า `release-it` ติดตั้งและ config มีอยู่แล้ว → verify เท่านั้น

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ state ก่อน setup

1. ตรวจ `package.json` — ต้องมี `version` field และ git repository ที่ clean
2. ตรวจว่า `release-it` อยู่ใน devDependencies แล้วหรือไม่ — ถ้ามี → skip ไป verify
3. ตรวจ Node.js version ตรง requirement ของ release-it version ที่จะติดตั้ง (ดู parent skill หรือ official docs)

### 2. Install And Script

> Goal: ติดตั้งและเพิ่ม release script

1. รัน `bun add -D release-it` (หรือ package manager ของ project)
2. เพิ่ม script ใน `package.json`: `"release": "release-it"`
3. ยืนยันด้วย `bunx release-it --version`

### 3. Basic Hooks And Plugins

> Goal: ตั้งค่า hooks/plugins พื้นฐาน

1. สร้าง `.release-it.json` ขั้นต่ำที่ root — รายละเอียด options ทำต่อใน `subskills/config-release-it/SKILL.md`
2. เพิ่ม `hooks` ถ้าต้องการ เช่น `"after:bump": "bun run build"` เพื่อ build ก่อน publish
3. ติดตั้ง plugins ตามต้องการ:
   - `@release-it/conventional-changelog` — auto changelog จาก conventional commits
   - `@release-it/bumper` — bump version ใน manifest files อื่น
   - `@release-it/keep-a-changelog` — maintain `CHANGELOG.md`
4. รายละเอียด plugins ดู [references/release-it.md](../../references/release-it.md) หรือ official docs

### 4. CI Workflow (Optional)

> Goal: รัน release อัตโนมัติใน CI

1. สร้าง `.github/workflows/release.yml` — trigger บน push ไป main หรือ tags
2. ใช้ `fetch-depth: 0` ใน checkout เพื่อให้มี git history ครบ
3. รัน `bun run release --ci` สำหรับ non-interactive mode
4. ใช้ `/follow-secret-manager` ตั้ง `NPM_TOKEN` และ `GITHUB_TOKEN` เป็น secrets

### 5. Verify

> Goal: ยืนยัน release flow ทำงาน

1. รัน `bunx release-it --dry-run` — ตรวจ version bump, changelog, publish steps ที่จะเกิด
2. ถ้า dry run แสดงผลไม่ตรงคาด → แก้ config แล้ว dry-run ซ้ำ
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Safety

- ทดสอบด้วย `--dry-run` เสมอก่อน release จริง
- ใช้ `requireCleanWorkingDir: true` สำหรับ local release
- ไม่รัน release บน pull request

### 2. Secrets

- `NPM_TOKEN`/`GITHUB_TOKEN` ผ่าน secrets manager เท่านั้น ห้าม hard-code

### 3. Idempotent

- ถ้า setup ไปแล้ว → verify ด้วย `--dry-run` เท่านั้น

- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น

## Expected Outcome

- `release-it` ติดตั้งพร้อม `release` script
- `.release-it.json` พื้นฐานและ plugins ที่ต้องการพร้อมใช้
- `--dry-run` แสดง release plan ถูกต้อง
