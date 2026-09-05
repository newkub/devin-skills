---
name: review-by-user
description: Review จากมุมมอง user, customer success และ support — journey, friction, churn, onboarding
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-uxui
  - review-by-designer
  - review-by-product
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง end-user และ customer-facing teams — หา friction ใน journey, onboarding, support gaps และ churn risks

## Scope

ใช้เมื่อต้องวิเคราะห์ user experience ทั้งหมด: ทั้ง usability, feature fit และ emotional journey — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้จาก argument (user, customer-success-manager, customer-support-agent, ux-researcher)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้า role ไม่ชัด → ใช้ default `user`

### 2. Scan And Understand

> Goal: เข้าใจ product context

1. ทำ `/scan-codebase` หา entry points, flows และ docs
2. อ่าน `README.md`, `AGENTS.md`, `docs/` ถ้ามี
3. ระบุ user flows ที่เกี่ยวข้องกับ persona

### 3. Roleplay Review

> Goal: หา findings จากมุมมอง user

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, docs
3. จัด findings ตาม severity: Critical, High, Medium, Low, Info

### 4. Report

> Goal: สรุป findings และ next actions

1. ทำ `/report-table` พร้อม findings, evidence, recommendation
2. ระบุ top 3-5 ประเด็น
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `user` | ทำไมต้องใช้? onboarding ง่ายไหม? value proposition ชัดไหม? friction ตรงไหน? |
| 2 | `customer-success-manager` | health score, onboarding, churn, support gaps |
| 3 | `customer-support-agent` | ปัญหาที่ user ถามบ่อย, จุดที่ support ไม่มีคำตอบ, docs ที่ขาด |
| 4 | `ux-researcher` | pain points, bias ใน design, usability, research gaps |

## Rules

- ไม่แก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence
- ถ้า role ไม่ชัด → ถามก่อน
- ใช้ lens ของ role โดยเฉพาะ

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /review-by-designer ถ้าจำเป็น
- ใช้ /review-by-product ถ้าจำเป็น

## Expected Outcome

- รายงาน findings จากมุมมอง user-facing
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
