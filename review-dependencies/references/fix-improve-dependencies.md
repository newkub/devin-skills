# Fix Guide

(merged from: improve-dependencies)

## Goal

แก้ไข dependency findings จาก `/review-dependencies` — outdated packages, vulnerabilities, unused deps, duplicates และ license issues

## Scope

- รับ findings จาก `/review-dependencies` หรือ `/run-audit`
- ครอบคลุม: security vulnerabilities, outdated versions, unused deps, duplicate versions, license conflicts, abandoned packages
- Boundary: ฝั่ง health เท่านั้น — dep หนัก/bundle size/dep tree bloat ให้ส่งต่อ `/review-dependencies`
- Action-oriented: แก้จริง — update, remove, replace ตามประเภท finding

## Execute

### 1. Triage Findings

> Goal: เรียง findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-dependencies` หรือรัน `/run-audit` ถ้าต้องการสด
2. เรียง: vulnerabilities (critical→low) → abandoned/insecure → outdated major → unused → duplicates → license
3. แยก direct deps ออกจาก transitive (transitive แก้ผ่าน overrides/resolutions)

### 2. Fix Vulnerabilities

> Goal: patch vulnerable deps ก่อน

1. update ไป patched version — ตรวจ breaking changes ก่อน major bumps
2. transitive vulnerabilities → ใช้ `overrides` (pnpm/npm) หรือ `resolutions` (yarn)
3. ถ้าไม่มี patch → flag ให้ user: replace lib (`/review-dependencies`), accept risk, หรือ workaround

### 3. Update Outdated

> Goal: อัปเดต deps ที่ตก version

1. ใช้ `/follow-tool-taze` หรือ `/update-version-to-latest` — minor/patch ก่อน, major ทีละตัว
2. อ่าน changelog/breaking changes ของ major updates ก่อน apply
3. ถ้า project ใช้ Renovate → ตรวจ config ให้ auto-update ครอบคลุม (`/follow-tool-renovate`)

### 4. Remove And Deduplicate

> Goal: ลบ deps ที่ไม่จำเป็น

1. ใช้ `/check-unused` — ลบ deps ที่ไม่มี imports จริง (ตรวจ transitive/dev usage ก่อน)
2. dedupe duplicate versions (`pnpm dedupe`, lockfile cleanup)
3. ย้าย deps ที่ผิดที่: runtime deps ใน devDependencies หรือกลับกัน
4. สำหรับ heavy deps → ทำ `/review-dependencies` หาทางเลือกเบากว่า

### 5. Verify And Report

> Goal: ยืนยันทุกอย่างทำงานหลังเปลี่ยน deps

1. `install` สะอาด + `/run-check` + `/run-test` ต้องผ่าน
2. `/run-build` ผ่าน — ไม่มี missing/broken imports
3. ใช้ `/report-review` สรุป: updated, removed, vulnerabilities fixed, remaining

## Rules

### 1. Verify Every Change

- typecheck + test + build ต้องผ่านหลัง dep changes ทุก batch
- ห้าม update deps พร้อมกันหมดแล้วค่อย test — แยก batch เพื่อ isolate failures

### 2. Changelog Aware

- major updates ต้องอ่าน breaking changes ก่อน — ไม่ bump มั่ว
- pin versions ตาม project policy (lockfile committed เสมอ)

### 3. Security Priority

- vulnerabilities มาก่อนเสมอ — แต่ห้าม upgrade ที่ทำ app พังโดยไม่มี plan
- ไม่ override security findings เพื่อให้ audit ผ่าน

## Expected Outcome

- Vulnerabilities ถูก patch หรือมี documented decision
- Outdated/unused/duplicate deps ถูกจัดการ
- Tests และ build ผ่านหลังทุกเปลี่ยนแปลง
- รายงาน deps changes พร้อมเหตุผล
