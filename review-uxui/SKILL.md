---
name: review-uxui
description: Review UX/UI design quality, design system, visual, interaction, accessibility, handoff
related:
  - review-platform
  - roleplay-stakeholder
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - report-table
  - suggest-next-action
  - improve-uxui
  - optimize-everything
  - follow-design-system
  - capture-component
---

## Goal

Review UX/UI design quality จาก source code ครอบคลุม design system, visual design, interaction design, accessibility, และ design-dev handoff พร้อม severity ratings และ review score

## Scope

UX/UI design review สำหรับ project ที่มี UI — ตรวจ design tokens, component library, visual consistency, interaction states, accessibility (WCAG 2.1), design-dev handoff quality, user flow mapping และ journey analysis

ไม่รวม:
- frontend code architecture, state management, rendering performance → ใช้ `/review-frontend`
- platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/review-platform`
- SEO → ใช้ `/review-seo`
- roleplay/simulation จากมุมมอง UI designer → ใช้ `/roleplay-stakeholder`
- roleplay/simulation จากมุมมอง UX researcher → ใช้ `/roleplay-stakeholder`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ UI structure, design tokens, component library, และ styling system

1. ทำ `/scan-codebase` เพื่อเข้าใจ UI structure และ styling system
2. ระบุ design token system, component library, CSS framework, theme config, icon set, typography setup
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/run-review` เพื่อดึง metrics ล่าสุด
5. ถ้ามี user flow หรือ journey ให้ map ตาม `references/user-flow.md`
6. ถ้าสแกนไม่ได้ → stop และ report
7. ถ้าต้องการ capture ภาพ component สำหรับ review ให้ทำ `/capture-component`

### 2. Design System

> Goal: ครอบคลุมทุก design system dimension

ทำตาม `references/design-system.md`

### 3. Visual Design

> Goal: ครอบคลุมทุก visual design dimension

ทำตาม `references/visual-design.md`

### 4. Interaction Design

> Goal: ครอบคลุมทุก interaction design dimension

ทำตาม `references/interaction-design.md`

### 5. Accessibility

> Goal: ครอบคลุมทุก accessibility dimension

ทำตาม `references/accessibility.md`

### 6. Design-Dev Handoff

> Goal: ครอบคลุมทุก handoff dimension

ทำตาม `references/handoff.md`

### 7. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, compliance
2. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
3. ระบุ false positives ที่พบ
4. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ section ที่เกี่ยวข้อง

### 8. Report

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

- ใช้ /improve-uxui ถ้าจำเป็น
- ใช้ /optimize-everything ถ้าจำเป็น
- ใช้ /follow-design-system ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง findings จากทุก UX/UI section พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- Design maturity scorecard: 5 dimensions, score 1-5
- สรุป design issues และ design wins
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
