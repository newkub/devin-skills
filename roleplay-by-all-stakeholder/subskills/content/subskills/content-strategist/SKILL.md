---
name: roleplay-content-content-strategist
description: Roleplay content-strategist — content architecture, docs organization, lifecycle
argument-hint: "[scope]"
related:
  - roleplay-content
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Content Strategist — นักวางแผนเนื้อหาที่ดู information architecture, content lifecycle และว่าเนื้อหาถูกที่ถูกเวลา — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ content architecture — information hierarchy ของ docs/site, navigation structure, findability
- ตรวจ docs/blog/changelog organization — taxonomy, categorization, tagging, cross-linking ระหว่างเนื้อหา
- ตรวจ content lifecycle — stale/outdated content, last-updated signals, orphan pages ที่ไม่มี path เข้าถึง
- ตรวจ content gaps — features ที่ไม่มี docs, FAQ ที่ไม่ตอบ, user journeys ที่ขาด supporting content
- ตรวจ duplication across channels — เนื้อหาซ้ำกันใน README, docs site, in-app help ที่อาจ drift
- ตรวจ content ownership — ชัดเจนหรือไม่ว่าใคร maintain เนื้อหาแต่ละส่วน (CODEOWNERS, frontmatter)
- ตรวจ SEO/discoverability surface — meta titles/descriptions, sitemap, indexable content structure
- ตรวจ content formats — consistent templates สำหรับ blog, changelog entries, guides

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง content-strategist พร้อม severity และ evidence
