---
name: review-seo
description: Review SEO covering meta tags, Open Graph, structured data, sitemap, robots.txt, SSR SEO, canonical URLs, semantic HTML, Core Web Vitals for SEO
---

## Goal

Review SEO ครอบคลุม meta tags, structured data, sitemap, SSR SEO, semantic HTML, Core Web Vitals พร้อม review score

## Scope

SEO review สำหรับ: meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt, canonical URLs, SSR/SSG SEO, semantic HTML, heading hierarchy, Core Web Vitals for SEO, international SEO (hreflang), URL structure, internal linking

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ SEO setup และ rendering mode

1. ทำ `/scan-codebase` เพื่อเข้าใจ SEO structure
2. ระบุ rendering mode (SSR, SSG, SPA), meta tag strategy, sitemap generation, robots.txt config ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก SEO dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ SEO patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Meta Tags And Structured Data Review

> Goal: ครอบคลุม meta tags, Open Graph, structured data

1. ตรวจสอบ meta tags: title tags (length, uniqueness, keyword placement), meta description (length, uniqueness, compelling), meta keywords (if used), viewport meta, charset meta
2. ตรวจสอบ Open Graph: og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale, Twitter Card tags
3. ตรวจสอบ structured data: JSON-LD schema validity, schema type coverage (Article, Product, BreadcrumbList, Organization, WebSite), structured data testing, missing schema on key pages
4. ตรวจสอบ canonical URLs: canonical tag presence, canonical URL correctness, duplicate content prevention, canonical vs hreflang

### 4. Sitemap, Robots, URL Structure And Internal Linking Review

> Goal: ครอบคลุม sitemap, robots.txt, URL structure, internal linking

1. ตรวจสอบ sitemap: sitemap.xml generation, sitemap completeness, sitemap freshness, sitemap index, lastmod accuracy, changefreq, priority
2. ตรวจสอบ robots.txt: robots.txt config, allow/disallow rules, crawl-delay, sitemap reference, noindex directives
3. ตรวจสอบ URL structure: URL readability, URL length, keyword in URL, URL consistency, trailing slash consistency, URL case sensitivity, query string usage
4. ตรวจสอบ internal linking: internal link structure, anchor text quality, broken internal links, orphan pages, link depth, breadcrumb navigation
5. ตรวจสอบ heading hierarchy: H1 uniqueness per page, heading order (H1→H2→H3), heading text quality, missing H1, multiple H1

### 5. SSR SEO And International Review

> Goal: ครอบคลุม SSR SEO และ international SEO

1. ตรวจสอบ SSR/SSG SEO: server-side rendering for SEO, pre-rendered pages, dynamic rendering strategy, crawlable content, meta tag injection on server
2. ตรวจสอบ international SEO: hreflang tags, locale-specific URLs, locale-specific sitemap, international targeting, ccTLD vs subdirectory vs subdomain
3. ตรวจสอบ Core Web Vitals for SEO: LCP, FID/INP, CLS, FCP, TTFB — impact on search ranking
4. ตรวจสอบ semantic HTML for SEO: semantic tags (article, section, nav, header, footer, main, aside), ARIA impact on SEO, image alt texts for SEO
5. Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in robots.txt, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
6. High: missing Open Graph, missing structured data, broken heading hierarchy, missing hreflang, poor URL structure, missing internal links, slow LCP

### 6. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่ใช่ web app → ข้ามทั้งหมด
- ถ้า project เป็น SPA ไม่มี SSR/SSG → ข้าม Step 5 item 1
- ถ้า project ไม่มี multi-locale → ข้าม Step 5 item 2
- ถ้า project ไม่มี sitemap → ข้าม Step 4 item 1

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

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก SEO section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
