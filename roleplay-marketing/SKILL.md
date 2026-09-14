---
name: roleplay-marketing
description: Roleplay marketing personas — strategist, content, seo, brand, social-media
argument-hint: "<role> [scope]"
related:
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
  - suggest-next-action
---

## Goal

รับบท marketing persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

## Scope

ใช้เมื่อต้องการมุมมอง marketing — ส่งต่อจาก `/roleplay-by-all-stakeholder` หรือเรียกตรงด้วย `/roleplay-marketing <role>`

## Execute

### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Subskill |
|------|-------|----------|
| marketing-strategist | value prop clarity, landing/pricing structure, CTA quality | `subskills/marketing-strategist/SKILL.md` |
| content-marketer | content surface, content quality, distribution hooks | `subskills/content-marketer/SKILL.md` |
| seo-specialist | technical SEO, meta, structured data, sitemap, CWV | `subskills/seo-specialist/SKILL.md` |
| brand-strategist | naming/visual consistency, brand voice, asset usage | `subskills/brand-strategist/SKILL.md` |
| social-media-manager | OG metadata, social cards, shareable moments, integrations | `subskills/social-media-manager/SKILL.md` |

2. อ่าน `subskills/<role>/SKILL.md` ของ role ที่เลือก

### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ subskill — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

## Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

## Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations
