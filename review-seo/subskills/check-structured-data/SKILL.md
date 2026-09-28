---
name: review-seo-check-structured-data
description: Check structured data — JSON-LD types, required fields, validity per page type
argument-hint: "[scope-or-route]"
related:
  - review-seo
  - report
---

## Goal

Run the structured-data dimension of `/review-seo` แบบ focused — JSON-LD ถูก type ครบ fields และ validate ผ่าน

## Scope

- ใช้เมื่อ `/review-seo` dispatch มาที่ `structured-data`/`jsonld`/`schema` หรือเรียก standalone
- ครอบคลุม: JSON-LD presence, schema.org types ตรง page type, required fields, validity

## Execute

### 1. Structured Data Checks

> Goal: rich results eligible — parent Execute (structured data section)

ทำตาม `../../references/seo-checklist.md`

1. presence — page types ที่ควรมี JSON-LD (Product, Article, BreadcrumbList, Organization, FAQPage)
2. type match — schema type ตรง content จริง ไม่ใส่ type เพื่อ rich results ลอยๆ
3. required fields — fields บังคับต่อ type ครบ (เช่น Product: name, offers, image)
4. validity — syntax + values มาจาก data จริง ไม่ hardcode ที่ขัดหน้า
5. duplicates — JSON-LD blocks ซ้ำ/conflicting บนหน้าเดียว

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Route`, `Schema Type`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน `../improve-seo/SKILL.md`
- ทุก finding มี route + JSON-LD location
- schema mismatch content (spam signal) = High; missing optional fields = Low

## Expected Outcome

- Structured-data findings per route พร้อม type/field gaps
- Invalid/conflicting JSON-LD flagged พร้อม evidence
