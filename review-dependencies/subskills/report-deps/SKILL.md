---
name: review-dependencies-report-deps
description: สร้าง dependency audit report — outdated/vuln/license/unused matrix + action plan
argument-hint: "[workspace-or-package]"
related:
  - report
  - create-report-in-dot-devin
  - run-audit
---

## Goal

แปลง dependency findings ของ `/review-dependencies` เป็น audit report — dep matrix พร้อม action ต่อ package ที่ทีม update ตามได้

## Scope

- ใช้เมื่อ `/review-dependencies` dispatch มาที่ `report`/`deps` หรือเรียก standalone กับ audit data ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Organize Deps

> Goal: dep ทุกตัวมี action ชัดเจน

1. ตาราง: `No.`, `Package`, `Current`, `Latest`, `Severity`, `Issue`, `Action`
2. `Action` ∈ `update now`, `update with caution` (major/breaking), `remove`, `replace`, `keep`
3. จัดกลุ่ม: vulnerabilities ก่อน → outdated → unused → license → duplicates

### 2. Detail High-Risk Items

> Goal: dep เสี่ยงมี context พอตัดสินใจ

1. vulns: CVE/GHSA + affected range + fixed version + exploitability
2. majors: breaking change summary + migration effort
3. replace candidates: alternatives score table (จาก parent Execute §5)

### 3. Summarize

> Goal: posture + plan ในบรรทัดเดียว

1. counts ต่อ action + vulns ต่อ severity
2. suggested order: security patches → semver-safe batch → majors ทีละตัว → removals
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- ทุก row มี source: audit output, registry data, หรือ import scan — ห้ามเดา unused
- version <7 วัน → flag ใน report เสมอ (supply-chain risk)
- fix ทำใน parent `## Fix` — report นี้ read-only

## Expected Outcome

- Dep matrix พร้อม action ต่อ package และ severity
- Suggested update order + residual risk notes
