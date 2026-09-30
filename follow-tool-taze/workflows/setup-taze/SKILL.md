---
name: follow-tool-taze-setup-taze
description: ติดตั้งและใช้ taze — major/minor checks, monorepo recursive scan
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-install
  - run-verify
---

## Goal

ติดตั้งและใช้ taze สำหรับตรวจและอัปเดต dependencies — `major`/`minor`/`latest` modes, recursive monorepo scan และ package scripts

## Scope

ใช้สำหรับ projects/workspaces ที่ต้องการ keep dependencies up-to-date ด้วย taze CLI — run modes, monorepo usage, validation flow

## Execute

### 1. Check And Run

> Goal: รัน taze ตรวจ dependencies

1. รัน `bunx taze` — scan dependencies แสดง updates ที่มี (ไม่ต้องติดตั้ง; หรือ `bun add -D taze` เพื่อ pin)
2. ใช้ `bunx taze --json` สำหรับ machine-readable output (agents/CI)
3. ดู options เพิ่มเติมใน [references/taze.md](../../references/taze.md)

### 2. Update Modes

> Goal: เลือก update mode ตามความเสี่ยง

1. `bunx taze patch` — patch updates เท่านั้น (ปลอดภัยสุด)
2. `bunx taze minor` — minor + patch
3. `bunx taze major` — รวม major bumps (ต้อง review breaking changes)
4. `bunx taze latest` — update ไป latest ทั้งหมด

### 3. Write And Install

> Goal: apply updates เข้า project

1. ใช้ `-w` write versions ลง `package.json`
2. ใช้ `-i` install dependencies หลัง bump
3. ใช้ `-I` interactive mode เลือกทีละ package
4. ตัวอย่าง full update: `bunx taze latest -w -i`

### 4. Monorepo Usage

> Goal: scan ทุก workspace

1. ใช้ `-r` recursive scan ทุก workspace package
2. รัน `bunx taze major -r` ตรวจทั้ง monorepo ก่อน write
3. ตรวจ compatibility ข้าม workspace — internal packages ต้อง version สอดคล้องกัน
4. ถ้าต้องการ config ซับซ้อน → สร้าง `taze.config.ts` (`exclude`, `include`, `packageMode`, `depFields`, `ignorePaths`, `maturityPeriodExclude`)

### 5. Validate Updates

> Goal: ยืนยัน updates ไม่พัง project

1. รัน install หลัง write (`bun install` หรือ `-i` ครอบไว้แล้ว)
2. รัน tests, lint, typecheck — ทำ `/run-verify`
3. ตรวจ `package.json` diff ก่อน commit — major bumps ต้อง review changelog/breaking changes
4. ถ้าพัง → revert `package.json` + lockfile แล้ว report

## Rules

### 1. Usage

- `bunx taze` สำหรับ one-off; `-r -w -i` สำหรับ monorepo full update
- `--json` สำหรับ agents/CI

### 2. Safety

- ตรวจ diff ก่อน commit เสมอ — major updates ต้อง review
- รัน tests หลัง update; ไม่ update ใน production branch โดยไม่ review
- ทีละ mode — patch/minor ก่อน major เพื่อ isolate breakage

### 3. Monorepo

- ใช้ `-r` เสมอใน monorepo; ใช้ `ignoreOtherWorkspaces` ใน `taze.config.ts` ถ้าต้องการ scope เดียว

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /run-install ถ้าจำเป็น

## Expected Outcome

- Dependencies ตรวจและอัปเดตด้วย mode ที่เหมาะสม
- Monorepo scan ครบทุก workspace
- Updates ผ่าน tests/lint/typecheck ก่อน commit
