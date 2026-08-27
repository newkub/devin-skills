---
name: review-uxui
description: Review UX/UI design quality, design system, visual, interaction, accessibility, handoff
related:
  - review-platform
  - roleplay-ux-researcher
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review UX/UI design quality จาก source code ครอบคลุม design system, visual design, interaction design, accessibility, และ design-dev handoff พร้อม severity ratings และ review score

## Scope

UX/UI design review สำหรับ project ที่มี UI — ตรวจ design tokens, component library, visual consistency, interaction states, accessibility (WCAG 2.1), และ design-dev handoff quality

ไม่รวม:
- frontend code architecture, state management, rendering performance → ใช้ `/review-frontend`
- platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/review-platform`
- SEO → ใช้ `/review-seo`
- roleplay/simulation จากมุมมอง UI designer → ใช้ `/roleplay-ui-designer`
- roleplay/simulation จากมุมมอง UX researcher → ใช้ `/roleplay-ux-researcher`

## Execute

### 1. Prepare And Scan

สแกน codebase เพื่อเข้าใจ design system และ UI setup

> Goal: เข้าใจ design tokens, component library, styling system, และ UI patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ UI structure และ styling system
2. ระบุ design token system, component library, CSS framework (UnoCSS, Tailwind, CSS modules), theme config, icon set, typography setup
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
7. ถ้าสแกนไม่ได้ → stop และ report

### 2. Design System Review

Review design system — ดูรายละเอียดใน `references/design-system.md`

> Goal: ครอบคลุมทุก design system dimension

1. ตรวจ design tokens: color, spacing, typography, radius, shadow, z-index — ครบไหม, semantic หรือ raw
2. ตรวจ token usage: ใช้ tokens สม่ำเสมอไหม, มี hardcoded values, magic numbers ไหม
3. ตรวจ component library: reusable, composable, variant system ชัดไหม
4. ตรวจ design system compliance: components ใช้ design system จริงไหม, มี one-off styles ไหม
5. ตรวจ theme support: dark mode, theming, token switching
6. Critical: ไม่มี design tokens เลย, ไม่มี component library, hardcoded values ทั่วทั้ง project
7. High: token ไม่ครบ, inconsistent token usage, missing dark mode, one-off styles กระจาย

### 3. Visual Design Review

Review visual design — ดูรายละเอียดใน `references/visual-design.md`

> Goal: ครอบคลุมทุก visual design dimension

1. ตรวจ color usage: palette consistency, contrast, semantic colors, color spam
2. ตรวจ typography: type scale, hierarchy, line-height, font loading
3. ตรวจ spacing: spacing scale consistency, arbitrary spacing, rhythm
4. ตรวจ layout: grid system, alignment, responsive breakpoints
5. ตรวจ visual hierarchy: focal point, visual noise, importance ordering
6. ตรวจ iconography: icon set consistency, mixed sets, size, semantic
7. Critical: contrast ต่ำมาก (< 3:1 บน text), ใช้ไม่ได้จริง, color สื่อความหมายผิด
8. High: inconsistent palette, broken type hierarchy, arbitrary spacing กระจาย, no grid system

### 4. Interaction Design Review

Review interaction design — ดูรายละเอียดใน `references/interaction-design.md`

> Goal: ครอบคลุมทุก interaction design dimension

1. ตรวจ micro-interactions: hover, focus, active states, transitions, delight moments
2. ตรวจ loading states: skeletons, spinners, progress, consistency
3. ตรวจ empty states: empty state design, guidance, illustration
4. ตรวจ error states: error UI consistency, inline errors, error pages
5. ตรวจ feedback: toast, snackbar, inline feedback, motion feedback
6. ตรวจ gestures and touch: touch-friendly targets, swipe gestures, haptic feedback
7. Critical: ไม่มี loading/empty/error states เลย, ไม่มี feedback สำหรับ critical action
8. High: inconsistent states, missing hover/focus states, no touch targets, missing micro-interactions

### 5. Accessibility Review

Review accessibility ตาม WCAG 2.1 — ดูรายละเอียดใน `references/accessibility.md`

> Goal: ครอบคลุมทุก accessibility dimension

1. ตรวจ semantic HTML: semantic tags, div soup, heading hierarchy
2. ตรวจ ARIA: labels, usage correctness, over-ARIA, live regions
3. ตรวจ keyboard navigation: tab order, focus indicators, focus traps, skip link
4. ตรวจ color contrast: WCAG AA (text ≥ 4.5:1), ไม่ใช้สีเพียงอย่างเดียว
5. ตรวจ screen reader: alt text, aria-hidden ที่ไม่จำเป็น, live regions
6. รัน automated audit: axe, Lighthouse, pa11y ถ้ามี
7. Critical: no keyboard access, no alt text บน critical images, contrast < 3:1, no focus indicators
8. High: missing labels, broken heading hierarchy, missing skip link, contrast < 4.5:1

### 6. Design-Dev Handoff Review

Review design-dev handoff — ดูรายละเอียดใน `references/handoff.md`

> Goal: ครอบคลุมทุก handoff dimension

1. ตรวจ design specs in code: code สะท้อน design specs ไหม, design debt, drift
2. ตรวจ responsive implementation: responsive ครบไหม, breakpoints ครบไหม, overflow
3. ตรวจ cross-browser: vendor prefixes, fallbacks, browser-specific hacks
4. ตรวจ design documentation: design tokens documented, component docs, storybook
5. Critical: design กับ code ต่างกันมาก, responsive พังบน breakpoint หลัก, broken บน target browser
6. High: significant design drift, missing responsive breakpoints, missing component docs

### 7. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ section ที่เกี่ยวข้อง

### 8. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Dimension, Finding, Severity, Location, Design Impact, Recommendation
3. คำนวณ review score ตามสูตรใน `references/scoring.md`
4. สร้าง design maturity scorecard: 5 dimensions, score 1-5
5. สรุป top 3-5 design issues ที่ต้องแก้ก่อน
6. สรุป top 3-5 design wins ที่ทำดี
7. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI ให้ stop และ report
- ถ้า project ไม่มี design token system → ข้าม token checks แต่ flag เป็น Critical finding
- ถ้า project ไม่มี component library → ข้าม component library checks แต่ flag เป็น High finding
- ถ้า project ไม่มี dark mode requirement → ข้าม theme support checks
- ถ้า project ไม่มี touch target → ข้าม gesture checks

### 2. Severity Classification

- Critical: ไม่มี design system, accessibility ไม่ผ่าน (contrast < 3:1, no keyboard), ใช้ไม่ได้จริง, no loading/empty/error states
- High: inconsistency กระจาย, ไม่มี loading/empty/error states, keyboard ใช้ไม่ได้, missing focus indicators, no dark mode
- Medium: inconsistency บางจุด, ขาด micro-interactions, spacing ไม่สม่ำเสมอ, minor contrast issues
- Low: polish ไม่พอ, animation ขาด, icon ไม่สม่ำเสมอ, documentation gap
- Info: suggestion, best practice recommendation

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number หรือ code snippet
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `axe`, `Lighthouse`)
- ระบุ token, component, page, หรือ element ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ
- แยกหน้าที่ระหว่าง design issue และ implementation issue

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์, โค้ด, styles, หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 5. Scope Boundaries

- ไม่ review frontend code architecture, state management, rendering performance → ใช้ `/review-frontend`
- ไม่ review platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/review-platform`
- ไม่ review SEO → ใช้ `/review-seo`
- ไม่ review code quality, bug-prone patterns → ใช้ `/review-quality`
- focus ที่ design quality: design system, visual, interaction, accessibility, handoff

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings จากทุก UX/UI section พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- Design maturity scorecard: 5 dimensions, score 1-5
- สรุป design issues และ design wins
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
