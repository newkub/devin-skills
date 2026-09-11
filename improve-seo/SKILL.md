---
name: improve-seo
description: Apply SEO fixes จาก review-seo findings — meta, OG, structured data, sitemap, canonical
argument-hint: "[scope]"
related:
  - review-seo
  - review-web
  - use-subagents
  - deep-thinking
  - run-check
  - report
  - suggest-next-action
---

## Goal

แก้ SEO issues ที่ `/review-seo` หรือ `/review-web` พบ — meta tags, Open Graph, structured data, sitemap, canonical, heading structure, internal links — พร้อม verify บน rendered output จริง

## Scope

ใช้หลัง `/review-seo` มี findings หรือเมื่อต้องการ SEO pass แบบ apply-fixes — ต่างจาก `review-seo` ที่ report-only

- ถ้ายังไม่ได้ review → ทำ `/review-seo` ก่อน
- ถ้า scope ใหญ่หลาย routes → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-seo` หรืออ่าน findings เดิมที่มี
2. จัดกลุ่ม: meta/OG, structured data, sitemap/robots, headings/content, internal links, technical (canonical, hreflang, redirects)

### 2. Fix Meta And OG

> Goal: ทุก route มี meta ครบ

1. title/description ต่อ route — unique, ความยาวผ่านเกณฑ์ (title ≤60 chars, description ≤155)
2. Open Graph + Twitter cards — og:image ต้อง absolute URL และมีจริง
3. canonical URL ถูกต้องต่อ route — ไม่ duplicate

### 3. Fix Structured Data And Technical

> Goal: rich results eligible + crawl ถูก

1. JSON-LD ตาม type ของ page (Article, Product, FAQ, BreadcrumbList) — validate ด้วย schema.org spec
2. `sitemap.xml` + `robots.txt` ครบทุก public route — sitemap ต้องไม่มี 404/noindex URLs
3. hreflang ถ้ามีหลาย locale, redirect chains สั้นสุด

### 4. Fix Content Structure

> Goal: on-page SEO ผ่าน

1. heading hierarchy: h1 เดียวต่อ route, h2-h6 ไม่ข้ามระดับ — ถ้า fix กระทบ URL structure/IA ให้ใช้ `/deep-thinking` ชั่ง trade-off ก่อน
2. images มี alt, links มี descriptive text
3. internal links ครอบคลุม important pages — ไม่มี orphan routes

### 5. Verify

> Goal: ยืนยันบน rendered HTML จริง

1. curl/view-source แต่ละ route — meta/OG/JSON-LD ต้องอยู่ใน HTML (SSR/prerender) ไม่ใช่ client-injected
2. ทำ `/run-check` (lint/typecheck) หลังแก้
3. ถ้า fix กระทบ layout → re-capture ผ่าน `agent-browser` screenshot

### 6. Report

> Goal: ส่งมอบ

1. ทำ `/report` — findings fixed, before/after meta ตัวอย่าง, items ค้าง
2. ทำ `/suggest-next-action`

## Rules

### 1. SSR For SEO Tags

- meta/OG/structured data ต้อง render ใน HTML ตั้งแต่ต้น — client-only injection ไม่นับว่าแก้
- verify ด้วย curl/view-source ไม่ใช่แค่ devtools

### 2. Per-Route Coverage

- checklist ทุก public route — ห้ามแก้แค่ homepage
- dynamic routes ต้องมี meta template ที่ถูกต้อง

### 3. No Keyword Stuffing

- แก้เพื่อ correctness/discoverability — ห้ามใส่ keywords เกินหรือ hidden text

### 4. Evidence

- ทุก fix ต้อง verify ใน rendered output — ระบุ URL + tag ที่แก้ใน report

## Expected Outcome

- ทุก public route มี title/description/OG/canonical ครบและ unique
- structured data valid, sitemap/robots ถูกต้อง
- heading hierarchy + internal links ผ่านเกณฑ์
- report สรุป fixes พร้อม evidence
