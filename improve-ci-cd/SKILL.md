---
name: improve-ci-cd
description: ปรับปรุง ci-cd และ pipeline ของ project
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - improve-codebase
  - follow-ci-cd
---

## Goal

ปรับปรุง ci-cd และ pipeline ของ project ให้เร็ว น่าเชื่อถือ และ maintain ง่าย

## Scope

ใช้กับ CI/CD configuration, build pipeline, test pipeline, deployment pipeline, release automation ใน project หรือ workspace

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบัน
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ระบุ CI/CD platform: GitHub Actions, GitLab CI, Azure DevOps, Jenkins, etc.
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve CI/CD Setup
> Goal: pipeline ตั้งค่าถูกต้อง
1. ทำ /follow-ci-cd ถ้า pipeline ยังไม่มีหรือต้องสร้างใหม่
2. ใช้ /follow-best-practice หรือ /learn-from-web หา best practices สำหรับ platform
3. แก้ไขปัญหาตาม priority

### 3. Optimize Pipeline
> Goal: ลดเวลา pipeline และ failure rate
1. ตรวจสอบ job dependencies และ parallelization
2. ใช้ caching สำหรับ dependencies, build artifacts
3. ลด unnecessary jobs, redundant builds, หรือ matrix ที่ไม่จำเป็น
4. ใช้ conditional jobs เพื่อ skip งานที่ไม่จำเป็น
5. ตรวจสอบ artifact size, retention policy

### 4. Improve Reliability
> Goal: pipeline น่าเชื่อถือ
1. ใช้ /review-reliability สำหรับ retry, timeout, idempotency
2. ตรวจสอบ secrets, environment variables, permission
3. ใช้ dry run ก่อน deployment ทีสำคัญ

### 5. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. รัน pipeline หรือ simulate ใน local ถ้าได้
3. ถ้าไม่ผ่าน → ทำ /resolve-errors แล้ว retry (max 3)
4. ทำ /suggest-next-action

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ /ask-me

### 2. Security
- ไม่ expose secrets ใน pipeline logs
- ตรวจสอบ permissions ก่อน deployment

## Expected Outcome

- ci-cd เร็วขึ้น น่าเชื่อถือขึ้น
- ไม่มี regression ใน build/deploy
- รายงานสรุปผล
