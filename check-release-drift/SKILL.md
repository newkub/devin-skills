---
name: check-release-drift
description: เทียบ version ใน manifest, git tags และ changelog หา release drift ที่ไม่ตรงกัน
argument-hint: "[repo-path]"
related:
  - list-git-release
  - list-git-tags
  - report-changelog
  - gen-changelog-md
  - follow-release
  - check-commit-quality
  - report-table
  - report-release-readiness
---

## Goal

ตรวจความสอดคล้องของ version ระหว่าง package manifest, git tags, GitHub releases และ changelog — หา drift เช่น manifest สูงกว่า tag ล่าสุด, tag ที่ไม่มี changelog entry, หรือ release ที่ไม่มี tag

## Scope

- Version sources: `package.json`/`Cargo.toml`/`pyproject.toml` version field, git tags (`v*`), GitHub releases, `CHANGELOG.md` headings
- รองรับ monorepo: ตรวจทุก package ใน workspace ถ้ามี version แยก
- Read-only: รายงาน drift อย่างเดียว

## Execute

### 1. Collect Versions

> Goal: รวบรวม version จากทุก source

1. อ่าน version จาก package manifest(s) — ใช้ `/list-workspaces` ถ้าเป็น monorepo
2. รัน `git tag --sort=-creatordate` เพื่อดึง tags ล่าสุด
3. อ่าน `CHANGELOG.md` หา version headings ล่าสุด
4. ถ้ามี remote GitHub → `gh release list --limit 5` ดู releases

### 2. Compare And Detect Drift

> Goal: หาความไม่ตรงกัน

1. `manifest > latest tag` → มี version bump ที่ยังไม่ tag/release
2. `latest tag > manifest` → tag เกิน version ใน manifest (ผิดปกติ)
3. Tag ที่ไม่มี changelog entry → changelog ขาด
4. Changelog entry ที่ไม่มี tag → entry เพี้ยนหรือ tag หาย
5. GitHub release ที่ไม่มี tag → release drift

### 3. Report

> Goal: สรุป drift

1. ใช้ `/report-table` คอลัมน์: `No.`, `Source`, `Version`, `Expected`, `Drift Type`, `Fix`
2. สรุป recommended action: สร้าง tag, อัปเดต changelog, หรือสร้าง release
3. แนะนำ `/follow-release` หรือ `/gen-changelog-md` สำหรับการแก้ไข

## Rules

### 1. Evidence-Based

- ทุก drift ต้องระบุค่าจริงที่พบในแต่ละ source
- ถ้า source ใดไม่มี (ไม่มี changelog/tags) → ระบุ `missing` ไม่ใช่เดา

### 2. Read-Only

- ไม่สร้าง tag, release หรือแก้ changelog — แนะนำ skill ที่เกี่ยวข้อง

### 3. Monorepo Aware

- ตรวจต่อ package ถ้า workspace มี independent versioning (changesets, lerna)
- ใช้ tag prefix convention ที่ repo ใช้จริง (เช่น `pkg-a@1.0.0`)

- ใช้ /follow-release สำหรับ release process
- ใช้ /gen-changelog-md สำหรับสร้าง changelog
- ใช้ /check-commit-quality สำหรับ commit conventions

## Expected Outcome

- ตาราง version comparison ข้ามทุก source
- รายการ drift พร้อม recommended fix
