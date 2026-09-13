---
name: follow-service-aws-sdk-verify-connection
description: ยืนยัน AWS credentials ใช้งานได้ — caller identity, region, SDK call จริง
argument-hint: "[region]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า AWS SDK เชื่อมต่อได้จริง — credentials valid, region ถูก, permissions เพียงพอ

## Scope

- ใช้เมื่อ `/follow-service-aws-sdk` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ credentials

## Execute

### 1. Check Credentials Loaded

> Goal: credentials มีและ load ถูก chain

1. ตรวจ `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` หรือ credentials chain (profile, SSO, IAM role)
2. ตรวจ `AWS_REGION` ตั้งไว้และตรงกับที่ config คาด

### 2. Smoke Test API Call

> Goal: call จริงตอบกลับ

1. `aws sts get-caller-identity` — ต้องคืน Account/Arn
2. ถ้าใช้ SDK ใน code → call minimal read (เช่น `sts.getCallerIdentity()` ผ่าน SDK)
3. ถ้า service-specific → call read-only ของ service นั้น (เช่น `s3.listBuckets()`, `dynamodb.listTables()`)

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `wrong-region` / `missing-permission`

## Rules

- ใช้ read-only calls เท่านั้น — ห้าม call ที่เปลี่ยน state
- ไม่ print secret values — แสดงแค่ Account/Arn/Region
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

## Expected Outcome

- Verdict connection พร้อม Account/Region evidence
