---
name: follow-github-workflows
description: วิเคราะหาและเขียน GitHub workflows ที่ควรมีตามที่ควรจะเป็นให้เหมาะสม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - follow-github-actions
  - analyze-project
---

## Goal

วิเคราะหาและเขียน GitHub workflows ที่ควรมีตามที่ควรจะเป็นให้เหมาะสม

## Scope

ใช้สำหรับการตั้งค่า GitHub Actions, CI/CD pipelines, และ automation workflows

## Execute

### 1. Analyze Project
> Goal: Analyze Project

วิเคราะหาโปรเจกต์เพื่อเข้าใจความต้องการ

1. ทำ `/analyze-project` เพื่อวิเคราะหาโครงสร้างและ dependencies
2. ระบุ tech stack และ runtime environment
3. ระบุ build tools และ testing frameworks
4. ระบุ deployment targets

### 2. Analyze Existing Workflows
> Goal: Analyze Existing Workflows

วิเคราะหา GitHub workflows ที่มีอยู่แล้ว

1. อ่าน `.github/workflows/` directory
2. วิเคราะหา workflows ที่มีอยู่แล้ว
3. ระบุ workflows ที่ขาดหาย
4. ระบุ workflows ที่ซ้ำซ้อนหรือไม่มีประสิทธิภาพ

### 3. Plan Workflows
> Goal: Plan Workflows

วางแผน GitHub workflows ที่ควรมี

1. ระบุ workflows สำหรับ CI (lint, typecheck, test)
2. ระบุ workflows สำหรับ CD (build, deploy)
3. ระบุ workflows สำหรับ automation (release, dependency update)
4. ระบุ workflows สำหรับ security (vulnerability scan, code review)

### 4. Write Workflows
> Goal: Write Workflows

เขียน GitHub workflows ตาม best practices

1. ทำ `/follow-github-actions` เพื่อเขียน workflows
2. ใช้ `actions/checkout@v4` สำหรับ repository checkout
3. ใช้ caching สำหรับ dependencies
4. ตั้งค่า permissions และ secrets อย่างปลอดภัย

### 5. Validate And Test
> Goal: Validate And Test

ตรวจสอบและทดสอบ workflows

1. ทดสอบ workflows ด้วย `act` หรือ local runner
2. ตรวจสอบ syntax และ configuration
3. ตรวจสอบ permissions และ secrets
4. ทดสอบ workflows บน production branch

## Rules

### 1. CI First

ต้องมี CI workflows ก่อน CD

- ทำ `lint` และ `typecheck` ก่อน deploy
- ทำ `test` ก่อน merge
- ใช้ `required` checks สำหรับ branch protection
- ใช้ `status checks` สำหรับ PR validation

### 2. Caching Strategy

ใช้ caching เพื่อเพิ่มประสิทธิภาพ

- Cache `node_modules` สำหรับ JavaScript/TypeScript
- Cache dependencies สำหรับ package managers
- Cache build artifacts สำหรับ faster builds
- ใช้ cache keys ที่เหมาะสมกับ dependencies

### 3. Security Best Practices

ต้องปฏิบัติ security best practices

- ใช้ `permissions: contents: read` สำหรับ public repos
- ใช้ `permissions: write` สำหรับ private repos เท่านั้น
- ใช้ `secrets` สำหรับ sensitive data
- ไม่ hardcode credentials ใน workflows

### 4. Workflow Organization

จัดระเบียบ workflows อย่างเป็นระบบ

- แยก CI และ CD workflows
- ใช้ composite actions สำหรับ reusability
- ใช้ matrix strategy สำหรับ multiple configurations
- ใช้ workflow templates สำหรับ consistency

### 5. Monitoring And Notifications

ตั้งค่า monitoring และ notifications

- ใช้ `actions/github-script` สำหรับ notifications
- ตั้งค่า Slack/Discord notifications สำหรับ failures
- ใช้ `actions/upload-artifact` สำหรับ build artifacts
- ตั้งค่า status checks สำหรับ PR validation

## Expected Outcome

- GitHub workflows ที่ครอบคลุม CI/CD
- Build times ที่เร็วขึ้นด้วย caching
- Security ที่ดีขึ้นด้วย best practices
- PR validation ที่มีประสิทธิภาพ

## Common Mistakes (optional

ข้อผิดพลาดที่พบบอย่าง:

- ไม่มี CI checks ก่อน CD
- ไม่ใช้ caching ทำให้ builds ช้า
- Hardcode secrets ใน workflows
- ไม่ตั้งค่า permissions อย่างปลอดภัย
- Workflows ที่ซับซ้อนและไม่มีประสิทธิภาพ
