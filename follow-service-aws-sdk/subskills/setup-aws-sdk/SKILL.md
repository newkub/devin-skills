---
name: follow-service-aws-sdk-setup-aws-sdk
description: ติดตั้ง AWS SDK v3 modular packages และตั้งค่า credentials ให้พร้อมใช้งาน
argument-hint: "[aws-service-or-scope]"
related:
  - follow-secret-manager
  - follow-best-practice
  - learn
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

ติดตั้ง AWS SDK v3 (modular packages) และเตรียม credentials ให้ client เรียก AWS services ได้ — first-time setup

## Scope

- ติดตั้ง `@aws-sdk/client-<service>` เฉพาะ service ที่ใช้ — `aws-sdk` v2 ถูก deprecated
- ตั้งค่า credentials ผ่าน env/IAM role
- ถ้า setup แล้ว → verify เท่านั้น; region/endpoint config → `subskills/config-aws-sdk/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `@aws-sdk/client-*` แล้วหรือยัง — ถ้ามี → install เฉพาะที่ขาด
2. ตรวจ env/secrets ว่ามี `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` หรือ `AWS_PROFILE` หรือยัง
3. ถ้าขาด credentials → เก็บผ่าน `/follow-secret-manager` หรือใช้ IAM role (production)

### 2. Install SDK

> Goal: ติดตั้งเฉพาะ modular clients ที่ใช้

1. รัน `bun add @aws-sdk/client-s3` (หรือ service ที่ต้องการ เช่น `@aws-sdk/client-dynamodb`, `@aws-sdk/client-lambda`)
2. ยืนยัน import ได้ เช่น `import { S3Client } from '@aws-sdk/client-s3'`
3. ใช้ TypeScript สำหรับ type safety

### 3. Configure Credentials

> Goal: credential chain ถูกต้อง

1. development → env vars `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` หรือ `aws configure` + `AWS_PROFILE`
2. production → IAM role/instance profile — ห้ามใส่ static keys
3. ห้าม hardcode credentials ใน code — SDK resolve จาก default chain อัตโนมัติ

### 4. Create Client And Smoke Check

> Goal: client ทำงานได้จริง

1. สร้าง client เช่น `new S3Client({ region })` — อ่าน region จาก env/config
2. รัน smoke check ด้วย read-only call เช่น `client.send(new ListBucketsCommand({}))`
3. ถ้า local AWS CLI พร้อม → ตรวจ identity ด้วย `aws sts get-caller-identity`

### 5. Verify

> Goal: SDK ทำงานได้จริง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

## Rules

- ใช้ AWS SDK v3 เท่านั้น — ห้ามเพิ่ม `aws-sdk` v2
- install เฉพาะ clients ที่ใช้จริง (modular)
- ใช้ `/follow-best-practice` และ `/learn-web` ถ้าไม่แน่ใจ API — ดู official docs https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/

## Expected Outcome

- `@aws-sdk/client-*` ติดตั้งเฉพาะ service ที่ใช้
- credentials อยู่ใน env/IAM role ไม่มีใน code
- smoke check ผ่าน — พร้อมไป `subskills/config-aws-sdk/SKILL.md`
