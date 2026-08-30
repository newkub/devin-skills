---
name: run-verify
description: รัน verify แบบครบวงจร (scan, format, lint, typecheck, test, build) บน local หรือ CI/CD ตามขนาด project
related:
  - run-scan
  - run-lint
  - run-typecheck
  - run-test
  - run-build
  - run-test-all
  - check-monorepo
  - setup-ci-cd
  - follow-tasks
  - ship-code
  - ship-local
  - ship-ci
  - watch-ci-and-resolve
  - watch-cd-and-resolve
  - watch-github-actions
  - git-push
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

รัน verify แบบครบวงจร scan, format, lint, typecheck, test, build โดยเลือก local หรือ CI/CD ตามขนาด project

## Scope

ใช้เป็นจุดรวมเดียวสำหรับ verify ทั้งหมด
- project เล็ก ไม่หนัก RAM/compute ไม่ช้า → รันบน local ผ่าน package script `verify`
- project ใหญ่ monorepo หรือ build/test หนัก → ส่ง branch ไป CI/CD แล้ว watch และ resolve errors
- สามารถ force mode ได้: `/run-verify --local` หรือ `/run-verify --ci`
- ไม่ merge, ไม่ release, ไม่ deploy โดยอัตโนมัติ

## Execute

### 1. Detect Mode

> Goal: เลือก mode ตาม context

1. ถ้า user ระบุ `--local` → ใช้ local mode
2. ถ้า user ระบุ `--ci` หรือ `--ci-cd` → ใช้ CI/CD mode
3. ถ้าไม่ระบุ → ไปขั้น Auto Detect

### 2. Auto Detect Project Size

> Goal: ตัดสินใจว่า project เล็กหรือใหญ่

1. ตรวจสอบ signals ของ project ใหญ่:
   - ทำ `/check-monorepo` แล้วพบวว่าเป็น monorepo
   - มี `workspaces` ใน `package.json`, `pnpm-workspace.yaml`, `moon.yml`, `turbo.json`
   - มีหลาย workspace/package หรือ build/test หนัก (เช่น >60 วินาที, กิน RAM/CPU มาก)
   - `AGENTS.md` หรือ user ระบุให้ใช้ CI verify
2. ถ้าพบ signal ใด signal หนึ่ง → CI/CD mode
3. ถ้าไม่พบ → local mode

### 3. Local Mode (Small Project)

> Goal: รัน verify บน local ผ่าน package manifest

1. อ่าน package manifest (`package.json`, `Cargo.toml`, etc.)
2. ถ้าไม่มี script `verify` → ทำ `/follow-tasks` เพื่อสร้าง `verify` = `scan + format + lint + typecheck + test + build` (format ก่อน lint)
3. ถ้า `verify` ไม่ครบ 6 ส่วน → ทำ `/follow-tasks` เพื่อเติม
4. รัน `verify` script บน local (เช่น `bun run verify`)
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 4. CI/CD Mode (Large Project)

> Goal: ส่ง branch ขึ้น CI/CD แล้ว watch

1. ทำ `git branch --show-current`, `git status`, `git log origin/<branch>..HEAD`
2. ถ้า working tree ไม่สะอาด → stop และ report
3. ถ้าไม่มี remote → stop และ report
4. ตรวจหา CI/CD config (`setup-ci-cd` รายการ); ถ้าไม่มี → ทำ `/setup-ci-cd`
5. ทำ `/git-push` ถ้ามี unpushed commits
6. ถ้า push ถูก reject → stop และ report (ไม่ force push)
7. ถ้าเป็น GitHub Actions → `/watch-github-actions` มิฉะนั้น `/watch-ci-and-resolve`
8. ถ้า fail → ทำ `/resolve-errors` แล้ว push ใหม่/re-run สูงสุด 3 ครั้ง
9. ถ้า pass → report

## Rules

### 1. Verify Only
- ไม่ merge, ไม่ release, ไม่ deploy
- ไม่ commit โดยอัตโนมัติ

### 2. Error Handling
- ใช้ `/resolve-errors` เมื่อพบ error
- retry สูงสุด 3 ครั้ง
- ถ้ายังไม่ผ่าน → stop และ report

### 3. Safety
- ไม่ force push
- ไม่ push ถ้า working tree ไม่สะอาด
- ไม่ hardcode secrets

### 4. Package Manifest
- small project ต้องมี `verify` = `scan + format + lint + typecheck + test + build` (format ก่อน lint)
- large project ใช้ CI/CD pipeline รัน full suite

## Expected Outcome

- small project: code ผ่าน scan, format, lint, typecheck, test, build บน local
- large project: branch ถูก push, CI/CD pipeline ผ่าน หรือมี root cause + next action ชัดเจน
- ไม่มี merge/release/deploy โดยอัตโนมัติ
