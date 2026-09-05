---
name: review-accessibility
description: ตรวจ accessibility ตาม WCAG — semantics, keyboard, ARIA, contrast, screen reader
argument-hint: "[url-or-route-or-component]"
related:
  - improve-accessibility
  - review-uxui
  - run-test-website-by-agent-browser
  - capture-image-app-to-screenshot
  - follow-lib-agent-browser
  - report-table
  - deep-review
---

## Goal

ตรวจ accessibility ของ web pages/components ตามมาตรฐาน WCAG — semantics, keyboard navigation, ARIA, color contrast และ screen reader support

## Scope

ใช้กับ web apps, pages หรือ components ที่ต้องตรวจ a11y แยกจาก UX/UI ทั่วไป — ครอบคลุม WCAG 2.2 Level A/AA: perceivable, operable, understandable, robust — ไม่แก้ไข code (ใช้ `/improve-accessibility`)

## Execute

### 1. Prepare Target

> Goal: เปิด target พร้อม audit tools

1. เปิด dev server หรือใช้ deployed URL ตาม argument
2. ใช้ `/run-test-website-by-agent-browser` เพื่อเปิด page ด้วย `agent-browser`
3. ถ้าเป็น component เดี่ยว → เปิด storybook หรือ route ที่ render component นั้น

### 2. Run Automated Audit

> Goal: ได้ violations จาก automated checks

1. รัน axe/pa11y หรือ `agent-browser` accessibility audit ตามที่มี
2. บันทึก violations พร้อม selector, rule และ severity (critical/serious/moderate/minor)
3. ตรวจ automated coverage: ไม่เกิน ~40% ของ WCAG — เตรียม manual checks ต่อ

### 3. Check Semantics And Structure

> Goal: HTML สื่อความหมายถูกต้อง

1. ตรวจ landmark regions (`header`, `nav`, `main`, `footer`) และ heading hierarchy `h1`-`h6`
2. ตรวจ interactive elements ใช้ semantic tags (`button`, `a`, `input`) ไม่ใช่ `div`+click
3. ตรวจ alt text, form labels และ table headers

### 4. Check Keyboard And Focus

> Goal: ใช้งานได้ครบด้วย keyboard เท่านั้น

1. กด `Tab` ผ่าน interactive elements ทั้งหมด — ตรวจ focus order และ visible focus indicator
2. ทดสอบ `Enter`/`Space`/`Escape`/`Arrow keys` บน interactive patterns (menus, dialogs, tabs)
3. ตรวจ focus traps ใน modals และ skip links

### 5. Check Visual And ARIA

> Goal: perceivable สำหรับทุกผู้ใช้

1. ตรวจ color contrast ขั้นต่ำ 4.5:1 (text) และ 3:1 (UI components, large text)
2. ตรวจ ARIA attributes — ใช้เฉพาะเมื่อ semantic HTML ไม่พอ ตรวจ `aria-label`, `role`, `aria-live`
3. ตรวจ motion/animation เคารพ `prefers-reduced-motion` และไม่มี auto-play ที่ควบคุมไม่ได้

### 6. Rate And Report

> Goal: สรุป findings พร้อม severity และ remediation path

1. จัดกลุ่ม findings ตาม WCAG principle และ severity
2. ทำ `/report-table` พร้อม columns: No., Rule, Severity, Element, Evidence, Fix
3. ชี้ไป `/improve-accessibility` สำหรับการแก้ไข

## Rules

### 1. Evidence Based

- ทุก finding ต้องมี element/selector และ WCAG criterion อ้างอิง
- แยก automated findings กับ manual findings ชัดเจน

### 2. Real Interaction

- keyboard checks ต้องทำจริงผ่าน browser ไม่เดาจาก code
- ตรวจกับหลาย states: default, focus, error, loading, empty

### 3. No Fixes During Review

- ไม่แก้ไข code ระหว่าง review — ส่งต่อ `/improve-accessibility`
- ใช้ `/deep-review` ถ้าต้องการวิเคราะห์เชิงลึกเพิ่ม

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /capture-image-app-to-screenshot ถ้าจำเป็น
- ใช้ /follow-lib-agent-browser ถ้าจำเป็น

## Expected Outcome

- รายงาน a11y findings พร้อม WCAG rule, severity, element และ evidence
- ครอบคลุม semantics, keyboard, ARIA, contrast, motion
- ระบุ coverage ของ automated vs manual checks
- next action ชัดเจนผ่าน `/improve-accessibility`
