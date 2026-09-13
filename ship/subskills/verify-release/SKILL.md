---
name: ship-verify-release
description: ยืนยัน release ขึ้นจริงหลัง ship — tag, registry version, release notes, deployed artifacts
argument-hint: "[version-or-tag]"
related:
  - run-verify
  - list-git-tags
  - list-github-release
  - report
---

## Goal

ยืนยันหลัง `/ship` ว่า release artifacts ขึ้นจริง — tag บน remote, version บน registry, release notes published — ไม่ใช่ code verification (อันนั้น `/run-verify`)

## Scope

- ใช้เมื่อ `/ship` dispatch มาที่ `verify`/`verify-release` หรือเรียกหลัง ship เสร็จ
- ครอบคลุม: git tag บน remote, GitHub release, package registry version, deploy target live
- Read-only: ตรวจสอบ — ไม่ re-ship

## Execute

### 1. Verify Tag And Release

> Goal: tag และ release notes อยู่บน remote

1. `git fetch --tags` แล้วตรวจ tag ที่คาดอยู่บน `origin`
2. ใช้ `/list-git-tags` เทียบ tag ล่าสุดกับ version ใน manifest
3. ใช้ `/list-github-release` หรือ `gh release view <tag>` — release notes published ไม่ใช่ draft

### 2. Verify Registry Artifacts

> Goal: package ขึ้น registry จริง

1. npm/bun: `bun pm view <pkg> version` หรือ `npm view <pkg> version` เทียบ manifest
2. crates: `cargo search <crate>` เทียบ version
3. Docker: ตรวจ tag บน registry ที่ใช้
4. ข้าม registries ที่ project ไม่ได้ publish — ระบุว่าข้าม

### 3. Verify Deploy Target

> Goal: production รัน version ใหม่

1. ถ้า ship รวม deploy → ทำตาม `follow-deploy/subskills/verify-deploy/SKILL.md`
2. ถ้าเป็น local-only ship (skills repo, dotfiles) → ตรวจแค่ commit อยู่บน remote: `git log origin/main --oneline -1`

### 4. Report

> Goal: สรุป release status

1. ใช้ `/report` คอลัมน์: `No.`, `Artifact`, `Expected`, `Actual`, `Status`
2. Verdict: `released` / `partial` / `not-released` พร้อม artifact ที่ขาด

## Rules

- ระบุ evidence ต่อ artifact — tag name, registry version, release URL
- partial release → ระบุ artifact ไหนขาดและคาดว่า pending CI หรือ fail จริง
- ห้าม re-ship หรือ retry ใน subskill นี้ — รายงานแล้วให้ caller ตัดสิน

## Expected Outcome

- ตาราง artifacts: expected vs actual พร้อม verdict
- รายการ artifacts ที่ขาดถ้า partial
