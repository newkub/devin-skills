---
name: improve-seo
description: หา SEO improvements ใน scope — technical SEO, meta, structured data, CWV, sitemap — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-web
  - deep-review
  - deep-review-then-fix
  - follow-tool-takumi
  - follow-tool-unlighthouse
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "SEO improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-seo` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "SEO ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-seo` — technical SEO, meta/OG tags, structured data (JSON-LD), sitemap/robots, canonical, Core Web Vitals, indexability
- web improvements รวมทั่วไป (routing, frontend) → `/improve-web` แทน

### Tools And Libraries

ใช้ตอน review และ fix findings ที่เกี่ยวข้อง:

| Skill | ใช้เมื่อ |
|-------|----------|
| `/follow-tool-unlighthouse` | วัด SEO/CWV scores site-wide ทุก route เป็น evidence และ baseline ก่อน-หลัง fix |
| `/follow-tool-takumi` | finding `og:image`/`twitter:image` — generate OG images/social cards จาก JSX โดยไม่ต้อง browser |

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-seo`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-seo`)
2. Verify หลังแก้ด้วย rendered HTML จริง (view source / fetch) ไม่ใช่แค่ code
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-seo`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized SEO improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` และ verify ใน rendered output
