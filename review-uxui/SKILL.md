---
name: review-uxui
description: Review UX/UI design quality, design system, visual, interaction, accessibility, handoff
argument-hint: "[scope]"
related:
  - deep-review
  - roleplay-by-all-stakeholder
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - suggest-next-action
  - deep-optimize
  - follow-design-system
  - follow-lib-animejs
  - capture
  - review-accessibility
  - improve-uxui
  - deep-review-then-fix
---

## Goal

Review UX/UI design quality จาก source code ครอบคลุม design system, visual design, interaction design, accessibility, และ design-dev handoff พร้อม severity ratings และ review score

## Scope

UX/UI design review สำหรับ project ที่มี UI — ตรวจ design tokens, component library, visual consistency, interaction states, accessibility signals (contrast, focus states ที่เห็นใน design), settings completeness, motion/delight, design-dev handoff quality, user flow mapping และ journey analysis

ไม่รวม:
- WCAG audit deep-dive (semantics, ARIA, keyboard, screen reader) → ใช้ `/review-accessibility`
- frontend code architecture, state management, rendering performance → ใช้ `/review-frontend`
- platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/deep-review`
- SEO → ใช้ `/review-seo`
- roleplay/simulation จากมุมมอง UI designer → ใช้ `/roleplay-by-all-stakeholder`
- roleplay/simulation จากมุมมอง UX researcher → ใช้ `/roleplay-by-all-stakeholder`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ UI structure, design tokens, component library, และ styling system

1. ทำ `/scan-codebase` เพื่อเข้าใจ UI structure และ styling system
2. ระบุ design token system, component library, CSS framework, theme config, icon set, typography setup
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/run-review` เพื่อดึง metrics ล่าสุด
5. ถ้ามี user flow หรือ journey ให้ map ตาม `references/user-flow.md`
6. ถ้าสแกนไม่ได้ → stop และ report
7. ถ้าต้องการ capture ภาพ component สำหรับ review ให้ทำ `/capture`

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

### 6. Settings And Preferences

> Goal: settings ครบ features พื้นฐาน และ visual/interactive พอ

ทำตาม `references/settings.md` — expected sections (profile, appearance, shortcuts, notifications, privacy, data, about), settings UX (nav, deep-link, save model, danger zone) และ interactive controls (preview, recorder, toggles)

### 7. Motion And Delight

> Goal: motion purpose-driven, consistent และ respect reduced-motion

ทำตาม `references/motion.md` — motion tokens, easing consistency, `prefers-reduced-motion`, skeleton loading, micro-interactions, anti-patterns; implementation reference → `/follow-lib-animejs`

### 8. Design-Dev Handoff

> Goal: ครอบคลุมทุก handoff dimension

ทำตาม `references/handoff.md`

### 9. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, compliance
2. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
3. ระบุ false positives ที่พบ
4. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ section ที่เกี่ยวข้อง

### 10. Report

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report table`
2. สร้างตาราง findings: Dimension, Finding, Severity, Location, Design Impact, Recommendation
3. คำนวณ review score ตามสูตรใน `references/scoring.md`
4. สร้าง design maturity scorecard: 7 dimensions, score 1-5
5. สรุป top 3-5 design issues ที่ต้องแก้ก่อน
6. สรุป top 3-5 design wins ที่ทำดี
7. ทำ `/suggest-next-action`

### Fix Dispatch

> Goal: งาน fix ไปที่ fix guide ที่ตรง domain — execute เฉพาะหลัง user confirm (ดู `## Fix`)

- UX/UI findings ทุก dimension → `subskills/improve-uxui-fix/SKILL.md` (dispatch ต่อไปยัง `references/fix-uxui/*.md` ตาม domain)

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI ให้ stop และ report
- ถ้า project ไม่มี design token system → ข้าม token checks แต่ flag เป็น Critical finding
- ถ้า project ไม่มี component library → ข้าม component library checks แต่ flag เป็น High finding
- ถ้า project ไม่มี dark mode requirement → ข้าม theme support checks
- ถ้า project ไม่มี touch target → ข้าม gesture checks
- ถ้า project ไม่มี settings page → ข้าม settings checks (ไม่ flag — settings ไม่ใช่ requirement ของทุก app)
- ถ้า project เป็น CLI/static content → ข้าม motion checks

### 2. Severity Classification

- Critical: ไม่มี design system, accessibility ไม่ผ่าน (contrast < 3:1, no keyboard), ใช้ไม่ได้จริง, no loading/empty/error states
- High: inconsistency กระจาย, ไม่มี loading/empty/error states, keyboard ใช้ไม่ได้, missing focus indicators, no dark mode
- Medium: inconsistency บางจุด, ขาด micro-interactions, spacing ไม่สม่ำเสมอ, minor contrast issues, settings ขาด section พื้นฐาน (theme/shortcuts/notifications), motion tokens ไม่มี
- Low: polish ไม่พอ, animation ขาด, icon ไม่สม่ำเสมอ, documentation gap, settings ขาด preview/interactive controls
- Info: suggestion, best practice recommendation

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number หรือ code snippet
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `axe`, `Lighthouse`)
- ระบุ token, component, page, หรือ element ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ
- แยกหน้าที่ระหว่าง design issue และ implementation issue

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (uxui)
- ไม่ลบไฟล์, โค้ด, styles, หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 5. Scope Boundaries

- ไม่ review frontend code architecture, state management, rendering performance → ใช้ `/review-frontend`
- ไม่ review platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/deep-review`
- ไม่ review SEO → ใช้ `/review-seo`
- ไม่ review code quality, bug-prone patterns → ใช้ `/review-quality`
- focus ที่ design quality: design system, visual, interaction, accessibility, settings, motion, handoff

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding (uxui)
- แสดง score ต่อ dimension และ overall score (uxui)
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (uxui)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report table`

- ใช้ /deep-optimize ถ้าจำเป็น
- ใช้ /follow-design-system ถ้าจำเป็น

- ใช้ /review-accessibility ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. browser fix pass → `/improve-uxui` (orchestrates watch passes + UXUI features + Playwright sync)
2. findings ตาม `references/fix-improve-uxui.md` — functional → visual → accessibility order
3. verify: re-run browser pass + `/deep-test e2e`; persist `.devin/reports/<workspace>/uxui-<time>.md`

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-dev ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง findings จากทุก UX/UI section พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- Design maturity scorecard: 7 dimensions, score 1-5
- สรุป design issues และ design wins
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
