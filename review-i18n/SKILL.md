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

Review internationalization/localization ของ project — message catalogs, hardcoded strings, pluralization, date/number/currency formats, RTL support, locale routing — report-only; domain checklist อยู่ใน `subagents/i18n-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้เมื่อ app มีหลาย locale หรือต้องเตรียม i18n — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

| Dimension | Checklist |
|-----------|-----------|
| `catalogs` — key coverage, plurals, interpolation | `subagents/i18n-reviewer/catalogs.md` |
| `extraction` — hardcoded strings, detection patterns | `subagents/i18n-reviewer/extraction.md` |
| `formats-rtl` — date/number/currency, RTL, locale routing | `subagents/i18n-reviewer/formats-rtl.md` |

## Execute

### 1. Prepare And Baseline

> Goal: รู้ framework และ coverage

1. ตรวจ i18n library จาก manifest (`i18next`, `react-intl`, `vue-i18n`, `next-intl`, ICU)
2. inventory locale files/message catalogs — locales ที่มี vs ที่ app อ้างถึง (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch I18n-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — `catalogs`, `extraction`, `formats-rtl`; ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/i18n-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (inventory จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Validate

> Goal: findings รวมกันถูกต้อง ไม่มี false positives

1. รวม findings จากทุก instance — dedup ตาม file:line + key
2. coverage เพิ่มเติมของ domain: pseudo-localization run — layout breaks, truncation, encoding; machine translation quality gate + review process
3. จัดลำดับ findings ตาม severity — ระบุ false positives พร้อมเหตุผล

### 4. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — missing keys, hardcoded strings พร้อม file:line, format/RTL issues, coverage %
2. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| Apply i18n findings — keys, wrapping, formats, RTL (user confirm) | `subskills/improve-i18n/SKILL.md` |

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence (file:line + key)
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/i18n-reviewer/` เท่านั้น
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-frontend สำหรับ frontend code deep-dive
- ใช้ /review-accessibility สำหรับ a11y deep-dive

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. missing keys → เติม catalog ทุก locale (placeholder ภาษาต้นทาง + flag ให้แปล)
2. hardcoded strings → wrap ด้วย i18n function + เพิ่ม keys
3. formats → เปลี่ยนเป็น `Intl.*`/i18n formatter
4. RTL → logical properties + `dir` handling
5. verify: render ทุก locale + lint rule กัน hardcoded strings ถ้ามี

## References

- [Catalog coverage checklist](subagents/i18n-reviewer/catalogs.md)
- [Formats and RTL checklist](subagents/i18n-reviewer/formats-rtl.md)
- [Hardcoded-string extraction checklist](subagents/i18n-reviewer/extraction.md)

## Expected Outcome

- catalog coverage report ต่อ locale พร้อม missing/unused keys
- hardcoded strings list พร้อม file:line
- format/RTL issues พร้อม recommendation
