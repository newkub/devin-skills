---
name: review-seo
description: Review SEO ครอบคลุม technical, on-page, structured data, CWV, hreflang
argument-hint: "[scope]"
related:
  - review-uxui
  - review-performance
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report-table
  - suggest-next-action
  - review-frontend
  - follow-my-tech-stack
---

## Goal

Review SEO ครอบคลุม technical SEO, on-page SEO, structured data, Core Web Vitals, sitemap, international SEO, semantic HTML พร้อม severity ratings และ review score

## Scope

ใช้สำหรับ review SEO ของ web applications:
- `technical`: crawling, indexing, `robots.txt`, sitemap, canonical, hreflang, URL structure
- `on-page`: title tags, meta descriptions, headings, Open Graph, Twitter Cards, internal linking
- `structured-data`: JSON-LD, schema types, validity
- `performance-for-seo`: LCP, INP, CLS, FCP, TBT, Speed Index
- `content`: semantic HTML, image alt texts, heading hierarchy, content discoverability
- `international`: hreflang, locale-specific URLs

ไม่รวม UX/UI design, accessibility, general performance — ใช้ `/review-uxui`, `/review-performance` ตามทีเหมาะสม

## Execute
### 1. Prepare And Scan

> Goal: เข้าใจ web structure, framework, และ SEO setup

1. ทำ `/scan-codebase`
2. ระบุ SEO tools ที่มี
3. ทำ `/deep-analyze` และ `/run-review`

### 2. Technical SEO Review

> Goal: search engines สามารถ crawl และ index ได้

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน Technical SEO

### 3. On-Page SEO Review

> Goal: แต่ละ page มี on-page signals ที่ถูกต้อง

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน On-Page SEO

### 4. Structured Data And Schema Review

> Goal: structured data ถูกต้องและครอบคลุม

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน Structured Data And Schema

### 5. Core Web Vitals For SEO

> Goal: page experience signals ผ่านเกณฑ์ SEO

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน Core Web Vitals For SEO

### 6. International And SSR SEO

> Goal: SEO รองรับหลาย locale และ rendering strategy

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน International And SSR SEO

### 7. Content And Semantic HTML

> Goal: content ถูกโครงสร้างและ discoverable

1. ทำตาม [references/seo-checklist.md](references/seo-checklist.md) — ส่วน Content And Semantic HTML

### 8. Validate, Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate`
2. ทำ `/deep-validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. ทำตาม `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules
### 1. Scope Boundary

- เน้น SEO บน web applications
- ไม่ซ้ำกับ `/review-uxui`, `/review-performance`, `/review-platform`
- ถ้าพบ accessibility/performance issues → ระบุเป็น info และแนะนำ sub-skill

### 2. Skip Conditions

- ถ้า project ไม่ใช่ web app → ข้ามทังหมด
- ถ้า project เป็น SPA ไม่มี SSR/SSG → ข้าม SSR SEO
- ถ้า project ไม่มี multi-locale → ข้าม international SEO
- ถ้า project ไม่มี sitemap → ข้าม sitemap section
- ถ้า project ไม่มี structured data → ข้าม structured data review

### 3. Severity Classification

- Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in `robots.txt`, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
- High: missing Open Graph, missing structured data, broken heading hierarchy, missing hreflang, poor URL structure, missing internal links, slow LCP
- Medium: suboptimal meta description length, missing Twitter Cards, inconsistent URL structure, missing breadcrumbs, minor heading issue
- Low: cosmetic, minor meta tag improvement, documentation gap

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number
- ระบุ meta tag, URL, heading, schema ที่เกี่ยวข้อง
- ใช้ Lighthouse หรือ SEO tools ประกอบ
- ไม่เดา

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ symbols: ผ่าน, ไม่ผ่าน, warning

- ใช้ /review-frontend ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น

## Expected Outcome
- รายงาน SEO findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
