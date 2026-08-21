---
name: review-i18n
description: Review i18n: translation completeness, missing keys, locale coverage, formatting, RTL, fallback
related:
  - scan-codebase
  - deep-analyze
  - update-review-cli
  - update-rules
  - run-review
  - deep-validate
  - validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review i18n และ localization ครอบคลุม translation, locale formatting, RTL, cultural adaptation พร้อม review score

## Scope

i18n review สำหรับ: translation completeness, missing keys, locale coverage, locale formatting (date, number, currency, pluralization), RTL support, text direction handling, i18n library configuration, fallback strategy, lazy loading, cultural adaptation, locale-specific validation, locale-aware error messages, locale fallback

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ i18n setup และ locale coverage

1. ทำ `/scan-codebase` เพื่อเข้าใจ i18n structure
2. ระบุ i18n library (vue-i18n, react-intl, i18next, FormatJS), locale files, fallback locale, supported locales ที่ใช้
3. ถ้า project ไม่มี i18n → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก i18n dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ i18n patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Translation And Locale Coverage Review

> Goal: ครอบคลุม translation completeness, missing keys, locale coverage

1. ตรวจสอบ translation completeness: translation key coverage per locale, missing keys per locale, extra keys per locale, translation file structure consistency
2. ตรวจสอบ missing keys: hardcoded strings ที่ควรเป็น translation keys, missing translation in critical path, missing translation for error messages, missing translation for UI labels
3. ตรวจสอบ locale coverage: supported locales list, locale detection strategy, locale switching mechanism, locale persistence, default locale
4. ตรวจสอบ i18n library configuration: library config correctness, namespace configuration, lazy loading strategy, bundle splitting per locale, fallback locale configuration
5. ตรวจสอบ fallback strategy: fallback locale, missing key fallback behavior, fallback chain, fallback warning, fallback vs default value
6. จัด severity ตาม `## Rules` → Severity Classification

### 4. Locale Formatting, RTL And Cultural Adaptation Review

> Goal: ครอบคลุม locale formatting, RTL, cultural adaptation

1. ตรวจสอบ locale formatting: date formatting (locale-specific), number formatting (decimal separators, thousand separators), currency formatting (symbols, positions), pluralization rules (one, few, many, other), relative time formatting (yesterday, 2 hours ago)
2. ตรวจสอบ RTL support: RTL layout support, logical properties (margin-inline, padding-inline, inset-inline), text direction handling, RTL-specific CSS, mirroring strategy, bidirectional text
3. ตรวจสอบ cultural adaptation: address format (locale-specific), name format (first/last order), phone number format, postal code validation, tax ID validation, calendar system (Gregorian, Hijri, Buddhist)
4. ตรวจสอบ locale-specific validation: postal codes, phone numbers, tax IDs, email format variations, password rules per locale
5. ตรวจสอบ locale-aware error messages: error message translation, error message locale formatting, locale-specific error examples, locale fallback for error messages
6. จัด severity ตาม `## Rules` → Severity Classification

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี i18n → ข้ามทั้งหมด
- ถ้า project ไม่มี multi-locale support → ข้าม Step 4
- ถ้า project ไม่มี RTL locales → ข้าม Step 4 item 2

### 2. Severity Classification

- Critical: missing locale entirely, broken translation key in critical path, no fallback, hardcoded string ใน critical path, wrong currency display, broken RTL layout, timezone error in critical path, incorrect pluralization ที่ก่อให้เกิด misunderstanding
- High: missing translation keys, incomplete locale coverage, missing fallback strategy, no lazy loading, inconsistent translation file structure, broken pluralization, incorrect locale formatting, missing currency formatting, missing timezone support, missing RTL support, missing locale-specific validation
- Medium: suboptimal fallback, missing relative time, inconsistent formatting, missing cultural adaptation
- Low: cosmetic, minor formatting improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ locale, translation key, หรือ formatting function ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก i18n section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
