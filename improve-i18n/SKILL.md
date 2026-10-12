---
name: improve-i18n
description: หา i18n improvements ใน scope — message catalogs, RTL, formats, hardcoded strings — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-web
  - improve-uxui
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "i18n improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-i18n` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "i18n/localization ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-i18n` — message catalogs, missing keys, hardcoded strings, ICU/plural rules, RTL support, date/number/currency formats, locale routing, fallback chain
- เว็บ-specific metadata/routing → `/improve-web`; layout แตกจาก RTL/long strings → `/improve-uxui`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-i18n` — hardcoded strings, missing/unused keys, plural rules ผิด, format locale drift, RTL gaps
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-i18n`)
2. ย้าย hardcoded strings เข้า catalog ตาม i18n lib ของ project — ห้ามแปลเองฝังใน code
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-i18n`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม format date/number/currency ด้วย string concat — ใช้ Intl API หรือ i18n lib ของ project
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized i18n improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — ไม่มี hardcoded user-facing strings เหลือ
