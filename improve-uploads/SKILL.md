---
name: improve-uploads
description: หา file upload improvements — resumable, direct-to-bucket, progress, limits — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-data-validation
  - improve-security
  - optimize-storage
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "uploads improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-frontend + review-backend + review-security` (upload scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "file upload ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-frontend` (upload scope) — progress UI, retry ต่อ chunk, cancel, multi-file queue, client-side size/type pre-check
- `review-backend` (upload scope) — resumable/tus หรือ direct-to-bucket signed upload, temp-file lifecycle, MIME/extension enforcement, storage quota
- `review-security` (upload scope) — content sniffing, malware scan hook, path traversal, executable/zip-bomb limits
- validation ของ content ในไฟล์ → `/improve-data-validation`; storage size/cost → `/optimize-storage`; image pipeline → `/optimize-images`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-frontend + review-backend + review-security` (upload scope) — buffer ทั้งไฟล์ใน memory, ไม่ verify signature signed URL, no orphan cleanup
3. รวบรวม prioritized list พร้อม severity และ evidence — upload endpoint ที่ accept unvalidated content เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก upload fix ต้องมี oversize/wrong-type/aborted-mid-upload test
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม trust client-declared filename/content-type — verify ที่ server เสมอ
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized upload improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม boundary-case tests
