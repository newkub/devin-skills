---
name: review-i18n
description: Review i18n/l10n — message catalogs, hardcoded strings, RTL, pluralization, date/number formats
argument-hint: "[scope]"
related:
  - review-frontend
  - review-accessibility
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review internationalization/localization ของ project — message catalogs, hardcoded strings, pluralization, date/number/currency formats, RTL support, locale routing — report-only

## Scope

ใช้เมื่อ app มีหลาย locale หรือต้องเตรียม i18n — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Detect i18n Setup

> Goal: รู้ framework และ coverage

1. ตรวจ i18n library จาก manifest (`i18next`, `react-intl`, `vue-i18n`, `next-intl`, ICU)
2. inventory locale files/message catalogs — locales ที่มี vs ที่ app อ้างถึง

### 2. Check Catalog Coverage

> Goal: keys ครบทุก locale

1. เทียบ keys ข้าม locale files — missing/unused keys
2. pluralization rules ตาม CLDR ของแต่ละ locale
3. interpolation variables ตรงกันข้าม locales

### 3. Find Hardcoded Strings

> Goal: ไม่มี user-facing string ตรงใน code

1. grep JSX/template literals/UI text ที่ไม่ผ่าน i18n function
2. error messages, validation text, aria-labels, alt text ต้องผ่าน catalog ด้วย

### 4. Check Formats And RTL

> Goal: locale-aware rendering ถูก

1. date/time/number/currency ใช้ `Intl` API หรือ i18n formatter — ห้าม format เอง
2. RTL: `dir` attribute, logical CSS properties (`margin-inline` vs `margin-left`), layout mirror
3. locale routing/negotiation — URL strategy, `Accept-Language`, fallback chain

### 5. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — missing keys, hardcoded strings พร้อม file:line, format/RTL issues, coverage %
2. ทำ `/suggest-next-action`

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence (file:line + key)
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-frontend สำหรับ frontend code deep-dive
- ใช้ /review-accessibility สำหรับ a11y deep-dive

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. missing keys → เติม catalog ทุก locale (placeholder ภาษาต้นทาง + flag ให้แปล)
2. hardcoded strings → wrap ด้วย i18n function + เพิ่ม keys
3. formats → เปลี่ยนเป็น `Intl.*`/i18n formatter
4. RTL → logical properties + `dir` handling
5. verify: render ทุก locale + lint rule กัน hardcoded strings ถ้ามี

## Expected Outcome

- catalog coverage report ต่อ locale พร้อม missing/unused keys
- hardcoded strings list พร้อม file:line
- format/RTL issues พร้อม recommendation
