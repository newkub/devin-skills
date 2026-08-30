# SEO Review Checklist

## Skip Conditions

- ถ้า project ไม่ใช่ web app → ข้ามทังหมด
- ถ้า project เป็น SPA ไม่มี SSR/SSG → ข้าม SSR SEO
- ถ้า project ไม่มี multi-locale → ข้าม international SEO
- ถ้า project ไม่มี sitemap → ข้าม sitemap section
- ถ้า project ไม่มี structured data → ข้าม structured data review

## Technical SEO

1. ตรวจ `robots.txt`: allow/disallow rules, sitemap reference, `crawl-delay`, `noindex` directives
2. ตรวจ `sitemap.xml`: generation, completeness, freshness, `lastmod`, sitemap index
3. ตรวจ canonical URLs: presence, correctness, duplicate content prevention, canonical vs hreflang
4. ตรวจ URL structure: readability, length, consistency, trailing slash, query string usage
5. ตรวจ internal linking: broken links, orphan pages, anchor text quality, link depth, breadcrumbs

## On-Page SEO

1. ตรวจ title tags: length, uniqueness, keyword placement
2. ตรวจ meta descriptions: length, uniqueness, compelling
3. ตรวจ heading hierarchy: H1 หนึ่งต่อ page, H1→H2→H3 order, heading text quality
4. ตรวจ Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`
5. ตรวจ Twitter Card tags

## Structured Data And Schema

1. ตรวจ JSON-LD schema validity
2. ตรวจ schema type coverage: Article, Product, BreadcrumbList, Organization, WebSite
3. ตรวจ structured data testing, missing schema on key pages

## Core Web Vitals For SEO

1. ตรวจ LCP, INP, CLS, FCP, TBT, Speed Index
2. ตรวจ page speed signals: rendering time, resource loading, layout stability
3. ทำ `/review-performance` สำหรับ performance bottlenecks ที่กระทบ SEO

## International And SSR SEO

1. ตรวจ SSR/SSG: server-side rendering, pre-rendered pages, crawlable content, meta tag injection on server
2. ตรวจ hreflang tags, locale-specific URLs, locale-specific sitemap
3. ตรวจ dynamic rendering strategy สำหรับ SPA

## Content And Semantic HTML

1. ตรวจ semantic HTML: `article`, `section`, `nav`, `header`, `footer`, `main`, `aside`
2. ตรวจ image alt texts บน critical images
3. ตรวจ ARIA impact on SEO
4. ทำ `/review-uxui` สำหรับ accessibility ทัศน์ที่เกี่ยวข้องกับ SEO

## Severity Classification

- Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in `robots.txt`, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
- High: missing Open Graph, missing structured data, broken heading hierarchy, missing hreflang, poor URL structure, missing internal links, slow LCP
- Medium: suboptimal meta description length, missing Twitter Cards, inconsistent URL structure, missing breadcrumbs, minor heading issue
- Low: cosmetic, minor meta tag improvement, documentation gap
