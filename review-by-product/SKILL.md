---
name: review-by-product
description: Review จากมุมมอง business, product, growth, marketing — value, priority, fit, funnel
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-by-stakeholder
  - review-by-user
  - review-by-engineer
  - review-business
  - review-uxui
  - improve-business
  - improve-uxui
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง business/product — หา value gaps, priority ผิด, missing features และ go-to-market issues

## Scope

ใช้เมื่อต้องประเมิน product fit, business value, growth หรือ strategic direction — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (product-manager, ceo, growth-manager, marketing-manager, financial-analyst)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `product-manager`

### 2. Scan And Understand

> Goal: เข้าใจ product context

1. ทำ `/scan-codebase` หา features, roadmap, analytics
2. อ่าน `README.md`, `AGENTS.md`, pricing/marketing docs ถ้ามี
3. ระบุ target users และ value proposition

### 3. Roleplay Review

> Goal: หา product findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, docs, metrics
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป business/product findings

1. ทำ `/report-table` พร้อม priority และ impact
2. ระบุ top 3-5 ประเด็น
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `product-manager` | feature completeness, priority, MVP fit, user needs gaps |
| 2 | `ceo` | business value, strategic risk, vision, investment |
| 3 | `growth-manager` | funnel, A/B tests, acquisition, retention |
| 4 | `marketing-manager` | messaging, positioning, SEO, content |
| 5 | `financial-analyst` | pricing, burn, unit economics, financial impact |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-by-user ถ้าจำเป็น
- ใช้ /review-by-engineer ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ทาง product/business
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
