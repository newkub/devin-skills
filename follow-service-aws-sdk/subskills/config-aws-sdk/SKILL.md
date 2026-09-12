---
name: follow-service-aws-sdk-config-aws-sdk
description: ตั้งค่า AWS SDK region, credentials chain และ endpoint overrides โดยไม่ clobber ของเดิม
argument-hint: "[aws-service-or-scope]"
related:
  - follow-secret-manager
  - check-config-drift
  - follow-best-practice
  - run-verify
---

## Goal

ตั้งค่า/แก้ไข AWS SDK configuration — region, credentials chain, endpoint overrides และ client options — โดย merge กับ config เดิม

## Scope

- ครอบคลุม env keys, client options และ local endpoints (เช่น LocalStack)
- ถ้ายังไม่ได้ install/credentials → ทำ `subskills/setup-aws-sdk/SKILL.md` ก่อน

## Execute

### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน client construction ปัจจุบัน, env keys (`AWS_REGION`, `AWS_PROFILE`, `AWS_ENDPOINT_URL*`) และ `~/.aws/config` ถ้าเกี่ยวข้อง
2. ทำ `/check-config-drift` ถ้าต้องเทียบ env กับ code
3. ถ้าไม่พบ client → ทำ `subskills/setup-aws-sdk/SKILL.md` ก่อน

### 2. Configure Region

> Goal: region ถูกต้องและ consistent

1. ใช้ `AWS_REGION` env เป็นแหล่งหลัก — client option `{ region }` เฉพาะเมื่อต้อง override
2. ยืนยัน region ตรงกับ resources จริง (S3 bucket region, DynamoDB table region)

### 3. Configure Credentials Chain

> Goal: SDK resolve credentials ถูกลำดับ

1. ใช้ default provider chain: env vars → shared config/`AWS_PROFILE` → IAM role
2. สำหรับ assume role → ใช้ `@aws-sdk/credential-providers` (`fromTemporaryCredentials`) ตาม official docs
3. secrets ทั้งหมดผ่าน `/follow-secret-manager` — ห้าม hardcode

### 4. Configure Endpoints And Options

> Goal: endpoint overrides ถูก scope

1. สำหรับ local dev (LocalStack) → ตั้ง `endpoint` ใน client options หรือ env `AWS_ENDPOINT_URL` เฉพาะ dev
2. เพิ่ม options ที่จำเป็นเช่น `maxAttempts`, `requestHandler` timeouts — เฉพาะที่ใช้จริง
3. guard endpoint overrides ด้วย `NODE_ENV` — ห้ามชี้ local endpoint บน production

### 5. Verify

> Goal: config ใช้ได้กับ AWS จริงหรือ local endpoint

1. รัน smoke call เช่น `ListBucketsCommand` หรือ `DescribeTableCommand`
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

## Rules

- แก้เฉพาะ keys/options ที่จำเป็น — ห้าม overwrite config ทั้งชุด
- production ใช้ IAM role — ห้าม static credentials
- endpoint overrides ต้อง scoped ต่อ environment
- ใช้ `/follow-best-practice` สำหรับ retry/timeout patterns

## Expected Outcome

- region/credentials chain ถูกต้องต่อ environment
- endpoint overrides ทำงานใน dev โดยไม่กระทบ production
- smoke call สำเร็จ — lint, typecheck ผ่าน
