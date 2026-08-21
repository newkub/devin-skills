---
name: review-uxui
description: Review UX/UI ครอบคลุม flows, interactions, visual, a11y, design system
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
  - skill
related:
  - follow-uxui
  - check-accessibility
  - deep-analyze
  - validate
  - report
  - suggest-next-action
  - report-format-table
---

## Goal

Review UX/UI ครอบคลุมทุก dimension ของ user experience และ interface design พร้อม aggregate findings และ review score

## Scope

UX/UI review สำหรับ: user flows, interaction design, visual hierarchy, typography, color theory, spacing system, layout principles, micro-interactions, UX writing, accessibility, design system compliance, responsive UX, animation UX, brand consistency, usability heuristics, cognitive load, error prevention — ไม่รวม component internals และ reactivity (อยู่ใน `/review-frontend`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ UX/UI structure, design system และ user flows ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ frontend structure และ design system
2. ระบุ UI framework, CSS framework, design tokens, breakpoint config และ component library ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review
4. ทำ `/follow-uxui` เพื่ออ้างอิง UX/UI best practices
5. ถ้างานเกี่ยวข้อง dashboard → ทำ `/follow-uxui`; ถ้าเป็น landing page → ทำ `/follow-uxui`

### 2. Deep Analyze Core

วิเคราะห์ UX/UI อย่างลึกซึ้งด้วย review CLI และ tools

> Goal: พบทุก UX/UI issue พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-review-cli` เพื่อให้ analyzers ครอบคลุม UX/UI categories ล่าสุด
3. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. ทำ `/check-accessibility` เพื่อตรวจสอบ accessibility ตามมาตรฐาน WCAG

### 3. User Flows And Interaction Design Review

Review user journey, interaction patterns และ state feedback

> Goal: ครอบคลุม user flows, interaction design, state feedback

1. ตรวจสอบ user flows: journey completeness, dead-end states, navigation patterns, back/forward behavior, redirect logic, entry/exit points, cross-page flow continuity
2. ตรวจสอบ interaction design: loading states (skeleton, spinner, progress), empty states (first-time, no-data, error-recovery), error states (inline, page-level, recovery path), success feedback (toast, inline, confirmation), transition between states
3. ตรวจสอบ usability heuristics: Nielsen 10 heuristics — system status visibility, real-world match, user control/freedom, consistency/standards, error prevention, recognition over recall, flexibility/efficiency, aesthetic/minimalist design, error recovery, help/documentation
4. ตรวจสอบ cognitive load: information density, progressive disclosure, decision fatigue, context switching, task complexity, attention management
5. Critical: broken user flow, dead-end state ไม่มีทางออก, no error recovery path, confusing navigation ที่ผู้ใช้หลงทาง, missing system status ที่ผู้ใช้ไม่รู้ว่ากำลังเกิดอะไร
6. High: missing loading state, inconsistent interaction pattern, confusing empty state, missing success feedback, high cognitive load ที่เกินจำเป็น, missing progressive disclosure
7. ถ้าพบปัญหา interaction/feedback/loading/toast/form/modal → ทำ `/follow-uxui` แล้ว delegate ไป `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, `/follow-uxui` ตามกรณี

### 4. Visual Design Review

Review visual hierarchy, typography, color theory, spacing system และ layout principles

> Goal: ครอบคลุม visual hierarchy, typography, color, spacing, layout

1. ตรวจสอบ visual hierarchy: focal point clarity, scan pattern (F-pattern, Z-pattern), content priority, visual weight balance, contrast between sections, information architecture reflected ใน visual
2. ตรวจสอบ typography: font scale (modular scale, ratio consistency), line height (readability, heading vs body), letter spacing (tracking, headings vs body), font pairing (max 2-3 families), font loading (FOUT/FOIT handling, font-display), responsive typography (clamp, fluid type, rem units)
3. ตรวจสอบ color theory: palette consistency, contrast ratio (WCAG AA/AAA), brand alignment, color usage semantics (success, warning, error, info), dark mode support, color blindness accessibility
4. ตรวจสอบ spacing system: scale usage (4px/8px base, consistent increments), margin/padding consistency, gap between elements, section spacing, whitespace ratio
5. ตรวจสอบ layout principles: grid system, alignment consistency, balance (symmetrical, asymmetrical), proximity (grouping related items), consistency across pages
6. Critical: broken visual hierarchy ที่ผู้ใช้ไม่รู้ว่าอะไรสำคัญ, insufficient contrast ที่อ่านไม่ได้, broken grid ที่ทำให้ layout พัง, brand inconsistency ที่ทำให้ไม่น่าเชื่อถือ
7. High: inconsistent typography scale, insufficient contrast (below WCAG AA), inconsistent spacing system, missing dark mode support, font loading ที่ทำให้ text กระตุก, missing responsive typography
8. ถ้างานเกี่ยวข้อง dashboard หรือ landing page → ทำ `/follow-uxui` หรือ `/follow-uxui` ตามกรณี

### 5. UX Writing And Microcopy Review

Review UX writing quality, microcopy clarity และ content strategy

> Goal: ครอบคลุม UX writing, microcopy, content clarity

1. ตรวจสอบ UX writing: clarity (plain language, jargon-free), conciseness, action-oriented (verbs, imperatives), consistency (terminology, tone, voice), user-centered language
2. ตรวจสอบ microcopy: button labels (action-specific, not generic "OK"), error messages (cause + solution), empty state text (purpose + next action), tooltip/help text (contextual), placeholder text (guidance, not replacement for label), confirmation dialog (clear consequence + action)
3. ตรวจสอบ content strategy: information hierarchy (inverted pyramid), content density (scannability, chunking), reading level (target audience match), localization readiness (text expansion), tone consistency across touchpoints
4. Critical: error message ที่ไม่บอกวิธีแก้, button label ที่กำกวม ทำให้ผู้ใช้กดผิด, empty state ที่ไม่มี next action
5. High: inconsistent terminology, system-centered language, redundant microcopy, missing tooltip บน complex action, placeholder ที่หายไปทำให้ field ไม่ชัด

### 6. Design System And Brand Consistency Review

Review design system compliance, token usage และ brand consistency

> Goal: ครอบคลุม design system, token usage, brand consistency

1. ตรวจสอบ design token usage: hardcoded colors ที่ควรเป็น token, hardcoded spacing ที่ควรเป็น token, hardcoded font sizes ที่ควรเป็น token, token naming convention, token documentation
2. ตรวจสอบ component pattern compliance: variant usage (not custom overrides), standard vs custom ratio, override patterns (justified vs unjustified), prop consistency, slot/composition patterns
3. ตรวจสอบ brand consistency: logo usage, brand color adherence, brand typography adherence, brand voice/tone ใน UI, icon style consistency, illustration style consistency
4. ตรวจสอบ design system drift: custom styles ที่นอก design system, one-off components ที่ควรเป็น shared, inconsistent patterns ระหว่าง pages
5. Critical: hardcoded colors ที่ break dark mode, design system drift ที่ทำให้ product ไม่ consistent, brand violation ที่ทำให้ไม่น่าเชื่อถือ
6. High: hardcoded spacing/font sizes, inconsistent component overrides, missing token documentation, icon style inconsistency, one-off components ที่ควรเป็น shared

### 7. Responsive UX, Animation UX And Accessibility Review

Review responsive UX, animation UX และ accessibility compliance

> Goal: ครอบคลุม responsive UX, animation UX, accessibility

1. ตรวจสอบ responsive UX: mobile-first approach, touch target sizes (min 44x44px), gesture support, thumb zone placement, orientation support, safe area insets (notch, home indicator)
2. ตรวจสอบ animation UX: animation purpose (guiding attention, feedback), timing (duration, easing, natural motion), `prefers-reduced-motion` support, loading animation appropriateness, micro-interactions (hover, focus, active, press feedback), animation performance (transform/opacity vs layout/paint)
3. ตรวจสอบ accessibility: keyboard navigation (tab order, focus visible, focus trap), screen reader support (ARIA, semantic HTML, heading hierarchy), color contrast (WCAG AA 4.5:1 text, 3:1 large text), alternative text (images, icons, charts), form accessibility (label association, error identification), skip links, landmark roles
4. Critical: no keyboard navigation, keyboard trap, no screen reader support, contrast below 3:1, missing focus indicator, no `prefers-reduced-motion` บน animation ที่รุนแรง, touch target เล็กกว่า 44px บน critical action
5. High: missing ARIA, broken focus management, insufficient contrast (below WCAG AA), missing alt text, heading hierarchy issue, missing responsive breakpoint สำคัญ, animation ที่ไม่จำเป็น, missing micro-interaction feedback
6. ถ้าพบปัญหา animation/interaction/gesture/scroll/a11y/3D/chart → ทำ `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, `/follow-uxui`, หรือ `/follow-uxui` ตามกรณี

### 8. Validate, Rate And Report

ตรวจสอบ findings ให้คะแนน severity และรายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
6. ทำ `/report` พร้อม `/report-format-table` สร้างตาราง aggregate findings จากทุก section
7. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI → ข้ามทั้ง workflow
- ถ้า project ไม่มี forms → ข้าม Step 3 interaction design ส่วน forms
- ถ้า project ไม่มี design system → ข้าม Step 6
- ถ้า project ไม่มี animations → ข้าม Step 7 item 2
- ถ้า project ไม่ใช่ web app → ข้าม Step 7 item 1 responsive UX
- ถ้า project ไม่มี i18n → ข้าม Step 5 item 3 localization readiness

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
- ถ้าพบ issue ที่เกี่ยว component internals หรือ reactivity → อ้างอิง `/review-frontend`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก UX/UI section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
