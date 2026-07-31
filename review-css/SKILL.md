---
name: review-css
description: Review CSS architecture, utility classes, cascade, unused styles, and preprocessor usage
---

## Goal

Review CSS ครอบคลุม CSS architecture, utility classes, cascade, specificity, unused/dead styles, preprocessor usage, และ CSS-in-JS patterns พร้อม health score

## Scope

ใช้สำหรับ review CSS files, style tags, utility-first frameworks (UnoCSS, Tailwind), CSS Modules, scoped styles, styled-components, Emotion — design tokens และ color system อยู่ใน `/review-design-system`, browser compatibility อยู่ใน `/review-browser-compat`, responsiveness อยู่ใน `/review-responsive`

## Execute

### 1. Gather Context

รวบรวม context ก่อน review CSS

> Goal: เข้าใจ CSS setup, framework, และ conventions

1. ทำ `/scan-codebase` เพื่อหา CSS files, style tags, CSS-in-JS, configuration
2. ระบุ CSS approach: utility-first, BEM, CSS Modules, scoped, preprocessor
3. ระบุ conventions: naming, file organization, import patterns

### 2. Analyze CSS Architecture

วิเคราะห์โครงสร้าง CSS

> Goal: หา architectural issues และ inconsistencies

1. ตรวจสอบ consistency ของ patterns: naming conventions, file structure, import order
2. ตรวจสอบ CSS-in-JS patterns: dynamic styles, prop-based styles, performance
3. ตรวจสอบ separation of concerns: UI logic กับ style ไม่ผสมกัน
4. ตรวจสอบ global CSS leakage, unused global selectors
5. ทำ `/deep-analyze` เพื่อหา hotspots

### 3. Check Specificity and Cascade

ตรวจสอบ specificity และ cascade issues

> Goal: ลด specificity wars และ unexpected cascade

1. ตรวจสอบ over-specific selectors (`!important`, deep nesting, ID selectors)
2. ตรวจสอบ cascade conflicts: order-dependent styles, duplicated rules
3. ตรวจสอบ selector nesting depth: ไม่เกิน 3 levels
4. ตรวจสอบ utility-first classes ที่สร้าง one-off values แทน tokens

### 4. Detect Unused and Dead CSS

หา unused / dead styles

> Goal: ลด CSS bundle size และ maintenance burden

1. ใช้ tooling หา unused CSS classes / rules
2. ตรวจสอบ styles ที่ no longer match any element
3. ตรวจสอบ duplicated styles ที่สามารถรวมได้
4. ทำ `/run-health` เพื่อดึง metrics

### 5. Validate and Report

ตรวจสอบ findings และรายงานผล

> Goal: รายงาน health score พร้อม actionable recommendations

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ issues แต่ละอย่าง
3. ให้ severity: Critical, High, Medium, Low, Info
4. คำนวณ health score ต่อ dimension
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review design tokens หรือ color system — ใช้ `/review-design-system`
- ไม่ review browser compatibility — ใช้ `/review-browser-compat`
- ไม่ review responsiveness — ใช้ `/review-responsive`
- อยู่ภายใต้ `/review-frontend` เมื่อ review frontend ทั้งหมด

### 2. Severity

- Critical: global CSS ทำให้ layout broken, heavy `!important` usage, dead CSS เกิน 30%
- High: inconsistent naming conventions, selector nesting เกิน 3 levels, unused CSS 10-30%
- Medium: minor cascade conflicts, duplicate rules, missing CSS organization
- Low: cosmetic improvements, minor naming inconsistencies

### 3. Evidence

- ทุก finding ต้องมี file path และ line number
- ระบุ selector หรือ rule ที่เกี่ยวข้อง

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงาน CSS findings ในตาราง
- Health score ต่อ dimension
- Actionable recommendations
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
