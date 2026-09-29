---
name: review-seo
description: Review SEO ครอบคลุม technical, on-page, structured data, CWV, hreflang
argument-hint: "[scope]"
related:
  - deep-review-then-fix
  - follow-tool-lighthouse
  - review-uxui
  - review-performance
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - suggest-next-action
  - review-frontend
  - review-dependencies
  - use-subagents
---

## Goal

Review SEO ครอบคลุม technical SEO, on-page SEO, structured data, Core Web Vitals, sitemap, international SEO, semantic HTML พร้อม severity ratings และ review score — domain checklist อยู่ใน `subagents/seo-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้สำหรับ review SEO ของ web applications:

| Dimension | Checklist |
|-----------|-----------|
| `technical` — crawling, indexing, `robots.txt`, sitemap, canonical, URL structure | `subagents/seo-reviewer/seo-checklist.md` |
| `on-page` — title tags, meta descriptions, headings, Open Graph, Twitter Cards, internal linking | `subagents/seo-reviewer/seo-checklist.md` |
| `structured-data` — JSON-LD, schema types, validity | `subagents/seo-reviewer/seo-checklist.md` |
| `performance-for-seo` — LCP, INP, CLS, FCP, TBT, Speed Index | `subagents/seo-reviewer/seo-checklist.md` |
| `content` — semantic HTML, image alt texts, heading hierarchy, content discoverability | `subagents/seo-reviewer/seo-checklist.md` |
| `international` — hreflang, locale-specific URLs | `subagents/seo-reviewer/seo-checklist.md` |

ไม่รวม UX/UI design, accessibility, general performance — ใช้ `/review-uxui`, `/review-performance` ตามทีเหมาะสม

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ web structure, framework, และ SEO setup

1. ทำ `/scan-codebase`
2. ระบุ SEO tools ที่มี
3. ทำ `/deep-analyze` และ `/run-review` เก็บ baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Seo-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ตาม skip conditions ใน Rules)
2. Spawn `subagents/seo-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings ถูกต้อง พร้อม review score

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. ทำ `/deep-validate`
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. ทำตาม `subagents/seo-reviewer/scoring.md`

### 4. Report

> Goal: รายงานครบทุก dimension พร้อม next actions

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งาน fix ไปยัง subskill เมื่อ user confirm ให้แก้ findings

| Topic | Subskill |
|-------|----------|
| Apply SEO findings — meta/OG tags, sitemap, canonical, structured data | `subskills/improve-seo/SKILL.md` |
| `meta`, `tags`, `og` — title/OG/canonical per route | `subskills/check-meta/SKILL.md` |
| `structured-data`, `jsonld`, `schema` — JSON-LD validity | `subskills/check-structured-data/SKILL.md` |

## Rules
### 1. Scope Boundary

- เน้น SEO บน web applications
- ไม่ซ้ำกับ `/review-uxui`, `/review-performance`, `/deep-review`
- ถ้าพบ accessibility/performance issues → ระบุเป็น info และแนะนำ sub-skill
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/seo-reviewer/` เท่านั้น

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
- ใช้ `/follow-tool-lighthouse` หรือ SEO tools ประกอบ
- ไม่เดา

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report`
- ใช้ symbols: ผ่าน, ไม่ผ่าน, warning

- ใช้ /review-frontend ถ้าจำเป็น
- ใช้ /review-dependencies ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. meta/OG: title/description unique ต่อ route, og:image absolute URL, canonical ถูกต้อง
2. structured data: JSON-LD ตาม page type, sitemap/robots ครบ public routes, hreflang ถ้าหลาย locale
3. content: h1 เดียวต่อ route, alt images, internal links ไม่มี orphan routes
4. verify: curl/view-source — meta ต้องอยู่ใน HTML (SSR) ไม่ใช่ client-injected; `/run-check` ผ่าน

## References

- [Full SEO checklist](subagents/seo-reviewer/seo-checklist.md)
- [Scoring guide](subagents/seo-reviewer/scoring.md)

## Expected Outcome
- รายงาน SEO findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
