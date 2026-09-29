---
name: review-compliance-check-privacy
description: Check privacy-by-design — consent, data minimization, DSAR, retention, cross-border
argument-hint: "[scope-or-regulation]"
related:
  - review-compliance
  - use-astgrep
  - report
---

## Goal

Run the privacy-by-design dimension of `/review-compliance` แบบ focused — data handling ตรง regulation requirements

## Scope

- ใช้เมื่อ `/review-compliance` dispatch มาที่ `privacy`/`gdpr`/`pdpa` หรือเรียก standalone พร้อม regulation arg
- ครอบคลุม: consent, minimization, DSAR flows, retention, cross-border transfer — regulation-specific checklists ใน `../../subagents/compliance-reviewer/`

## Execute

### 1. Privacy Checks

> Goal: data practices ตรง regulation — parent Execute §4

ทำตาม `../../subagents/compliance-reviewer/privacy-design.md`

1. consent — opt-in before tracking, granular purposes, withdrawal path (`../../subagents/compliance-reviewer/consent.md`)
2. minimization — collect เฉพาะที่จำเป็น, PII fields inventory vs purpose
3. DSAR — export/delete user data flows ทำงานได้ (`../../subagents/compliance-reviewer/dsar.md`)
4. retention — data retention limits + purge jobs (`../../subagents/compliance-reviewer/data-retention.md`)
5. cross-border — transfer mechanisms ถูกต้อง (`../../subagents/compliance-reviewer/cross-border.md`)

### 2. Regulation Mapping

> Goal: findings map เข้า regulation ที่ apply

1. เลือก checklist ตาม scope: `../../subagents/compliance-reviewer/gdpr.md`, `pdpa.md`, `ccpa.md`, `hipaa.md`, `pci-dss.md`, `soc2.md`
2. ทุก finding tag regulation + article/clause ที่เกี่ยว

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Regulation`, `Requirement`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น ไม่แก้ code/config — fix ใน parent `## Fix`
- ทุก finding มี evidence: code path, config, หรือ missing artifact
- ไม่ให้ legal advice — report technical gaps + flag legal review

## Expected Outcome

- Privacy findings mapped ต่อ regulation พร้อม severity
- DSAR/retention/consent gaps พร้อม evidence
