---
name: follow-service-run-on-verify-connection
description: ยืนยัน RunsOn stack ทำงาน — AWS stack healthy, runners register, labels ตรง
argument-hint: "[stack-name]"
related:
  - use-gh-cli
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า RunsOn (self-hosted GitHub runners บน AWS) ทำงานจริง — stack healthy, runners register กับ repo/org, workflow labels ตรง

## Scope

- ใช้เมื่อ `/follow-service-run-on` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ stack หรือ workflows

## Execute

### 1. Check AWS Stack

> Goal: RunsOn CloudFormation stack สุขภาพดี

1. `aws cloudformation describe-stacks --stack-name runs-on` — status `CREATE_COMPLETE`/`UPDATE_COMPLETE`
2. flag stack ที่อยู่ใน `*_FAILED` หรือ `ROLLBACK_*` state

### 2. Check Runner Registration

> Goal: runners register กับ GitHub ได้

1. `gh api repos/{owner}/{repo}/actions/runners` — มี runners online
2. flag: ไม่มี runner, runners offline ทั้งหมด, runner labels ไม่ตรง `runs-on.yml`

### 3. Check Workflow Labels

> Goal: workflows ใช้ labels ที่ runners รองรับ

1. เทียบ `runs-on:` labels ใน workflows กับ runner definitions ใน `runs-on.yml`
2. flag label ที่ไม่มี runner definition — job จะค้างไม่รัน

### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `stack-unhealthy` / `no-runners` / `label-mismatch`

## Rules

- ใช้ describe/list calls เท่านั้น — ห้ามแก้ stack
- label mismatch = common silent failure — flag เสมอ
- stack issues → รายงานให้ setup subskill จัดการ

## Expected Outcome

- Verdict พร้อม stack status + runner count + label evidence
