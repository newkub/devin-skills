---
name: follow-github-actions
description: ตั้งค่า GitHub Actions สำหรับ CI/CD ครบถ้วน
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
  - renovate
  - follow-release-it
---

## Goal

ตั้งค่า GitHub Actions สำหรับ CI/CD ครบถ้วน พร้อม security, testing, deployment, monitoring

## Scope

ตั้งค่า GitHub Actions สำหรับ projects และ repositories

## Execute

### 1. เลือก Workflows ที่เหมาะสม
> Goal: เลือก Workflows ที่เหมาะสม

เลือก workflows ตามความต้องการของ project:

- Base CI/CD: `ci.yml` (lint, typecheck, test) - ทุก project ต้องมี
- Security: `codeql.yml`, `dependabot.yml`, `license-check.yml` - Production project ที่ต้องการ security
- Testing: `coverage.yml`, `e2e.yml`, `mutation.yml`, `sonarqube.yml` - Project ที่ต้องการ quality assurance
- Performance: `lighthouse.yml`, `bundle-size.yml`, `performance-budget.yml` - Web application ที่ต้องการ performance
- Deployment: `deploy-staging.yml`, `deploy-production.yml`, `docker.yml`, `cloudflare-workers.yml`, `cloudflare-pages.yml` - Project ที่ต้องการ automated deployment
- Monitoring: `slack-notify.yml`, `discord-notify.yml`, `artifacts.yml` - Project ที่ต้องการ notifications
- Advanced: `matrix.yml`, `parallel.yml`, `cache.yml` - Project ที่ต้องการ optimization
- Documentation: `deploy-docs.yml`, `changelog.yml`, `docusaurus.yml` - Project ที่มี documentation
- Git Ops: `commitlint.yml`, `dependency-review.yml`, `auto-merge.yml` - Team project ที่ต้องการ governance

### 2. Setup พื้นฐาน
> Goal: Setup พื้นฐาน

1. ทำ `/renovate` เพื่อตั้งค่า dependency updates
2. ทำ `/follow-release-it` เพื่อตั้งค่า automated releases (ถ้าเป็น monorepo)
3. สร้าง `.github/workflows/ci.yml` สำหรับ lint, typecheck, test

### 3. เลือกเพิ่ม Workflows ตามความต้องการ
> Goal: เลือกเพิ่ม Workflows ตามความต้องการ

- Security: เพิ่ม `codeql.yml`, `dependabot.yml` สำหรับ production
- Testing: เพิ่ม `coverage.yml`, `e2e.yml` สำหรับ quality assurance
- Performance: เพิ่ม `lighthouse.yml` สำหรับ web application
- Deployment: เพิ่ม workflows ตาม platform ที่ใช้ (Docker, Cloudflare, Vercel)
- Monitoring: เพิ่ม `slack-notify.yml` สำหรับ team notifications
- Git Ops: เพิ่ม `commitlint.yml`, `dependency-review.yml` สำหรับ team collaboration

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

- เลือก workflows ที่เหมาะสมกับ project
- GitHub Actions ตั้งค่าครบถ้วนตามความต้องการ
- CI/CD ทำงานอัตโนมัติ
