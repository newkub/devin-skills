---
name: follow-service-resend-verify-connection
description: ยืนยัน Resend API key ใช้งานได้ — auth valid, domain verified
argument-hint: "[domain]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Resend เชื่อมต่อได้จริง — `RESEND_API_KEY` valid, sending domain verified

## Scope

- ใช้เมื่อ `/follow-service-resend` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ส่ง email จริง (test send อยู่ใน setup subskill)

## Execute

### 1. Check API Key

> Goal: `RESEND_API_KEY` มีและ valid

1. ตรวจ env var มีค่า (ไม่ print ค่า)
2. เรียก `resend.domains.list()` — 200 = key valid, 401 = invalid

### 2. Check Domain Status

> Goal: sending domain verified พร้อมส่ง

1. หา domain ที่ใช้ใน `EMAIL_FROM` จาก domains list
2. flag domain ที่ status ไม่ใช่ `verified` — DNS records ยังไม่ครบ
3. ถ้าไม่มี domain เลย → ยังส่งได้แค่ `onboarding@resend.dev`

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `domain-unverified` / `no-domain`

## Rules

- ใช้ list/read calls เท่านั้น — ห้าม `resend.emails.send`
- ไม่ print API key
- domain unverified → รายงาน DNS records ที่ขาดให้ config subskill จัดการ

## Expected Outcome

- Verdict connection พร้อม domain status evidence
