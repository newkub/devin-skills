---
name: roleplay-uxui-designer
description: รับบทเป็น UX/UI designer อ่าน source code แล้ววิจารณ์ design quality, consistency, design system
---

## Goal

รับบทเป็น UX/UI designer อ่าน source code แล้ววิจารณ์ design quality, consistency, design system compliance, และ visual polish จากมุมมองคนทำ design ไม่ใช่ developer

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง UX/UI designer ครอบคลุม design system, visual consistency, interaction design, accessibility, และ design-dev handoff โดย AI รับบทเป็น designer วิจารณ์จากการอ่าน source code

## Execute

### 1. Read Code Context

> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา UI code
2. อ่าน components, pages, layouts, templates, design tokens, theme config
3. อ่าน CSS/styling system, utility classes, design system config (UnoCSS, Tailwind, etc.)
4. อ่าน icons, typography, spacing, color usage patterns
5. ถ้าหา UI code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify Designer Profile

> Goal: Identify Designer Profile

1. ระบุ designer level (junior, mid, senior, principal/staff)
2. ระบุ design focus (visual design, interaction design, design systems, accessibility specialist)
3. ระบุ design philosophy (minimal, expressive, data-dense, playful, enterprise)
4. ระบุ platform focus (web, mobile, cross-platform, responsive)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Design Review

> Goal: Simulate Design Review

Goal reminder: คิดเหมือน designer ที่วิจารณ์ design quality ไม่ใช่ developer ที่เช็คว่าทำงานไหม

1. เลือก 3-5 design perspectives ที่แตกต่างกัน (visual designer, interaction designer, accessibility specialist, design systems lead, product designer)
2. สำหรับแต่ละ perspective จำลอง: "ถ้าเราเป็น designer คนนี้ จะวิจารณ์อะไร?"
3. ระบุ design issues ที่เห็นจาก code
4. ระบุ design wins ที่ทำดี
5. ประเมิน design maturity: ad-hoc, emerging, established, mature

### 4. Analyze Every Design Dimension

> Goal: Analyze Every Design Dimension

Design System:

1. Token architecture: มี design tokens ไหม, ครบไหม (color, spacing, typography, radius, shadow, z-index), semantic หรือ raw
2. Token usage: ใช้ tokens สม่ำเสมอไหม, มี hardcoded values ไหม, มี magic numbers ไหม
3. Component library: มี reusable components ไหม, composable ไหม, variant system ชัดไหม
4. Design system compliance: components ใช้ design system จริงไหม, มี one-off styles ไหม
5. Theme support: มี dark mode ไหม, มี theming ไหม, token switching ทำได้ไหม

Visual Design:

6. Color usage: palette สม่ำเสมอไหม, contrast พอไหม, semantic colors ใช้ถูกไหม, มี color spam ไหม
7. Typography: type scale ชัดไหม, hierarchy ชัดไหม, line-height พอไหม, font loading ดีไหม
8. Spacing: spacing scale สม่ำเสมอไหม, มี arbitrary spacing ไหม, rhythm สม่ำเสมอไหม
9. Layout: grid system ชัดไหม, alignment สม่ำเสมอไหม, responsive breakpoints ดีไหม
10. Visual hierarchy: สามารถบอกได้ไหมว่าอะไรสำคัญกว่า, มี visual noise ไหม, focal point ชัดไหม
11. Iconography: icons สม่ำเสมอไหม, มี mixed icon sets ไหม, size สม่ำเสมอไหม, semantic ไหม

Interaction Design:

12. Micro-interactions: มี hover, focus, active states ไหม, transitions สม่ำเสมอไหม, มี delight moments ไหม
13. Loading states: มี skeletons ไหม, spinners ไหม, progress ไหม, สม่ำเสมอไหม
14. Empty states: มี empty state design ไหม, มี guidance ไหม, มี illustration ไหม
15. Error states: error UI สม่ำเสมอไหม, มี inline errors ไหม, มี error pages ไหม
16. Feedback: toast, snackbar, inline feedback สม่ำเสมอไหม, มี motion feedback ไหม
17. Gestures and touch: มี touch-friendly targets ไหม, มี swipe gestures ไหม, มี haptic feedback ไหม

Accessibility:

18. Semantic HTML: ใช้ semantic tags ไหม, มี div soup ไหม, heading hierarchy ถูกไหม
19. ARIA: มี ARIA labels ไหม, ใช้ถูกไหม, มี over-ARIA ไหม, live regions ไหม
20. Keyboard navigation: ใช้งานด้วย keyboard ได้ไหม, tab order สมเหตุสมผลไหม, มี focus traps ไหม
21. Color contrast: ผ่าน WCAG AA/AAA ไหม, มี contrast issues ไหม, สีสื่อความหมายไหม
22. Screen reader: ใช้งานด้วย screen reader ได้ไหม, มี alt text ไหม, มี aria-hidden ที่ไม่จำเป็นไหม

Design-Dev Handoff:

23. Design specs in code: code สะท้อน design specs ไหม, มี design debt ไหม, มี drift ไหม
24. Responsive implementation: ทำ responsive ครบไหม, มี breakpoints ที่ไม่ครบ ไหม, มี overflow ไหม
25. Cross-browser: มี vendor prefixes ไหม, มี fallbacks ไหม, มี browser-specific hacks ไหม

### 5. Map Findings To Code

> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (design system, visual, interaction, accessibility, handoff)
4. ระบุ designer perspective ที่เห็นจุดนี้
5. ถ้าไม่มี evidence ใน code ให้ระบุเป็น assumption

### 6. Generate Design Review Report

> Goal: Generate Design Review Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Design Impact, Recommendation
3. สร้าง design maturity scorecard: 5 dimensions, score 1-5
4. สรุป top 3-5 design issues ที่ต้องแก้ก่อน
5. สรุป top 3-5 design wins ที่ทำดี
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/update-review-codebase-cli-and-run`

### 2. Think Like A Designer

- คิดเหมือน designer ที่วิจารณ์ design quality ไม่ใช่ developer ที่เช็คว่าทำงานไหม
- ถามตัวเอง "ถ้าเราเป็น designer คนนี้ จะวิจารณ์อะไร?" ทุก dimension
- พิจารณา designer หลายประเภท (visual, interaction, accessibility, systems, product)
- ไม่จำกัดแค่ว่าสวยไหม แต่ครอบคลุม consistency, system, accessibility, และ handoff
- คิดถึง design ที่ professional ไม่ใช่แค่ functional

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง design issue และ implementation issue

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (design system, visual, interaction, accessibility, handoff)
- ตรวจจากหลาย designer perspective
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- ระบุทั้ง design issues และ design wins

### 5. Severity

- Critical: design system ไม่มี, accessibility ไม่ผ่าน, contrast ต่ำมาก, ใช้ไม่ได้จริง
- High: inconsistency กระจาย, ไม่มี loading/empty/error states, keyboard ใช้ไม่ได้
- Medium: inconsistency บางจุด, ขาด micro-interactions, spacing ไม่สม่ำเสมอ
- Low: polish ไม่พอ, animation ขาด, icon ไม่สม่ำเสมอ

### 6. Integration

- ถ้า design review ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการวาด sketch ช่วย visualize ให้ทำ `/report-ansi`
- ถ้าต้องการ scan UX/UI patterns จริง ให้ใช้ `/update-review-codebase-cli-and-run`
- ถ้าต้องการ scan components ให้ใช้ `/update-review-codebase-cli-and-run`
- ถ้าต้องการ scan accessibility จริง ให้ใช้ `/update-review-codebase-cli-and-run`
- ถ้าต้องการมุมมอง user ให้ใช้ `/roleplay-user`

### 7. Output

- รายงานตาราง design findings ชัดเจน จัดกลุ่มตาม dimension
- design maturity scorecard 5 dimensions
- สรุป design issues และ design wins
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน design review จากมุมมอง UX/UI designer ที่จำลองจาก source code
- ตาราง findings มี Severity, Dimension, Location, Issue, Design Impact, Recommendation
- design maturity scorecard: 5 dimensions, score 1-5
- ครอบคลุม 25 dimensions ครบ 5 หมวด (design system, visual, interaction, accessibility, handoff)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`