---
title: Features Coverage
description: ตรวจ features coverage จาก source code เทียบกับ docs/project/features.md
related:
  - review-features
---

## Goal

ตรวจว่า `docs/project/features.md` ครอบคลุมทุก features ที่พบใน source code

## Scope

ใช้ใน Execute step "Check Coverage" ของ `review-features` — ตรวจ coverage เท่านั้น ไม่ตรวจ format หรือ duplication

## Source Code Areas

### 1. Routes Directory

1. ตรวจ `routes/`, `pages/`, `app/` หรือ equivalent ตาม ecosystem
2. ระบุ pages และ user-facing features
3. บันทึกชื่อ route และ path

### 2. Modules Directory

1. ตรวจ `modules/`, `services/`, `lib/` หรือ equivalent
2. ระบุ business logic features
3. บันทึกชื่อ module และ responsibility

### 3. Database Schema

1. ตรวจ schema files เช่น `schema.prisma`, `migrations/`, `schema.sql`
2. ระบุ tables และ relationships
3. บันทึก table names และ key relationships

### 4. Server Handlers And API Routes

1. ตรวจ `server/`, `api/`, `handlers/` หรือ equivalent
2. ระบุ endpoints และ API features
3. บันทึก HTTP method และ path

## Comparison Steps

1. รวบรวม features จาก source code ทั้ง 4 areas
2. อ่าน `docs/project/features.md`
3. เปรียบเทียบ source features กับ documented features
4. ระบุ missing features — มีใน code แต่ไม่มีใน docs
5. ระบุ stale features — มีใน docs แต่ไม่มีใน code
6. บันทึก findings พร้อม file path และ evidence

## Severity Mapping

- `Critical`: ไม่มี features เลยใน docs ทั้งที่มีใน source code
- `High`: ขาด features สำคัญจาก source code (routes, modules, API)
- `Medium`: ขาด features รองจาก source code (utility modules, minor endpoints)
- `Low`: stale features ใน docs ที่ไม่มีใน code แล้ว

## Expected Outcome

- รายงาน missing features และ stale features พร้อม evidence
- ยืนยัน coverage ระหว่าง source code และ `docs/project/features.md`
