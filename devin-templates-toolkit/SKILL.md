---
name: devin-templates-toolkit
description: รวม templates สำหรับ web, TUI, CI/CD, docs ใช้ copy แล้วปรับตาม project
related:
  - devin-scripts-toolkit
  - follow-create-web
  - follow-create-tui
  - create-cloudflare-project
  - setup-cicd
  - setup-package
  - write-how-to
  - update-agents-md
---

## Goal

รวม templates เริ่มต้นสำหรับสร้าง project, CI/CD, docs และ TUI apps

## Scope

- Web templates (landing, saas, paas) สำหรับ `/follow-create-web`
- TUI templates (`/follow-create-tui`) แบบ Ratatui
- CI/CD templates (GitHub Actions) สำหรับ `/setup-cicd`
- Package setup templates สำหรับ `/setup-package`
- Documentation templates (`/write-how-to`, `/update-agents-md`, README.md)
- Cloudflare templates สำหรับ `/create-cloudflare-project`

## Execute

### 1. Choose Template

> Goal: เลือก template ตาม project type

1. ตรวจ project type
2. เลือก template จาก `templates/<category>/`
3. Copy ไปยัง project directory

### 2. Adapt Template

> Goal: ปรับให้เข้ากับ project

1. แก้ placeholders เช่น `<project-name>`, `<repo-name>`
2. ลบส่วนทีไม่จำเป็น
3. ใช้ `/devin-scripts-toolkit` ตรวจหลัง copy

### 3. Verify

> Goal: ยืนยันว่า template ใช้งานได้

1. รัน `/review-techstack`
2. รัน `/report-config-files`
3. รัน `/check-broken-skills-references`

## Templates

| Category | Templates |
|----------|-----------|
| `templates/web/` | landing, saas, paas starter templates |
| `templates/tui/` | ratatui app starter |
| `templates/cicd/` | GitHub Actions deploy workflows |
| `templates/docs/` | AGENTS.md, README.md, how-to templates |

## Rules

- ใช้ templates นี้ก่อนสร้าง project
- ปรับ template ให้เข้ากับ stack จริง
- ไม่ commit template ทียังไม่ปรับ
- คู่กับ `/devin-scripts-toolkit`

## Expected Outcome

- สร้าง project ได้เร็วขึ้น
- ลด setup time
- มาแบบสม่ำเสมอ
