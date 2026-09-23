---
name: review-seo-improve-seo
description: Apply SEO findings — meta/OG tags, sitemap, canonical, structured data
argument-hint: "[scope-or-route]"
related:
  - review-seo
  - review-frontend
  - follow-robots-txt
  - scan-codebase
  - run-check
  - report-before-after
---

## Goal

แก้ SEO findings จาก `/review-seo` จริง — meta/OG tags, canonical, sitemap, `robots.txt`, structured data — verify ว่า tags อยู่ใน HTML ที่ serve จริง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: title/description, Open Graph/Twitter Cards, canonical/hreflang, sitemap/robots, JSON-LD
- ไม่ครอบคลุม content strategy/keywords และ Core Web Vitals fixes → `/review-performance` แล้ว fix ตาม domain นั้น

## Execute

### 1. Map Findings To Routes

> Goal: รู้ว่า route ไหนขาดอะไร

1. รวม findings ต่อ route/page type จาก review report
2. ระบุ metadata mechanism ของ framework (file-based metadata, head component, plugin)
3. แยก fixes: per-route metadata vs global config vs generated files

### 2. Fix Meta And OG Tags

> Goal: ทุก route มี metadata ครบและ unique

1. title/description unique ต่อ route — ยึด patterns ของ framework สำหรับ dynamic routes
2. Open Graph + Twitter Cards ครบ — `og:image` ต้องเป็น absolute URL และมีขนาดที่ platform แนะนำ (ดู official docs)
3. canonical ถูกต้องต่อ route — resolve duplicate content ตาม findings; hreflang เฉพาะเมื่อหลาย locale

### 3. Fix Sitemap And Robots

> Goal: crawlable ตรงใจ

1. สร้าง/อัปเดต `sitemap.xml` ครบทุก public routes — dynamic routes generate จาก data source
2. ตรวจ `robots.txt` ตาม `/follow-robots-txt` — ไม่ block important pages, อ้าง sitemap URL
3. noindex เฉพาะ routes ที่ตั้งใจ (internal, staging, auth-gated)

### 4. Fix Structured Data

> Goal: JSON-LD ถูกต้องตาม page type

1. เพิ่ม/แก้ JSON-LD ตาม schema.org type ที่ตรง page — Organization, BreadcrumbList, Article, Product, FAQPage ตาม findings
2. fields ต้องมาจาก data จริง ไม่ hardcode content ที่ขัดกับหน้า
3. validate ด้วย Rich Results Test หรือ Schema validator — ดู official docs

### 5. Verify Served HTML

> Goal: tags ออกใน HTML ที่ crawler เห็นจริง

1. curl/view-source ทุก route ที่แก้ — meta ต้องอยู่ใน HTML (SSR/SSG) ไม่ใช่ client-injected
2. `/run-check` ผ่าน แล้ว build ผ่าน — sitemap/robots generate ถูก path
3. `/report-before-after` — findings ก่อน/หลังต่อ route

## Rules

- meta ต้อง render server-side — SPA client-injected tags ไม่นับว่าแก้
- ห้าม duplicate title/description ข้าม routes
- `og:image` absolute URL เท่านั้น และต้อง fetch ได้จริง
- แยก commit ต่อ fix group: meta/OG → sitemap/robots → structured data
- preserve behavior — ห้ามเปลี่ยน content/URL structure นอก findings

## Expected Outcome

- ทุก public route มี title/description/OG unique และ canonical ถูก
- sitemap/robots ครบและ serve ได้จริง, structured data validate ผ่าน
- report before/after ครบทุก finding

