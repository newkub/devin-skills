---
name: review-accessibility
description: Review accessibility ตาม WCAG ครอบคลุม keyboard, screen reader, contrast, forms, media
related:
  - review-codebase
  - scan-codebase
  - check-accessibility
  - validate
  - deep-validate
  - report
  - report-table
  - suggest-next-action

---


## Goal

Review accessibility ของ project ตาม WCAG 2.1 AA/AAA ครอบคลุม keyboard navigation, screen reader, color contrast, forms, media พร้อม findings, severity, และ review score

## Scope

ใช้สำหรับ web project ที่มี UI — เน้น review เท่านั้น ไม่แก้ไข code ระหว่าง review

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา UI components

> Goal: เข้าใจ frontend stack และ scope ของ UI

1. ทำ `/scan-codebase` เพื่อหา frontend files, components, pages
2. ระบุ framework/library และ rendering mode (CSR, SSR, static)
3. ระบุ accessibility tools ที่มี: `axe-core`, `Lighthouse`, `playwright`, `jest-axe`
4. ถ้าไม่มี UI → stop และ report

### 2. Review Keyboard Navigation

ตรวจสอบ keyboard navigation

> Goal: ทุก interaction ใช้ keyboard ได้

1. ตรวจสอบ tab order เป็น logical order และ visible
2. ตรวจสอบ focus indicators ชัดเจน
3. ตรวจสอบ interactive elements สามารถ activate ด้วย Enter/Space
4. ตรวจสอบ skip links สำหรับ repetitive content
5. ตรวจสอบไม่มี keyboard traps

### 3. Review Screen Reader Support

ตรวจสอบ screen reader experience

> Goal: screen reader อ่าน content ได้ถูกต้อง

1. ตรวจสอบ semantic HTML: headings, lists, landmarks, buttons, links
2. ตรวจสอบ ARIA labels, roles, states ใช้ถูกต้อง
3. ตรวจสอบ alt text สำหรับ images, icons, charts
4. ตรวจสอบ live regions และ status announcements
5. ตรวจสอบ decorative elements ไม่ถูกอ่าน

### 4. Review Color And Visual

ตรวจสอบ color contrast และ visual accessibility

> Goal: ทุกคนมองเห็นและแยกแยะได้

1. ตรวจสอบ contrast ratio ระหว่าง text กับ background (WCAG AA 4.5:1, AAA 7:1)
2. ตรวจสอบว่าไม่ใช้สีเพียงอย่างเดียวสื่อความหมาย
3. ตรวจสอบ text resize ถึง 200% ไม่ทำให้เสีย function
4. ตรวจสอบ focus contrast และ focus visible

### 5. Review Forms And Interactive

ตรวจสอบ forms และ interactive components

> Goal: forms ใช้งานได้กับทุก assistive technology

1. ตรวจสอบ form labels ผูกกับ controls ถูกต้อง
2. ตรวจสอบ error messages สื่อสารชัดเจน
3. ตรวจสอบ validation feedback อ่านได้ด้วย screen reader
4. ตรวจสอบ dropdown, modal, dialog มี focus management

### 6. Review Media And Motion

ตรวจสอบ media และ motion

> Goal: ลด barrier จาก media และ animation

1. ตรวจสอบ captions/ transcripts สำหรับ videos
2. ตรวจสอบ audio descriptions ถ้าจำเป็น
3. ตรวจสอบ autoplay ไม่รบกวน และสามารถ pause/stop ได้
4. ตรวจสอบ `prefers-reduced-motion` ไม่ขาด

### 7. Run Automated And Manual Checks

รัน automated tools และ manual verification

> Goal: หา violations พร้อม evidence

1. รัน automated accessibility audit: `axe-core`, `Lighthouse`, `jest-axe`
2. ตรวจสอบ automated findings ด้วย manual review
3. บันทึก violations พร้อม file path, element selector, WCAG guideline

### 8. Validate And Report

ตรวจสอบและรายงาน

> Goal: findings ถูกต้องและ actionable

1. ทำ `/deep-validate` และ `/validate`
2. ให้ severity: Critical, High, Medium, Low, Info
3. คำนวณ review score
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. WCAG Compliance

- ใช้ WCAG 2.1 AA เป็น baseline
- พิจารณา AAA สำหรับ critical flows
- ตรวจสอบ Perceivable, Operable, Understandable, Robust

### 2. Severity Classification

- Critical: blocking user flow, keyboard trap, missing labels บน critical form, no alt text บน informative image
- High: contrast fail บน large text, missing focus indicator, ARIA misuse บน critical component
- Medium: contrast fail บน UI icons, redundant ARIA, minor heading hierarchy
- Low: best practices, cosmetic ARIA, minor alt text improvement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, selector หรือ screenshot
- ระบุ WCAG success criterion ที่เกี่ยวข้อง
- ใช้ automated tools เป็น evidence

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าต้องแก้ไข → แนะนำ `check-accessibility` หรือ `improve-web-accessibility` หลัง report

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings ตาม WCAG ตัวบ่งชี้
- Review score และ grade
- Recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
