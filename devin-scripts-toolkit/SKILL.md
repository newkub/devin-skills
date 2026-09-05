---
name: devin-scripts-toolkit
description: รวม PowerShell scripts สำหรับ check, review, setup, build, deploy ใช้ได้ทั่ว skills และ projects
argument-hint: "[scope]"
related:
  - devin-templates-toolkit
  - review-devin-global-skills
  - check-broken-skills-references
  - follow-create-web
  - setup-cicd
  - ship
---

## Goal

รวม PowerShell scripts ทีใช้ซ้ำได้ทั่ว devin skills ecosystem และ projects

## Scope

- Skill validation scripts (e.g. `/review-devin-global-skills`, `/check-broken-skills-references`)
- Project health check scripts
- Build/test/run scripts
- Setup/deployment helper scripts (e.g. `/setup-cicd`)
- ใช้ร่วมกับ `/follow-create-web` เพื่อ setup project

## Execute

### 1. Validate Skills

> Goal: ตรวจ skills repo

1. รัน `scripts/devin-skills-audit.ps1`
2. รัน `scripts/check-skills-mentions.ps1 -FilterSkill <skill>`
3. รัน `scripts/check-skills-references.ps1`

### 2. Validate Project

> Goal: ตรวจ project tech stack, config, quality

1. รัน `scripts/check-techstack.ps1 -ProjectDir <path>`
2. รัน `scripts/check-config-files.ps1 -ProjectDir <path>`
3. รัน `scripts/check-broken-references.ps1 -ProjectDir <path>`
4. รัน `scripts/check-naming-conventions.ps1 -ProjectDir <path>`
5. รัน `scripts/check-quality.ps1 -ProjectDir <path>`

### 3. Fix Skill Names

> Goal: แก้ชื่อ skill ให้ตรง directory

1. รัน `scripts/fix-skill-names.ps1 -WhatIf`
2. ถ้าถูกต้อง รัน `scripts/fix-skill-names.ps1`

## Scripts

| Script | ใช้ทำอะไร |
|--------|-----------|
| `devin-skills-audit.ps1` | รวม check frontmatter, references, mentions, line-count |
| `check-skills-frontmatter.ps1` | ตรวจ frontmatter |
| `check-skills-references.ps1` | ตรวจ related references |
| `check-skills-mentions.ps1` | ตรวจ related ใน content |
| `check-skills-line-count.ps1` | ตรวจ SKILL.md <= 250 บรรทัด |
| `check-techstack.ps1` | ตรวจ package.json/Cargo.toml |
| `check-config-files.ps1` | ตรวจ config files |
| `check-broken-references.ps1` | ตรวจ broken skill references |
| `check-naming-conventions.ps1` | ตรวจ naming |
| `check-quality.ps1` | รัน lint, typecheck, build |
| `fix-skill-names.ps1` | แก้ name ให้ตรง directory |
| `list-skills.ps1` | list skills |

## Rules

- ใช้ scripts นี้ก่อน `/ship`
- ใช้ `/devin-templates-toolkit` สำหรับ templates
- ไม่ hardcode paths ใน scripts
- ใช้ `Write-Host` สีเขียวสำหรับ OK, เหลืองสำหรับ warning, แดงสำหรับ error

## Expected Outcome

- ตรวจ skills และ project ได้เร็ว
- ลด manual review
- มี scripts reusable ทั่ว ecosystem

