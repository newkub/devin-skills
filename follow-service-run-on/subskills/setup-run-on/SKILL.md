---
name: follow-service-run-on-setup-run-on
description: ติดตั้ง RunsOn stack บน AWS และ register GitHub App สำหรับ self-hosted runners
argument-hint: "[aws-region] [github-org]"
related:
  - ask-me
  - deep-validate
  - follow-secret-manager
  - setup-cicd
---

## Goal

ติดตั้ง RunsOn stack บน AWS (CloudFormation/Terraform), register GitHub App และเปิด self-hosted runners ให้ repo — first-time setup

## Scope

- ครอบคลุม AWS stack, GitHub App registration และ org settings
- ไม่รวมการสร้าง AWS account, การซื้อ license หรือ commit/push อัตโนมัติ
- config runner labels/workflows → `subskills/config-run-on/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: context และสิทธิ์พร้อมก่อน deploy stack

1. ตรวจ `aws --version` และ AWS credentials ว่ามีสิทธิ์สร้าง CloudFormation stack
2. ยืนยัน GitHub organization/account และ RunsOn license key กับ user
3. เลือก AWS region เช่น `us-east-1`
4. ถ้าขาด context → หยุดและทำ `/ask-me`

### 2. Deploy AWS Stack

> Goal: RunsOn infrastructure ทำงานบน AWS

1. ใช้ CloudFormation quick-create URL จาก https://runs-on.com/installation/ — ตรวจ latest template ก่อนใช้เสมอ
2. กรอก parameters: GitHub org, `LicenseKey`, email สำหรับ cost alerts
3. ถ้า fail ด้วย `Unable to assume the service linked role` → รัน `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. รอ stack status `CREATE_COMPLETE` แล้วบันทึก `RunsOnEntryPoint` output URL
5. เก็บ `LicenseKey` ผ่าน `/follow-secret-manager` — ห้าม commit

### 3. Register GitHub App

> Goal: repo เชื่อมกับ RunsOn

1. เปิด `RunsOnEntryPoint` URL แล้วกด `Register app` เพื่อสร้าง private GitHub App
2. เลือก repositories ที่ให้ app เข้าถึง
3. เปิด org settings → Actions เพื่อ enable repository-level self-hosted runners

### 4. Validate

> Goal: runner รันได้จริง

1. สร้าง workflow ทดสอบหรือ trigger `workflow_dispatch` ด้วย `runs-on:` label
2. ตรวจ GitHub Actions logs ว่ารันบน `runs-on` runner และ EC2 instance launch/terminate ถูกต้อง
3. ถ้า fail → ทำ `/deep-validate` แล้ว `/ask-me`

## Rules

- ถาม user ก่อน deploy stack — เป็น infrastructure change ที่มี cost
- ติดตั้งใน dedicated AWS sub-account เพื่อ isolation
- ห้าม hardcode `LicenseKey` ในไฟล์ใดๆ
- ใช้ official docs https://runs-on.com เป็นแหล่งหลัก

## Expected Outcome

- RunsOn stack `CREATE_COMPLETE` และ GitHub App register แล้ว
- workflow ทดสอบรันบน self-hosted runner สำเร็จ
- พร้อมไป `subskills/config-run-on/SKILL.md`
