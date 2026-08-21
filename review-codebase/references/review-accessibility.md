---
name: review-accessibility
description: Review ARIA attributes, semantic HTML, heading hierarchy, keyboard navigation, focus management, tab order, keyboard traps, color contrast, alt texts, screen reader, WCAG compliance
---

## Goal

Review accessibility ครอบคลุม ARIA, semantic HTML, keyboard navigation, WCAG compliance พร้อม review score

## Scope

accessibility review สำหรับ: ARIA attributes, semantic HTML, heading hierarchy, keyboard navigation, focus management, tab order, keyboard traps, color contrast, image alt texts, screen reader compatibility, WCAG compliance level, automated scan results, accessible naming, landmark roles, live regions, skip links

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ accessibility setup และ testing tools

1. ทำ `/scan-codebase` เพื่อเข้าใจ accessibility structure
2. ระบุ accessibility tools (axe-core, Lighthouse, WAVE), ARIA usage patterns, semantic HTML usage ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server

### 2. Deep Analyze

> Goal: ครอบคลุมทุก accessibility dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ accessibility patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด
6. ทำ `/check-accessibility` เพื่อรัน automated accessibility scan

### 3. ARIA And Semantic HTML Review

> Goal: ครอบคลุม ARIA, semantic HTML, heading hierarchy

1. ตรวจสอบ ARIA attributes: correct ARIA roles, aria-label, aria-labelledby, aria-describedby, aria-hidden, aria-live, aria-expanded, aria-selected, aria-checked, aria-disabled, ARIA on interactive elements
2. ตรวจสอบ semantic HTML: semantic tags (article, section, nav, header, footer, main, aside, figure, figcaption), button vs link correctness, list semantics, table semantics, form semantics
3. ตรวจสอบ heading hierarchy: H1 uniqueness per page, heading order (H1→H2→H3), no skipped levels, heading text quality, multiple H1 check
4. ตรวจสอบ landmark roles: banner, main, navigation, contentinfo, search, complementary, proper landmark usage, redundant landmarks
5. ตรวจสอบ accessible naming: accessible name for interactive elements, aria-label quality, button text clarity, link text descriptiveness, icon-only button naming
6. Critical: missing ARIA on critical interaction, incorrect ARIA role ที่ก่อให้เกิด error, no semantic HTML on critical content, broken heading hierarchy ที่ break screen reader, missing accessible name on icon-only button
7. High: missing ARIA, inconsistent ARIA, redundant ARIA, missing semantic tag, skipped heading level, poor accessible naming

### 4. Keyboard, Focus And Visual Accessibility Review

> Goal: ครอบคลุม keyboard nav, focus, contrast, alt texts

1. ตรวจสอบ keyboard navigation: tab order, logical tab sequence, keyboard trap detection, tab navigation on interactive elements, Enter/Space activation, Escape key handling, arrow key navigation
2. ตรวจสอบ focus management: visible focus indicator, focus ring consistency, focus trap in modals, focus restoration, focus order in dynamic content, skip-to-content link
3. ตรวจสอบ color contrast: WCAG AA (4.5:1 normal text, 3:1 large text), WCAG AAA (7:1), contrast in both light และ dark mode, automated contrast check, text on images
4. ตรวจสอบ image alt texts: decorative image alt (empty alt), informative image alt quality, alt text descriptiveness, missing alt, alt text duplication, complex image long description
5. ตรวจสอบ screen reader compatibility: live regions (aria-live), status messages, dynamic content announcements, screen reader testing results, NVDA/JAWS/VoiceOver compatibility
6. ตรวจสอบ motion และ sensory: prefers-reduced-motion support, no motion-only instructions, no color-only instructions, no sensory-only instructions (shape, size, position, sound)
7. Critical: keyboard trap, no keyboard navigation on critical interaction, no focus indicator, no screen reader support, blocking accessibility violation, insufficient contrast ที่อ่านไม่ได้
8. High: broken focus management, missing skip link, missing alt text on informative image, contrast below WCAG AA, missing live region for dynamic content, color-only instructions

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
- ถ้า project ไม่มี images → ข้าม Step 4 item 4
- ถ้า project ไม่มี dynamic content → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: keyboard trap, no keyboard navigation on critical interaction, no focus indicator, no screen reader support, blocking accessibility violation, insufficient contrast ที่อ่านไม่ได้, missing ARIA on critical interaction, broken heading hierarchy ที่ break screen reader
- High: broken focus management, missing skip link, missing alt text, contrast below WCAG AA, missing live region, color-only instructions, missing semantic tag, skipped heading level
- Medium: minor ARIA issue, minor contrast issue, inconsistent focus ring, missing landmark, poor alt text quality
- Low: cosmetic, minor ARIA improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ element, ARIA attribute, หรือ page ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก accessibility section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
