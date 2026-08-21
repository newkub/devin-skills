---
name: review-responsive
description: Review viewport, breakpoints, flex layouts, touch targets, typography, overflow, container queries
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

Review responsive design ครอบคลุม viewport, breakpoints, flexible layouts, touch targets, overflow prevention พร้อม review score

## Scope

responsive review สำหรับ: viewport meta tag, breakpoint coverage, mobile-first approach, flexible layouts (flexbox, grid, container queries), touch targets, responsive typography, overflow prevention, safe area insets, orientation handling, responsive images

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ responsive setup และ breakpoint config

1. ทำ `/scan-codebase` เพื่อเข้าใจ responsive structure
2. ระบุ CSS framework, breakpoint config, responsive utilities, container query support ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก responsive dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ responsive patterns
2. ทำ `/update-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Viewport And Breakpoint Review

> Goal: ครอบคลุม viewport, breakpoints, mobile-first

1. ตรวจสอบ viewport meta tag: presence, correct configuration, viewport-fit=cover for notch devices, user-scalable settings
2. ตรวจสอบ breakpoint coverage: mobile, tablet, desktop, wide desktop, breakpoint values consistency, mobile-first ordering
3. ตรวจสอบ mobile-first approach: base styles for mobile, progressive enhancement, min-width vs max-width media queries
4. ตรวจสอบ container queries: container query usage, container-type declaration, component-level responsiveness vs viewport-level

### 4. Layout, Touch Targets And Typography Review

> Goal: ครอบคลุม flexible layouts, touch targets, responsive typography, overflow

1. ตรวจสอบ flexible layouts: flexbox usage, CSS grid usage, intrinsic sizing (min-content, max-content, fit-content), fr units, auto-fit/auto-fill
2. ตรวจสอบ touch targets: min 44x44px, spacing between targets, touch-friendly navigation, gesture support
3. ตรวจสอบ responsive typography: clamp(), fluid type, rem units, viewport-relative units, font-size scaling, line-height scaling
4. ตรวจสอบ overflow prevention: horizontal scroll on mobile, safe area insets, overflow-x handling, max-width constraints, word-break/overflow-wrap
5. ตรวจสอบ orientation handling: portrait/landscape support, orientation-specific layouts, orientation lock (if needed)
6. ตรวจสอบ responsive images: srcset, sizes attribute, art direction with picture element, responsive image formats

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

- ถ้า project ไม่ใช่ web app → ข้ามทั้งหมด
- ถ้า project ไม่มี responsive design → ข้าม Step 3 item 2
- ถ้า project ไม่มี images → ข้าม Step 4 item 6
- ถ้า project ไม่รองรับ container queries → ข้าม Step 3 item 4

### 2. Severity Classification

- Critical: no viewport meta tag, horizontal scroll บน mobile, fixed width ที่ทำลาย layout, touch target เล็กกว่า 44px บน critical interaction
- High: missing breakpoint สำคัญ, non-mobile-first, missing responsive images, missing safe area insets, broken layout บน tablet
- Medium: missing tablet breakpoint, inconsistent breakpoint values, suboptimal touch spacing, minor overflow issue
- Low: cosmetic, minor spacing adjustment, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ component, page, หรือ CSS rule ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก responsive section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
