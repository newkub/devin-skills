---
name: improve-email
description: หา email improvements — deliverability, bounces, templates, SPF/DKIM/DMARC — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-notifications
  - improve-service-integrations
  - follow-service-resend
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "email improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend` (email scope) + `review-frontend` (templates) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "email ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (email scope) — deliverability (SPF/DKIM/DMARC, warmup, reputation), bounce/complaint handling, send throttling, webhook processing, list hygiene
- `review-frontend` — email template rendering, responsive/clients compatibility, dark mode, subject/preheader quality
- in-app notification/push → `/improve-notifications`; provider integration เจาะจง → `/follow-service-resend`; transactional payments email → `/improve-billing`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend` + `review-frontend` (email scope) — DNS auth missing, hard bounce ไม่ถูกตัด, template fallback ไม่มี
3. รวบรวม prioritized list พร้อม severity และ evidence — deliverability fail ( spam-boundary) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. DNS records (SPF/DKIM/DMARC) แก้พร้อม verification step — ห้ามตั้งแล้วไม่ check ด้วย tool ของ provider
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามแก้ deliverability ด้วยการเพิ่ม retryยิงซ้ำ — ทำ list hygiene ก่อน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized email improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม DNS/template verification
