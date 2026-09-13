---
name: follow-service-instantdb-verify-connection
description: ยืนยัน InstantDB connection — app id valid, query/transact ตอบกลับ
argument-hint: "[app-id]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า InstantDB เชื่อมต่อได้จริง — `INSTANT_APP_ID` valid, client query ตอบกลับ, admin token ถ้ามีใช้ได้

## Scope

- ใช้เมื่อ `/follow-service-instantdb` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ push schema หรือ transact จริง

## Execute

### 1. Check App Credentials

> Goal: app id และ tokens มีครบ

1. ตรวจ `INSTANT_APP_ID` มีค่า (ไม่ print ค่า)
2. ถ้าใช้ admin SDK → ตรวจ `INSTANT_APP_ADMIN_TOKEN` มี
3. ถ้าใช้ CLI → `instant-cli whoami` ยืนยัน login

### 2. Smoke Test Query

> Goal: client เชื่อม backend ได้

1. init client ด้วย app id → รัน query ว่าง `db.useQuery({})` หรือ `db.queryOnce`
2. ตรวจ response ไม่ใช่ auth error — invalid app id จะ fail ตรงนี้
3. ถ้ามี schema → ตรวจ `instant.schema.ts` sync กับ backend (`instant-cli pull` dry check)

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `invalid-app-id` / `auth-failed` / `schema-drift`

## Rules

- ใช้ read queries เท่านั้น — ห้าม transact
- ไม่ print admin token
- schema drift → รายงานให้ `subskills/config-instantdb/SKILL.md` จัดการ

## Expected Outcome

- Verdict connection พร้อม app-id evidence
