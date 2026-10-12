---
name: improve-docs
description: หา docs improvements ใน scope — README, guides, .md files, structure — writing quality ผ่าน /improve-writing
argument-hint: "[scope]"
related:
  - improve
  - improve-writing
  - update-docs
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "docs improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — ครอบคลุม docs ทั้งหมด (`README`, `*.md`, docs site, guides) — รวม findings จาก `/deep-review` domain `review-docs` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "docs/เอกสาร ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-docs` — docs structure, README completeness, missing guides, stale content, broken links, missing pages
- writing quality/readability ของเนื้อหา docs → `/improve-writing`
- สร้าง/อัปเดต docs ใหญ่ (VitePress site, restructure) → `/update-docs`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-docs`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-docs`)
2. Findings เกี่ยวกับ writing quality/clarity ของ `.md` → ส่งต่อ `/improve-writing`
3. Docs restructure ใหญ่ → ทำ `/create-plan-in-dot-devin` หรือ `/update-docs`
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-docs`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Writing quality issues → `/improve-writing` เสมอ ไม่แก้ใน skill นี้
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized docs improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`; writing issues ผ่าน `/improve-writing`
