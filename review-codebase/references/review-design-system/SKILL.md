---
name: review-design-system
description: Review theme tokens, hardcoded colors, spacing system, dark mode, contrast ratio, typography system, design system drift
---

## Goal

Review design system ครอบคลุม theme tokens, spacing, dark mode, typography, design system drift พร้อม review score

## Scope

design system review สำหรับ: theme token usage, hardcoded colors, spacing system, color system, dark mode support, contrast ratio, typography system, component pattern compliance, design system drift, override patterns, token naming, token documentation

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ design system structure และ token setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ design system structure
2. ระบุ CSS framework, design token system (CSS variables, Tailwind theme, UnoCSS theme), dark mode strategy, component library ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก design system dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ design system patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Theme Token And Color System Review

> Goal: ครอบคลุม tokens, colors, dark mode

1. ตรวจสอบ theme token usage: hardcoded colors ที่ควรเป็น tokens, hardcoded spacing ที่ควรเป็น tokens, hardcoded font sizes ที่ควรเป็น tokens, token naming conventions
2. ตรวจสอบ color system: token usage consistency, color palette organization, semantic color tokens (primary, secondary, success, warning, error), brand color alignment
3. ตรวจสอบ dark mode: dark mode token support, dark mode coverage, color contrast in dark mode, dark mode toggle implementation, system preference detection, `prefers-color-scheme`
4. ตรวจสอบ contrast ratio: WCAG AA (4.5:1 normal text, 3:1 large text), WCAG AAA (7:1), contrast in both light และ dark mode, automated contrast check
5. Critical: hardcoded colors ที่ break dark mode, missing theme tokens ใน critical path, insufficient contrast ที่อ่านไม่ได้, broken dark mode on key pages
6. High: missing dark mode support, inconsistent token usage, missing semantic tokens, contrast below WCAG AA, hardcoded spacing ใน multiple components

### 4. Typography, Spacing And Component Pattern Review

> Goal: ครอบคลุม typography, spacing, component compliance, drift

1. ตรวจสอบ typography system: font scale consistency, line height scale, letter spacing scale, font weight scale, font family stack, font loading strategy, font display swap
2. ตรวจสอบ spacing system: spacing scale usage, margin/padding consistency, spacing token usage, spacing scale documentation, gap usage in flex/grid
3. ตรวจสอบ component pattern compliance: component variants match design system, consistent component styling, component prop API consistency, component override patterns
4. ตรวจสอบ design system drift: custom styles ที่นอก design system, override patterns ที่ break tokens, one-off styles, inline styles, !important usage
5. High: inconsistent typography, inconsistent spacing, non-standard components, design system drift ใน multiple files, missing font loading strategy
6. Medium: minor token inconsistency, suboptimal font scale, missing documentation, minor spacing inconsistency

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี design system → ข้ามทั้งหมด
- ถ้า project ไม่มี dark mode → ข้าม Step 3 item 3
- ถ้า project ไม่มี typography system → ข้าม Step 4 item 1

### 2. Severity Classification

- Critical: hardcoded colors ที่ break dark mode, missing theme tokens ใน critical path, insufficient contrast ที่อ่านไม่ได้, broken dark mode on key pages
- High: missing dark mode support, inconsistent token usage, missing semantic tokens, contrast below WCAG AA, hardcoded spacing ใน multiple components, design system drift
- Medium: minor token inconsistency, suboptimal font scale, missing documentation, minor spacing inconsistency
- Low: cosmetic, minor token naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ token, component, หรือ CSS rule ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก design system section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
