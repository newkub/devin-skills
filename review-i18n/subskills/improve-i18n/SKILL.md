---
name: review-i18n-improve-i18n
description: Apply i18n findings — fill missing keys, wrap hardcoded strings, format/RTL fixes
argument-hint: "[scope-or-findings]"
related:
  - review-i18n
  - no-hard-code
  - run-test
  - report-before-after
  - use-astgrep
---

## Goal

แก้ i18n findings จาก `/review-i18n` จริง — catalogs ครบ, hardcoded strings wrapped, formats/RTL ถูกต้อง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: missing keys, hardcoded strings, Intl format issues, RTL handling — overlap กับ `/no-hard-code` (string extraction)

## Execute

### 1. Baseline

> Goal: รู้ gap ขนาดเท่าไหร่

ทำตาม `../../references/catalogs.md` + `../../references/extraction.md`

1. missing keys ต่อ locale — scan catalogs vs source strings
2. hardcoded strings — `/use-astgrep` หา JSX/text literals ที่ควร wrap
3. format/RTL gaps — `Intl.*` usage, logical properties, `dir` handling

### 2. Fill Catalogs

> Goal: keys ครบทุก locale

1. missing keys → add placeholders (source language) + flag untranslated
2. consolidate — shared keys ไม่ duplicate per-page
3. catalog structure ตาม convention (flat vs nested) — เลือกแล้ว consistent

### 3. Wrap Strings

> Goal: zero hardcoded user-facing strings

1. wrap literals ด้วย i18n function + generate keys
2. extraction tooling/CI check เพิ่มเพื่อกัน regression
3. format fixes — `Intl.DateTimeFormat`, `Intl.NumberFormat`, plural rules แทน string concat

### 4. RTL And Verify

> Goal: RTL locales render ถูก

1. logical properties (`margin-inline-start` แทน `margin-left`), `dir` attribute handling
2. verify render ทุก locale (ตัวอย่าง RTL จริง — ar/he)
3. `/run-test` ผ่าน + `/report-before-after` — coverage % + missing keys เหลือ 0

## Rules

- placeholder ภาษาต้นทาง + flag — ห้ามส่ง untranslated strings โดยไม่ติดตาม
- extraction เป็น migration — wrap เฉพาะ user-facing strings, ไม่ใช่ internal logs/errors
- preserve layout — RTL fixes ต้องทดสอบจริงบน RTL locale
- แยก commit: catalogs → wrapping → formats → RTL

## Expected Outcome

- Coverage 100% ทุก locale พร้อม untranslated-flags
- Zero hardcoded user-facing strings; Intl/RTL verified
