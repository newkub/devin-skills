---
name: review-release-report-readiness
description: สร้าง release-readiness report — go/no-go checklist verdict พร้อม blockers
argument-hint: "[version]"
related:
  - review-release
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง release findings ของ `/review-release` เป็น readiness report — go/no-go verdict ที่ PM/release owner ตัดสินใจได้

## Scope

- ใช้เมื่อ `/review-release` dispatch มาที่ `readiness`/`report` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Readiness Checklist

> Goal: ทุก gate เห็น status ทันที — parent Execute §7

ทำตาม `../../subagents/release-reviewer/release-readiness-score.md` + `../../subagents/release-reviewer/deploy-readiness-score.md`

1. ตาราง: `No.`, `Gate`, `Status`, `Evidence`, `Blocker?`
2. gates: version/semver, changelog, breaking changes documented, tests/CI green, platform targets, rollback plan, license/release notes, deploy steps ready
3. `Status` = ผ่าน/ไม่ผ่าน/unknown — unknown = blocker จนกว่าจะ verify

### 2. Verdict

> Goal: decision พร้อมเงื่อนไข

1. verdict: `go` / `go-with-conditions` / `no-go` + blockers list
2. conditions — สิ่งที่ต้องทำก่อน tag/deploy พร้อม owner skill (`/gen-changelog-md`, `/resolve-errors`, `/follow-deploy`)
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- verdict conservative — blocker 1 ตัว = no-go
- ทุก gate มี evidence หรือ `unknown` tag — ห้ามเดา
- ไม่ claim CI/deploy status ที่ไม่ได้ตรวจจริง

## Expected Outcome

- Readiness checklist ครบทุก gate พร้อม status
- Go/no-go verdict + prioritized blockers
