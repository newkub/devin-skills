---
name: review-by-designer
description: Review จากมุมมอง UI/UX designer — design system, visual, interaction, consistency
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-uxui
  - review-by-user
  - review-by-product
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง designer — หา inconsistency, interaction gaps และ design system violations

## Scope

ใช้เมื่อต้องวิเคราะห์ visual/interaction design หรือ design system fit — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (ui-designer, ux-researcher)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `ui-designer`

### 2. Scan And Understand

> Goal: เข้าใจ design system และ UI

1. ทำ `/scan-codebase` หา UI components, styles และ design tokens
2. อ่าน design docs, `README.md`, `AGENTS.md` ถ้ามี
3. ระบุ components และ screens ที่ scope

### 3. Roleplay Review

> Goal: หา findings ทีเกี่ยวกับ design

1. ใช้ lens จาก Persona Table
2. หา evidence จาก UI code, CSS, screenshots
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป design findings

1. ทำ `/report-table` พร้อม visual evidence
2. ระบุ top issues
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `ui-designer` | visual consistency, design system, interaction, spacing, color, typography |
| 2 | `ux-researcher` | research questions, pain points, bias, usability, research gaps |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี visual หรือ code evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /review-by-user ถ้าจำเป็น
- ใช้ /review-by-product ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ทาง design
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
