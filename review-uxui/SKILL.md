---
name: review-uxui
description: Review UX writing, accessibility, and visual design
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review UX/UI ครอบคลุม UX writing, accessibility, และ visual design พร้อม aggregate findings และ review score

## Scope

UX/UI review สำหรับ user flows, interaction design, visual hierarchy, typography, color theory, spacing system, layout principles, micro-interactions, UX writing, accessibility, design system compliance, responsive UX, animation UX, brand consistency, usability heuristics, cognitive load, และ error prevention โดยอ้างอิง `improve-uxui`, `improve-ux-writing`, และ `improve-web-accessibility` — ไม่รวม component internals และ reactivity (อยู่ใน `/review-codebase`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ UX/UI structure, design system, และ user flows ใน codebase

1. ใช้ `/scan-codebase` เพื่อตรวจสอบ frontend structure และ design system
2. ระบุ UI framework, CSS framework, design tokens, breakpoint config, และ component library ที่ใช้
3. ถ้าเป็น web project → ใช้ `/run-dev` เพื่อ verify dev server ก่อน review
4. ใช้ `/follow-uxui` เพื่ออ้างอิง UX/UI best practices
5. ถ้างานเกี่ยวข้อง dashboard หรือ landing page → ใช้ `/follow-uxui`

### 2. Visual Design Review

Review visual hierarchy, typography, color theory, spacing system, และ layout principles

> Goal: ครอบคลุม visual design ตาม `/review-uxui` และ `/follow-uxui`

1. ตรวจสอบ visual hierarchy: focal point clarity, scan pattern, content priority, visual weight balance, contrast ระหว่าง section, information architecture ที่สะท้อนในภาพ
2. ตรวจสอบ typography: font scale, line height, letter spacing, font pairing, font loading, responsive typography
3. ตรวจสอบ color theory: palette consistency, contrast ratio (WCAG AA/AAA), brand alignment, semantic color usage, dark mode support, color blindness accessibility
4. ตรวจสอบ spacing system: scale usage, margin/padding consistency, gap, section spacing, whitespace ratio
5. ตรวจสอบ layout principles: grid system, alignment consistency, balance, proximity, consistency ข้าม page
6. Critical: broken visual hierarchy ที่ผู้ใช้ไม่รู้ว่าอะไรสำคัญ, insufficient contrast ที่อ่านไม่ได้, broken grid ที่ทำให้ layout พัง, brand inconsistency ที่ทำให้ไม่น่าเชื่อถือ
7. High: inconsistent typography scale, insufficient contrast (below WCAG AA), inconsistent spacing system, missing dark mode support, font loading ที่ทำให้ text กระตุก, missing responsive typography

### 3. UX Writing Review

Review UX writing, microcopy, และ content strategy ตาม `/review-ux-writing`

> Goal: ครอบคลุม UX writing ทุกจุดสัมผัส

1. ตรวจสอบ current copy: หา copy ทั้งหมดใน components, pages, routes; จัดประเภทตามฟังก์ชัน navigation, action, feedback, guidance, error; บันทึก ambiguous, ยาวเกินไป, ศัพท์เทคนิค, ไม่สอดคล้องกัน
2. ตรวจสอบ voice และ tone: brand personality, tone ตาม context, voice guidelines, tone matrix, documentation
3. ตรวจสอบ microcopy: button labels, link text, menu items, tooltips, placeholder text, consistency คำศัพท์
4. ตรวจสอบ error messages: บอกสาเหตุและวิธีแก้, หลีกเลี่ยง standalone "Error", "Failed", "Invalid", ใช้ human language, แยก validation errors กับ system errors
5. ตรวจสอบ empty states: อธิบายสิ่งที่จะปรากฏ, มี call-to-action, ใช้ icon/illustration ที่สื่อความหมาย, ไม่ปล่อยพื้นที่ว่างโดยไม่มีคำอธิบาย, แยก first-time/no results/no permission/no data
6. ตรวจสอบ onboarding copy: welcome message อบอุ่นกระชับ, value proposition ใน 1-2 ประโยค, แบ่ง instructions เป็นขั้นตอนสั้น, progressive disclosure, หลีกเลี่ยง information overload
7. ตรวจสอบ forms และ validation: field labels ชัดเจน, helper text, validation messages, required field indicators, inline validation
8. ตรวจสอบ notifications และ alerts: toast กระชับ, banner บอกความสำคัญและ action, confirmation dialog ถามชัดเจน, tone สอดคล้อง severity
9. ตรวจสอบ CLI และ TUI copy: help messages กระชับมี examples, actionable error messages, consistent flag naming, concise labels, clear status messages, meaningful color coding
10. ตรวจสอบ localization readiness: หลีกเลี่ยง idioms และ cultural references, copy ที่ยืดหยุ่นต่อความยาวข้อความ, placeholders ชัดเจน, ไม่ hardcode copy ใน components
11. Critical: error message ที่ไม่บอกวิธีแก้, button label กำกวมทำให้ผู้ใช้กดผิด, empty state ที่ไม่มี next action
12. High: inconsistent terminology, system-centered language, redundant microcopy, missing tooltip บน complex action, placeholder ที่ทำให้ field ไม่ชัด

### 4. Accessibility Review

Review accessibility ตาม WCAG และ `/review-web-accessibility`

> Goal: ครอบคลุม keyboard, screen reader, contrast, forms, และ media

1. ตรวจสอบ keyboard navigation: tab order, focus indicators ชัดเจน, keyboard shortcuts, ไม่มี keyboard trap
2. ตรวจสอบ screen reader support: ARIA labels/roles, alt text, semantic HTML, heading hierarchy
3. ตรวจสอบ color contrast: WCAG AA/AAA ratios, ไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย, text กับ background contrast
4. ตรวจสอบ forms: form labels ชัดเจน, error messages เข้าถึงได้, validation messages, form controls ใช้ keyboard ได้
5. ตรวจสอบ media: captions สำหรับ videos, audio descriptions, autoplay ไม่รบกวน, controls ที่ pause ได้
6. ใช้ `/check-accessibility` สำหรับ automated WCAG checks และ review manual gaps
7. Critical: no keyboard navigation, keyboard trap, no screen reader support, contrast below 3:1, missing focus indicator, no `prefers-reduced-motion` บน animation ที่รุนแรง, touch target เล็กกว่า 44px บน critical action
8. High: missing ARIA, broken focus management, insufficient contrast (below WCAG AA), missing alt text, heading hierarchy issue, missing responsive breakpoint สำคัญ, animation ที่ไม่จำเป็น, missing micro-interaction feedback

### 5. Interaction Design And User Flows Review

Review user journey, interaction patterns, และ state feedback

> Goal: ครอบคลุม user flows, interaction design, state feedback

1. ตรวจสอบ user flows: journey completeness, dead-end states, navigation patterns, back/forward behavior, redirect logic, entry/exit points, cross-page flow continuity
2. ตรวจสอบ interaction design: loading states, empty states, error states, success feedback, transition between states
3. ตรวจสอบ usability heuristics: Nielsen 10 heuristics — system status visibility, real-world match, user control/freedom, consistency/standards, error prevention, recognition over recall, flexibility/efficiency, aesthetic/minimalist design, error recovery, help/documentation
4. ตรวจสอบ cognitive load: information density, progressive disclosure, decision fatigue, context switching, task complexity, attention management
5. Critical: broken user flow, dead-end state ไม่มีทางออก, no error recovery path, confusing navigation ที่ผู้ใช้หลงทาง, missing system status ที่ผู้ใช้ไม่รู้ว่ากำลังเกิดอะไร
6. High: missing loading state, inconsistent interaction pattern, confusing empty state, missing success feedback, high cognitive load ที่เกินจำเป็น, missing progressive disclosure

### 6. Design System And Brand Consistency Review

Review design system compliance, token usage, และ brand consistency

> Goal: ครอบคลุม design system, token usage, brand consistency

1. ตรวจสอบ design token usage: hardcoded colors/spacing/font sizes ที่ควรเป็น token, token naming convention, token documentation
2. ตรวจสอบ component pattern compliance: variant usage, standard vs custom ratio, override patterns, prop consistency, slot/composition patterns
3. ตรวจสอบ brand consistency: logo usage, brand color, brand typography, brand voice/tone ใน UI, icon style, illustration style
4. ตรวจสอบ design system drift: custom styles นอก design system, one-off components, inconsistent patterns ระหว่าง pages
5. Critical: hardcoded colors ที่ break dark mode, design system drift ที่ทำให้ product ไม่ consistent, brand violation ที่ทำให้ไม่น่าเชื่อถือ
6. High: hardcoded spacing/font sizes, inconsistent component overrides, missing token documentation, icon style inconsistency, one-off components ที่ควรเป็น shared

### 7. Responsive UX And Animation Review

Review responsive UX, animation UX

> Goal: ครอบคลุม responsive UX, animation UX

1. ตรวจสอบ responsive UX: mobile-first approach, touch target sizes (min 44x44px), gesture support, thumb zone placement, orientation support, safe area insets
2. ตรวจสอบ animation UX: animation purpose, timing (duration, easing, natural motion), `prefers-reduced-motion` support, loading animation appropriateness, micro-interactions, animation performance (transform/opacity vs layout/paint)

### 8. Validate And Report

ตรวจสอบ findings ให้คะแนน severity และรายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ใช้ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ใช้ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ใช้ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
6. ใช้ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings จากทุก section
7. ใช้ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI → ข้ามทั้ง workflow
- ถ้า project ไม่มี forms → ข้าม interaction design ส่วน forms
- ถ้า project ไม่มี design system → ข้าม Design System section
- ถ้า project ไม่มี animations → ข้าม animation items
- ถ้า project ไม่ใช่ web app → ข้าม responsive UX items
- ถ้า project ไม่มี i18n → ข้าม localization readiness item

### 2. Severity Classification

- Critical: broken user flow, dead-end state, no error recovery, no keyboard navigation, keyboard trap, no screen reader support, contrast below 3:1, broken visual hierarchy, hardcoded colors ที่ break dark mode, design system drift ที่ทำให้ product ไม่ consistent, no `prefers-reduced-motion` บน animation ที่รุนแรง
- High: missing loading state, inconsistent interaction pattern, insufficient contrast (below WCAG AA), missing ARIA, broken focus management, inconsistent typography scale, inconsistent spacing system, missing dark mode support, touch target เล็กกว่า 44px, missing micro-interaction feedback, hardcoded spacing/font sizes, inconsistent component overrides
- Medium: styling inconsistency, minor accessibility gap, missing alt text, heading hierarchy issue, minor token inconsistency, missing responsive breakpoint, unnecessary animation, inconsistent terminology
- Low: cosmetic, minor spacing adjustment, minor typography improvement, minor microcopy refinement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification — ใช้ `/check-accessibility` สำหรับ accessibility findings

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าพบ issue ที่เกี่ยว component internals หรือ reactivity → อ้างอิง `/review-codebase`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก UX/UI section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

