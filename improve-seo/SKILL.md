---
name: improve-seo
description: ตรวจและปรับปรุง SEO: meta tags, Open Graph, sitemap, robots, structured data
argument-hint: "[url-or-page]"
related:
  - report-table
---

## Goal

ตรวจและปรับปรุง SEO ของ web app ให้ครอบคลุม meta tags, Open Graph, sitemap, robots, structured data

## Scope

ใช้กับ web apps ทีใช้ Vite, SSR, static generation โดย audit แต่ละ route/page และ fix ตาม best practices

## Execute

### 1. Audit Current SEO

> Goal: รู้สถานะ SEO ปัจจุบัน

1. ตรวจ `<title>` ทุก route
2. ตรวจ `<meta name="description">`
3. ตรวจ Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
4. ตรวจ Twitter Card tags
5. ตรวจ canonical URL
6. ตรวจ `robots.txt` และ `sitemap.xml`
7. ตรวจ structured data JSON-LD
8. ตรวจ `lang` attribute บน `<html>`

### 2. Identify Gaps

> Goal: รู้ว่าขาดอะไร

1. สร้าง list ของ pages/routes ทีขาด meta tags
2. ระบุรูปภาพ Open Graph ทีขาดหรือไม่ถูกต้อง
3. ระบุ canonical URL ทีซ้ำหรือขาด
4. ตรวจ `robots.txt` ปิดกั้นหน้าทีไม่ควร
5. ตรวจ `sitemap.xml` ครอบคลุมทุก route

### 3. Implement Fixes

> Goal: แก้ไข SEO

1. เพิ่ม/แก้ `<title>` และ `<meta name="description">`
2. เพิ่ม Open Graph tags ในทุก route
3. เพิ่ม Twitter Card tags
4. เพิ่ม canonical URL
5. สร้าง/แก้ `robots.txt` และ `sitemap.xml`
6. เพิ่ม structured data JSON-LD ถ้าจำเป็น
7. กำหนด `lang` attribute

### 4. Validate

> Goal: ยืนยันว่า SEO ถูกต้อง

1. รัน `bun run build`
2. ตรวจ generated HTML ทุก route
3. ใช้ Google Rich Results Test หรือ Schema validator
4. ทำ `/report-table` สรุป fixes

## Rules

### 1. Per-Page Metadata

- ทุก route ต้องมี title และ description ไม่ซ้ำ
- Open Graph tags ต้องครบทุก shareable page
- ใช้ dynamic metadata ถ้ามี route params

### 2. Images

- `og:image` ต้องมี absolute URL
- ขนาด image แนะนำ 1200x630
- ใช้ WebP หรือ JPG ไม่ใช่ PNG ใหญ่

### 3. Structured Data

- ใช้ JSON-LD ใน `<head>`
- ตรวจ schema ให้ถูกต้อง
- ใช้ `https://schema.org`

### 4. Sitemap

- รวมทุก public route
- ไม่รวม auth, admin ถ้าไม่ public
- อัปเดต `lastmod` และ `priority`

### 5. Robots

- อนุญาต public pages
- ปิด search results, checkout ถ้าไม่ควร index
- อ้างอิง `sitemap.xml`

## Expected Outcome

- ทุก route มี unique title, description
- Open Graph และ Twitter Card tags ครบ
- `robots.txt` และ `sitemap.xml` ถูกต้อง
- Structured data ถูกต้องตาม schema
- Build ผ่าน
