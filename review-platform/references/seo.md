# SEO Checks

## Meta Tags

1. ตรวจสอบ title tags: length, uniqueness, keyword placement
2. ตรวจสอบ meta description: length, uniqueness, compelling
3. ตรวจสอบ meta keywords (if used), viewport meta, charset meta

## Open Graph And Twitter Cards

1. ตรวจสอบ Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`
2. ตรวจสอบ Twitter Card tags

## Canonical URLs

1. ตรวจสอบ canonical tag presence, canonical URL correctness
2. ตรวจสอบ duplicate content prevention, canonical vs hreflang

## Structured Data

1. ตรวจสอบ JSON-LD schema validity
2. ตรวจสอบ schema type coverage: Article, Product, BreadcrumbList, Organization, WebSite
3. ตรวจสอบ structured data testing, missing schema on key pages

## Core Web Vitals For SEO

1. ตรวจสอบ LCP, FID/INP, CLS, FCP, TBT, Speed Index — impact on search ranking
2. ตรวจสอบ page speed signals ที่เกี่ยวข้องกับ SEO: rendering time, resource loading, layout stability

## Sitemap And Robots.txt

1. ตรวจสอบ sitemap: `sitemap.xml` generation, completeness, freshness, sitemap index, `lastmod` accuracy, `changefreq`, `priority`
2. ตรวจสอบ `robots.txt`: config, allow/disallow rules, `crawl-delay`, sitemap reference, `noindex` directives

## URL Structure And Internal Linking

1. ตรวจสอบ URL readability, URL length, keyword in URL, URL consistency, trailing slash consistency, URL case sensitivity, query string usage
2. ตรวจสอบ internal linking: link structure, anchor text quality, broken internal links, orphan pages, link depth, breadcrumb navigation
3. ตรวจสอบ heading hierarchy: H1 uniqueness per page, heading order (H1→H2→H3), heading text quality, missing H1, multiple H1

## SSR And International SEO

1. ตรวจสอบ SSR/SSG SEO: server-side rendering for SEO, pre-rendered pages, dynamic rendering strategy, crawlable content, meta tag injection on server
2. ตรวจสอบ international SEO: `hreflang` tags, locale-specific URLs, locale-specific sitemap, international targeting, ccTLD vs subdirectory vs subdomain

## Semantic HTML

1. ตรวจสอบ semantic tags: `article`, `section`, `nav`, `header`, `footer`, `main`, `aside`
2. ตรวจสอบ ARIA impact on SEO, image alt texts for SEO

## Skip Conditions

- ถ้า project ไม่ใช่ web app → ข้ามทั้งหมด
- ถ้า project เป็น SPA ไม่มี SSR/SSG → ข้าม SSR SEO
- ถ้า project ไม่มี multi-locale → ข้าม international SEO
- ถ้า project ไม่มี sitemap → ข้าม sitemap section

## Severity

- Critical: missing title tag, missing meta description on key pages, no sitemap, blocking important pages in `robots.txt`, no canonical on duplicate content, SPA ที่ search engine อ่านไม่ได้, missing H1
- High: missing Open Graph, missing structured data, broken heading hierarchy, missing `hreflang`, poor URL structure, missing internal links, slow LCP
- Medium: suboptimal meta description length, missing Twitter Cards, inconsistent URL structure, missing breadcrumbs, minor heading issue
- Low: cosmetic, minor meta tag improvement, documentation gap
