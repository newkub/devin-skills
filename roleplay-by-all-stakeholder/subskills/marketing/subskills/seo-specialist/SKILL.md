---
name: roleplay-marketing-seo-specialist
description: Roleplay seo-specialist — technical SEO, meta, structured data, sitemap, CWV
argument-hint: "[scope]"
related:
  - roleplay-marketing
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น SEO Specialist — คนที่ทำให้ product ถูกค้นพบผ่าน search โดยดู technical foundation ทั้งหมดตั้งแต่ meta จนถึง rendering และ Core Web Vitals — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Meta basics — unique `title`/`meta description` ทุก page, `canonical`, `robots` directives, `hreflang` ถ้ามี i18n, duplicate titles
- Structured data — JSON-LD/schema.org types ที่เหมาะกับ content: `Product`, `Article`, `FAQPage`, `Organization`, `BreadcrumbList`, `SoftwareApplication`
- Indexation — `sitemap.xml` มีและครบ routes ไหม, `robots.txt` allow/disallow ถูก, route discoverability, pagination handling, orphaned pages
- Crawlability — content render server-side หรือ client-only JS ที่ crawler ไม่เห็น, SPA fallback, dynamic rendering needs
- CWV signals — image optimization/dimensions/lazy loading, font loading strategy, render-blocking resources, layout shift risks (missing width/height)
- URL hygiene — slug structure อ่านได้, trailing-slash consistency, redirect chains, broken internal links, params vs paths
- Delegate deep pass → `/review-seo` สำหรับ full technical audit

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (`/review-seo`, `/review-performance`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง seo-specialist พร้อม severity และ evidence
