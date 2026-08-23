---
name: review-seo
description: SEO review checklist for meta, structured data, performance, and sitemap
---


## Goal

Review SEO ครอบคลุม meta tags, structured data, performance, sitemap, Open Graph, canonical URLs, robots.txt, SSR/SSG, international SEO, semantic HTML, Core Web Vitals พร้อม review score

## Scope

SEO review สำหรับ: meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt, canonical URLs, SSR/SSG SEO, semantic HTML, heading hierarchy, Core Web Vitals, international SEO (hreflang), URL structure, internal linking

## Execute

### 1. Analyze

> Goal: วิเคราะห์สถานะปัจจุบัน

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ถ้าไม่พบ issues -> stop และ report
4. ระบุ rendering mode (SSR, SSG, SPA), meta tag strategy, sitemap generation, robots.txt config ที่ใช้

### 2. Review

> Goal: รีวิว SEO ตาม checklist โดยแปลง action `ปรับปรุง` จาก `improve-seo` เป็น `รีวิว`

1. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา best practices สำหรับรีวิว
2. รีวิว issues ตาม priority
3. ถ้าต้องรีวิว >10 ไฟล์ -> ทำ `/use-scripts`
4. ทำ `/deep-analyze` เพื่อวิเคราะห์ SEO patterns
5. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
6. ถ้า `/update-create-review-cli` ข้าม `/update-rules` -> ทำ `/update-rules` แยก
7. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
8. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

#### 2.1 Meta Review

> Goal: ครอบคลุม meta tags, Open Graph, canonical URLs

1. ตรวจสอบ meta tags: title tags (length, uniqueness, keyword placement), meta description (length, uniqueness, compelling), meta keywords (if used), viewport meta, charset meta
2. ตรวจสอบ Open Graph: og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale, Twitter Card tags
3. ตรวจสอบ canonical URLs: canonical tag presence, canonical URL correctness, duplicate content prevention, canonical vs hreflang

#### 2.2 Structured Data Review

> Goal: ครอบคลุม JSON-LD schema validity และ coverage

1. ตรวจสอบ structured data: JSON-LD schema validity, schema type coverage (Article, Product, BreadcrumbList, Organization, WebSite), structured data testing, missing schema on key pages

#### 2.3 Performance Review

> Goal: ครอบคลุม Core Web Vitals for SEO

1. ตรวจสอบ Core Web Vitals for SEO: LCP, FID/INP, CLS, FCP, TBT, Speed Index — impact on search ranking
2. ตรวจสอบ page speed signals ที่เกี่ยวข้องกับ SEO: rendering time, resource loading, layout stability

#### 2.4 Sitemap Review

> Goal: ครอบคลุม sitemap, robots.txt, URL structure, internal linking

1. ตรวจสอบ sitemap: sitemap.xml generation, sitemap completeness, sitemap freshness, sitemap index, lastmod accuracy, changefreq, priority
2. ตรวจสอบ robots.txt: robots.txt config, allow/disallow rules, crawl-delay, sitemap reference, noindex directives
3. ตรวจสอบ URL structure: URL readability, URL length, keyword in URL, URL consistency, trailing slash consistency, URL case sensitivity, query string usage
4. ตรวจสอบ internal linking: internal link structure, anchor text quality, broken internal links, orphan pages, link depth, breadcrumb navigation
5. ตรวจสอบ heading hierarchy: H1 uniqueness per page, heading order (H1→H2→H3), heading text quality, missing H1, multiple H1

#### 2.5 SSR And International Review

> Goal: ครอบคลุม SSR SEO และ international SEO

1. ตรวจสอบ SSR/SSG SEO: server-side rendering for SEO, pre-rendered pages, dynamic rendering strategy, crawlable content, meta tag injection on server
2. ตรวจสอบ international SEO: hreflang tags, locale-specific URLs, locale-specific sitemap, international targeting, ccTLD vs subdirectory vs subdomain

#### 2.6 Semantic HTML Review

> Goal: ครอบคลุม semantic HTML for SEO

1. ตรวจสอบ semantic HTML for SEO: semantic tags (article, section, nav, header, footer, main, aside), ARIA impact on SEO, image alt texts for SEO

#### 2.7 Severity Markers

> Goal: ระบุ critical และ high impact SEO issues

1. Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in robots.txt, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
2. High: missing Open Graph, missing structured data, broken heading hierarchy, missing hreflang, poor URL structure, missing internal links, slow LCP

### 3. Validate and Report

> Goal: ยืนยันว่า findings ถูกต้องและรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` หรือ `/run-check` สำหรับ cross-check
3. ถ้าไม่ผ่าน -> ทำ `/resolve-errors` แล้ว retry (max 3)
4. จัดลำดับตาม severity: Critical → High → Medium → Low
5. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
6. ทำ `/report` พร้อม `/report-table`
7. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่ใช่ web app -> ข้ามทั้งหมด
- ถ้า project เป็น SPA ไม่มี SSR/SSG -> ข้าม Step 2.5 item 1
- ถ้า project ไม่มี multi-locale -> ข้าม Step 2.5 item 2
- ถ้า project ไม่มี sitemap -> ข้าม Step 2.4 item 1

### 2. Severity Classification

- Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in robots.txt, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
- High: missing Open Graph, missing structured data, broken heading hierarchy, missing hreflang, poor URL structure, missing internal links, slow LCP
- Medium: suboptimal meta description length, missing Twitter Cards, inconsistent URL structure, missing breadcrumbs, minor heading issue
- Low: cosmetic, minor meta tag improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ page, URL, หรือ meta tag ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 6. Align with improve-seo

- แปลง action `ปรับปรุง` จาก `improve-seo` เป็น `รีวิว` ใน Step 2
- ไม่ลบ checklist items หรือ SEO dimensions ออกจาก scope โดยไม่มี evidence

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก SEO section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
