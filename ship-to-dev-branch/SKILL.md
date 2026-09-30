---
name: ship-to-dev-branch
description: Ship work ลง dev branch — /ship-verify gate แล้ว /git-commit-and-push เข้า dev
argument-hint: "[@issue-number-or-title|dont-ask-me]"
triggers:
  - user
  - model
related:
  - ship-verify
  - follow-agents-md
  - git-commit-and-push
  - git-branch
  - ship-to-main-branch
  - ship-release
  - dont-ask-me
---

## Goal

Ship งานลง `dev` branch ในสองขั้น — `/ship-verify` เป็น gate ก่อนเสมอ แล้ว `/git-commit-and-push` เข้า `dev`

## Scope

- **Target = `dev` branch เท่านั้น** — merge เข้า `main` ทำผ่าน `/ship-to-main-branch`; release ทำผ่าน `/ship-release`
- Verify workflow ทั้งหมดอยู่ใน `/ship-verify` (canonical) — skill นี้ไม่ duplicate
- argument `dont-ask-me` หรือ session ที่ `/dont-ask-me` active → ส่งต่อ mode เดิมให้ทุก step

## Execute

### 1. Ship Verify

> Goal: งานผ่าน verification gate ครบก่อน push

1. ทำ `/ship-verify` พร้อม arguments เดิมทั้งหมด — verify ทุก gate (AGENTS.md, review, validate, tests, dev run, usage)
2. ถ้า `/ship-verify` ไม่ผ่าน → แก้ blockers แล้ว verify ใหม่ — ห้ามข้ามไป push

### 2. Ship To Dev

> Goal: changes อยู่บน `origin/dev`

1. ตรวจ/switch ไป `dev` branch ตาม `/git-branch` (สร้างจาก `main` ถ้ายังไม่มี)
2. ทำ `/git-commit-and-push` — commit changes + push เข้า `origin/dev` + resolve CI/CD จนผ่าน
3. เสร็จแล้วแนะนำ `/ship-to-main-branch` เป็น next action (merge เข้า main) หรือ `/ship-release` ถ้าต้อง release

## Rules

- ห้าม duplicate verify workflow ที่นี่ — canonical อยู่ใน `/ship-verify` เท่านั้น
- push เข้า `dev` เท่านั้น — ห้าม merge/push เข้า `main` (`/ship-to-main-branch` ทำ), ห้าม release (`/ship-release` ทำ)
- ถ้า `/ship-verify` fail → ห้าม push — แก้จนผ่านหรือ stop + report

## Expected Outcome

- `/ship-verify` ผ่านครบทุก gate
- code push ขึ้น `origin/dev` สำเร็จและ CI/CD เขียว — merge เข้า `main` ทำต่อผ่าน `/ship-to-main-branch`
