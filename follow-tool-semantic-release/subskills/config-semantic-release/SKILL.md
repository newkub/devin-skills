---
name: follow-tool-semantic-release-config-semantic-release
description: ตั้งค่า semantic-release config — branches, plugins, tagFormat, changelog
argument-hint: "[scope]"
related:
  - follow-tool-github-actions
  - follow-tool-git
  - run-release
---

## Goal

ตั้งค่า release config ของ semantic-release — `branches`, `plugins`, `tagFormat`, plugin options — ให้ตรง branching และ publishing policy

## Scope

ใช้เมื่อต้อง define/แก้ release config — install/auth อยู่ใน `subskills/setup-semantic-release/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. หา config ที่มีอยู่: `.releaserc`, `release.config.cjs`/`release.config.mjs`, หรือ `"release"` field ใน `package.json`
2. อ่าน plugins ที่ติดตั้งใน devDependencies
3. ถ้าไม่มี config → สร้าง `release.config.cjs` (หรือ `.releaserc`) ที่ root

### 2. Configure Branches

> Goal: กำหนด branches ที่ release ได้

1. `branches` — ระบุ release branches เช่น `["main"]` หรือ `["main", { name: "beta", prerelease: true }]`
2. เพิ่ม prerelease channels (`beta`, `alpha`, `next`) ตาม release policy — ใช้ `{ name, prerelease: true }` object form
3. ระบุเฉพาะ branches ที่อนุญาต release — branch อื่นจะ dry-run/skip โดย default

### 3. Configure Plugins

> Goal: ตั้งค่า plugin pipeline

1. Default plugins (มากับ semantic-release): `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/npm`, `@semantic-release/github`
2. เพิ่มตามต้องการ:
   - `@semantic-release/changelog` — เขียน `CHANGELOG.md` (options: `changelogFile`)
   - `@semantic-release/git` — commit changelog/package.json กลับเข้า repo (options: `assets`, `message`)
   - `@semantic-release/exec` — custom commands ใน lifecycle (ดู official docs)
3. ใช้ plugin object form `["@semantic-release/npm", { "npmPublish": false }]` เมื่อต้องปรับ options
4. อย่าใส่ plugin ที่ไม่ได้ติดตั้ง — จะ fail ตอน load

### 4. Tag And Other Options

> Goal: ตั้งค่า tag format และ options เสริม

1. `tagFormat` — default `v${version}`; สำหรับ monorepo อาจใช้ `${name}@${version}` ตาม convention ที่มีอยู่ — ห้ามเปลี่ยนบน repo ที่มี tags เดิมโดยไม่ตรวจ
2. `repositoryUrl` — override เฉพาะเมื่อ auto-detect ผิด
3. `preset`/`parserOpts`/`releaseRules` — ปรับ commit analysis ถ้าไม่ใช้ conventional commits มาตรฐาน (ดู official docs)

### 5. Verify

> Goal: ตรวจ config ด้วย dry run

1. รัน `bunx semantic-release --dry-run --debug` — ตรวจ branch check, plugin load, version ที่จะได้
2. ตรวจว่า changelog และ git commit steps ทำงานใน plan
3. ถ้าพัง → revert keys ที่แก้แล้ว report diff ด้วย `/report-before-after`

## Rules

### 1. Config Discipline

- ใช้ `release.config.cjs` หรือ `.releaserc` ที่ชัดเจน — อย่า scatter config หลายที่
- ไม่ hard-code tokens หรือ secrets ใน config — auth ผ่าน env vars
- merge กับ config เดิม ห้าม overwrite ถ้าไม่จำเป็น

### 2. Branches

- ระบุ `branches` ชัดเจน — ไม่ release บน branch ที่ไม่ได้อนุญาต
- prerelease branches ใช้ `{ name, prerelease: true }`

### 3. Plugins

- plugin order มีผลต่อ lifecycle — commit/git plugin ควรอยู่ท้าย pipeline
- ทุก plugin ใน config ต้องติดตั้งใน devDependencies

- ใช้ /follow-tool-git ถ้าจำเป็น
- ใช้ /run-release ถ้าจำเป็น

## Expected Outcome

- Release config ถูกต้องตาม branching/publishing policy
- Plugins load และ lifecycle ทำงานครบ
- `--dry-run` แสดง plan ถูกต้อง
