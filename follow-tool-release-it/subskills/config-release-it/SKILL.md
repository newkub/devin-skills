---
name: follow-tool-release-it-config-release-it
description: ตั้งค่า `.release-it.json` — git, github, npm, hooks, changelog options
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - run-release
  - follow-tool-github-actions
---

## Goal

ตั้งค่า `.release-it.json` ให้ตรง release policy — `git`, `github`, `npm`, `hooks`, plugins — โดย merge กับ config เดิมไม่ overwrite

## Scope

ใช้เมื่อต้องแก้ release-it config ที่มีอยู่ — install/scripts อยู่ใน `subskills/setup-release-it/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `.release-it.json` (หรือ `release` field ใน `package.json`) — บันทึก keys ปัจจุบัน
2. ตรวจ plugins ที่ติดตั้งใน devDependencies
3. ถ้าไม่มี config → สร้าง `.release-it.json` ที่ root (หรือทำ `subskills/setup-release-it/SKILL.md` ก่อน)

### 2. Git Options

> Goal: ตั้งค่า `git` section

1. `git.commitMessage` — format ข้อความ commit เช่น `"chore: release v${version}"`
2. `git.tagName` — format tag เช่น `"v${version}"`
3. `git.requireCleanWorkingDir` — `true` สำหรับ local; `false` เฉพาะเมื่อ CI ต้องรันโดยไม่ clean
4. `git.push` — `true` เพื่อ push commit+tag อัตโนมัติ
5. `git.requireBranch` — จำกัด release เฉพาะ branch เช่น `"main"`

### 3. GitHub Options

> Goal: ตั้งค่า `github` section สำหรับ GitHub releases

1. `github.release: true` — สร้าง GitHub release อัตโนมัติ
2. `github.releaseName` — format ชื่อ release เช่น `"v${version}"`
3. `github.autoGenerate` — ใช้ GitHub auto-generated release notes หรือปิดถ้าใช้ changelog plugin
4. `github.draft`/`github.prerelease` — ตาม release policy
5. auth ผ่าน `GITHUB_TOKEN` env — ห้ามใส่ token ใน config

### 4. npm And Changelog Options

> Goal: ตั้งค่า `npm` section และ changelog

1. `npm.publish` — `true` ถ้า publish ไป registry; `false` สำหรับ private repos
2. `npm.publishPath`/`npm.tag` — dist-tag เช่น `"latest"`, `"beta"` ตาม channel
3. ใช้ `@release-it/conventional-changelog` — ตั้ง `plugins."@release-it/conventional-changelog".preset` เช่น `"conventionalcommits"` (ดู official docs สำหรับ preset names)
4. `hooks` — `"before:init"`, `"after:bump"`, `"after:release"` สำหรับ build/test/notify steps

### 5. Verify

> Goal: ตรวจ config ด้วย dry run

1. รัน `bunx release-it --dry-run` — config ต้อง parse ผ่านและแสดง plan ถูกต้อง
2. ตรวจ tag format, release notes, publish target ใน dry run output
3. ถ้าพัง → revert keys ที่แก้แล้ว report diff ด้วย `/report-before-after`

## Rules

### 1. Merge Discipline

- แก้เฉพาะ keys ที่จำเป็น — ห้าม overwrite ทั้งไฟล์
- strict CLI parsing: unknown options ถูก reject — ใช้เฉพาะ keys ที่มีจริง (ดู official docs)

### 2. Safety

- `--dry-run` ก่อน release จริงเสมอ
- ใช้ `--no-npm.publish` สำหรับ test run ถ้าจำเป็น
- ไม่เปลี่ยน `tagName` format บน repo ที่มี tags เดิมโดยไม่ตรวจ convention

### 3. Secrets

- tokens ผ่าน env vars (`GITHUB_TOKEN`, `NPM_TOKEN`) เท่านั้น — ห้ามใส่ใน config
- ใช้ `/follow-secret-manager` จัดการ tokens

- ใช้ /run-release ถ้าจำเป็น

## Expected Outcome

- `.release-it.json` มี git/github/npm options ตรง release policy
- `--dry-run` แสดง release plan ถูกต้อง
- Changelog/plugins ทำงานตาม config
