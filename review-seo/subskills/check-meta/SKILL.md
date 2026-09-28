---
name: review-seo-check-meta
description: Check meta/OG tags — title/description unique, OG/Twitter cards, canonical, hreflang
argument-hint: "[scope-or-route]"
related:
  - review-seo
  - scan-codebase
  - report
---

## Goal

Run the meta-tags dimension of `/review-seo` แบบ focused — ทุก public route มี metadata ครบและ unique

## Scope

- ใช้เมื่อ `/review-seo` dispatch มาที่ `meta`/`tags`/`og` หรือเรียก standalone
- ครอบคลุม: title/description, Open Graph, Twitter Cards, canonical, hreflang, robots meta

## Execute

### 1. Meta Checks

> Goal: metadata ครบ unique SSR-rendered — parent Execute (meta section)

ทำตาม `../../references/seo-checklist.md`

1. title/description — unique ต่อ route, length ในเกณฑ์ (50-60 chars / 150-160)
2. OG/Twitter — `og:title`/`og:description`/`og:image` (absolute URL), `twitter:card`
3. canonical — ต่อ route ถูกต้อง, hreflang เมื่อหลาย locale
4. rendering — meta อยู่ใน served HTML (SSR/SSG) ไม่ใช่ client-injected
5. robots meta — `noindex` เฉพาะที่ตั้งใจ

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Route`, `Tag`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน `../improve-seo/SKILL.md`
- ทุก finding มี route + evidence (HTML source หรือ metadata config line)
- ตรวจ served HTML ไม่ใช่แค่ code — SPA-injected tags ไม่นับว่า present

## Expected Outcome

- Per-route meta findings พร้อม missing/duplicate/incorrect tags
- SSR vs client-injected issues แยกชัด
