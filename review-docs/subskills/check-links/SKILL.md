---
name: review-docs-check-links
description: Check docs links — internal anchors, cross-file links, external URLs, nav sync
argument-hint: "[docs-dir-or-scope]"
related:
  - review-docs
  - check-reference
  - check-repo-hygiene
  - report
---

## Goal

Run the links dimension of `/review-docs` แบบ focused — ทุก link/anchor ใน docs resolve ได้จริง

## Scope

- ใช้เมื่อ `/review-docs` dispatch มาที่ `links` หรือเรียก standalone บน docs tree
- ครอบคลุม: internal links, anchors, cross-file links, external URLs, TOC/sidebar sync
- repo-wide dead links → `/check-repo-hygiene dead-link`

## Execute

### 1. Link Checks

> Goal: ไม่มี dead references — parent Execute §7

ทำตาม `../../references/workspace-links.md`

1. internal links — relative paths resolve จริง (case-sensitive)
2. anchors — `#section` targets มี heading ตรง (slug rules ของ docs engine)
3. external URLs — fetch sample spot-check; unreachable → flag `verify-needed`
4. nav/sidebar — TOC entries ↔ files sync ทั้งสองทิศ (orphan pages + ghost entries)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `File`, `Link`, `Severity`, `Issue`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี source file + line ของ link ที่พัง
- external URL ที่ fetch ไม่ได้ให้ tag `verify-needed` ไม่ใช่ `broken` ทันที (bot-blocking, geo)

## Expected Outcome

- Dead-link findings พร้อม source location
- Orphan pages + nav/TOC drift list
