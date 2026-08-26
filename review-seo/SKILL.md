---
name: review-seo
description: Review SEO ครอบคลุม technical, on-page, structured data, Core Web Vitals, sitemap, international SEO
related:
  - review-uxui
  - review-performance
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

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, framework, routing, i18n setup
2. ระบุ SEO tools ที่มี: Lighthouse, Screaming Frog, ahrefs, Google Search Console
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/run-review` เพื่อดึง review metrics ล่าสุด

### 2. Technical SEO Review

> Goal: search engines สามารถ crawl และ index ได้

1. ตรวจสอบ `robots.txt`: allow/disallow rules, sitemap reference, `crawl-delay`, `noindex` directives
2. ตรวจสอบ `sitemap.xml`: generation, completeness, freshness, `lastmod`, sitemap index
3. ตรวจสอบ canonical URLs: presence, correctness, duplicate content prevention, canonical vs hreflang
4. ตรวจสอบ URL structure: readability, length, consistency, trailing slash, query string usage
5. ตรวจสอบ internal linking: broken links, orphan pages, anchor text quality, link depth, breadcrumbs
6. ถ้า project ไม่ใช่ web app → ข้าม step นี้

### 3. On-Page SEO Review

> Goal: แต่ละ page มี on-page signals ที่ถูกต้อง

1. ตรวจสอบ title tags: length, uniqueness, keyword placement
2. ตรวจสอบ meta descriptions: length, uniqueness, compelling
3. ตรวจสอบ heading hierarchy: H1 หนึ่งต่อ page, H1→H2→H3 order, heading text quality
4. ตรวจสอบ Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`
5. ตรวจสอบ Twitter Card tags
6. ถ้า project ไม่มี web pages → ข้าม step นี้

### 4. Structured Data And Schema Review

> Goal: structured data ถูกต้องและครอบคลุม

1. ตรวจสอบ JSON-LD schema validity
2. ตรวจสอบ schema type coverage: Article, Product, BreadcrumbList, Organization, WebSite
3. ตรวจสอบ structured data testing, missing schema on key pages
4. ถ้า project ไม่มี structured data → ข้าม step นี้

### 5. Core Web Vitals For SEO

> Goal: page experience signals ผ่านเกณฑ์ SEO

1. ตรวจสอบ LCP, INP, CLS, FCP, TBT, Speed Index
2. ตรวจสอบ page speed signals: rendering time, resource loading, layout stability
3. ทำ `/review-performance` สำหรับ performance bottlenecks ที่กระทบ SEO
4. ถ้าไม่มี web pages → ข้าม step นี้

### 6. International And SSR SEO

> Goal: SEO รองรับหลาย locale และ rendering strategy

1. ตรวจสอบ SSR/SSG: server-side rendering, pre-rendered pages, crawlable content, meta tag injection on server
2. ตรวจสอบ hreflang tags, locale-specific URLs, locale-specific sitemap
3. ตรวจสอบ dynamic rendering strategy สำหรับ SPA
4. ถ้า project ไม่มี multi-locale → ข้าม international SEO
5. ถ้า project เป็น SPA ไม่มี SSR/SSG → ข้าม SSR SEO

### 7. Content And Semantic HTML

> Goal: content ถูกโครงสร้างและ discoverable

1. ตรวจสอบ semantic HTML: `article`, `section`, `nav`, `header`, `footer`, `main`, `aside`
2. ตรวจสอบ image alt texts บน critical images
3. ตรวจสอบ ARIA impact on SEO
4. ทำ `/review-uxui` สำหรับ accessibility ทัศน์ที่เกี่ยวข้องกับ SEO
5. ถ้าไม่มี web pages → ข้าม step นี้

### 8. Validate, Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. คำนวณ review score ตาม `references/scoring.md`
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

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม"
- ห้าม TODO, MOCK, placeholder

## Expected Outcome

- รายงาน SEO findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
