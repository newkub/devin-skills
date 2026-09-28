---
name: review-accessibility
description: ตรวจ accessibility ตาม WCAG — semantics, keyboard, ARIA, contrast, screen reader
argument-hint: "[url-or-route-or-component]"
related:
  - review-uxui
  - follow-tool-lighthouse
  - run-test
  - capture
  - use-agent-browser
  - report
  - deep-review
  - run-review
---

## Goal

ตรวจ accessibility ของ web pages/components ตามมาตรฐาน WCAG — semantics, keyboard navigation, ARIA, color contrast และ screen reader support

## Scope

ใช้กับ web apps, pages หรือ components ที่ต้องตรวจ a11y แยกจาก UX/UI ทั่วไป — ครอบคลุม WCAG 2.2 Level A/AA: perceivable, operable, understandable, robust — ไม่แก้ไข code (แก้ไขตาม section `## Fix`)

## Execute

### 1. Prepare Target

> Goal: เปิด target พร้อม audit tools

1. เปิด dev server หรือใช้ deployed URL ตาม argument
2. ใช้ `/run-test` (e2e) เพื่อเปิด page ด้วย `agent-browser`
3. ถ้าเป็น component เดี่ยว → เปิด storybook หรือ route ที่ render component นั้น

### 2. Run Automated Audit

> Goal: ได้ violations จาก automated checks

1. รัน axe/pa11y หรือ `agent-browser` accessibility audit ตามที่มี
2. บันทึก violations พร้อม selector, rule และ severity (critical/serious/moderate/minor)
3. ตรวจ automated coverage: ไม่เกิน ~40% ของ WCAG — เตรียม manual checks ต่อ

### 3. Check Semantics And Structure

> Goal: HTML สื่อความหมายถูกต้อง — ทำตาม `references/semantics.md`

1. ตรวจ landmark regions (`header`, `nav`, `main`, `footer`) และ heading hierarchy `h1`-`h6`
2. ตรวจ interactive elements ใช้ semantic tags (`button`, `a`, `input`) ไม่ใช่ `div`+click
3. ตรวจ alt text, form labels และ table headers

### 4. Check Keyboard And Focus

> Goal: ใช้งานได้ครบด้วย keyboard เท่านั้น — ทำตาม `references/keyboard-focus.md`

1. กด `Tab` ผ่าน interactive elements ทั้งหมด — ตรวจ focus order และ visible focus indicator
2. ทดสอบ `Enter`/`Space`/`Escape`/`Arrow keys` บน interactive patterns (menus, dialogs, tabs)
3. ตรวจ focus traps ใน modals และ skip links

### 5. Check Visual And ARIA

> Goal: perceivable สำหรับทุกผู้ใช้ — ทำตาม `references/visual-aria.md`

1. ตรวจ color contrast ขั้นต่ำ 4.5:1 (text) และ 3:1 (UI components, large text)
2. ตรวจ ARIA attributes — ใช้เฉพาะเมื่อ semantic HTML ไม่พอ ตรวจ `aria-label`, `role`, `aria-live`
3. ตรวจ motion/animation เคารพ `prefers-reduced-motion` และไม่มี auto-play ที่ควบคุมไม่ได้

### 6. Check Forms And Errors

> Goal: form accessibility ครบ — ทำตาม `references/forms-errors.md`

1. labels — ทุก input มี `<label>`/`aria-label`/`aria-labelledby`, error messages เชื่อม `aria-describedby`
2. validation — errors announced ให้ screen reader, focus ไปที่ error/summary
3. required/disabled — `required` + `aria-required`, disabled state สื่อชัด
4. autocomplete — `autocomplete` attributes ตาม purpose (name, email, address)

### 7. Check Media And Motion

> Goal: media perceivable ทุกคน — ทำตาม `references/media.md`

1. images — meaningful alt, decorative `alt=""`, complex images longdesc/caption
2. video/audio — captions, transcripts, audio descriptions, no auto-play sound
3. motion — `prefers-reduced-motion` respected, no flashing >3/sec, parallax optional
4. carousels/sliders — pause/stop controls, keyboard operable, announce changes

### 8. Check Screen Reader And Cognitive

> Goal: usable ผ่าน AT และเข้าใจง่าย — ทำตาม `references/screenreader-cognitive.md`

1. screen reader flow — landmark nav, headings, live regions announce dynamic changes
2. language — `<html lang>` set, `lang` on foreign phrases
3. timeouts — extend/disable session timeouts, warning before expire
4. plain language — error messages actionable, jargon minimized
5. cognitive load — consistent navigation, predictable behavior, no surprises

### 9. Check Touch And Mobile

> Goal: usable บน touch devices — ทำตาม `references/mobile.md`

1. touch targets — ≥44×44px, spacing adequate
2. zoom — no `user-scalable=no`, pinch-zoom works
3. orientation — both portrait/landscape usable
4. gestures — alternatives for complex gestures (swipe, multi-touch)

### 10. Rate And Report

> Goal: สรุป findings พร้อม severity และ remediation path

1. จัดกลุ่ม findings ตาม WCAG principle และ severity
2. ทำ `/report` พร้อม columns: No., Rule, Severity, Element, Evidence, Fix
3. ชี้ไป section `## Fix` สำหรับการแก้ไข

### Subskills

> Goal: dispatch งาน fix ไปยัง subskill เมื่อ user confirm ให้แก้ findings

| Topic | Subskill |
|-------|----------|
| Apply a11y findings — contrast, aria, keyboard, focus, screen reader | `subskills/improve-a11y/SKILL.md` |
| `wcag`, `audit` — WCAG-organized sweep per criterion | `subskills/check-wcag/SKILL.md` |

## Rules

### 1. Evidence Based

- ทุก finding ต้องมี element/selector และ WCAG criterion อ้างอิง
- แยก automated findings กับ manual findings ชัดเจน

### 2. Real Interaction

- keyboard checks ต้องทำจริงผ่าน browser ไม่เดาจาก code
- ตรวจกับหลาย states: default, focus, error, loading, empty

### 3. No Fixes During Review

- ไม่แก้ไข code ระหว่าง review — ส่งต่อไปยัง section `## Fix`
- ใช้ `/deep-review` ถ้าต้องการวิเคราะห์เชิงลึกเพิ่ม

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /capture ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ findings ผ่าน `subskills/improve-a11y/SKILL.md` — semantics, ARIA, keyboard, focus, contrast ตาม WCAG (accessibility)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](references/checklist.md)
- [Semantics checklist](references/semantics.md)
- [Keyboard and focus checklist](references/keyboard-focus.md)
- [Visual and ARIA checklist](references/visual-aria.md)
- [Forms and errors checklist](references/forms-errors.md)
- [Media checklist](references/media.md)
- [Screen reader and cognitive checklist](references/screenreader-cognitive.md)
- [Mobile checklist](references/mobile.md)
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงาน a11y findings พร้อม WCAG rule, severity, element และ evidence
- ครอบคลุม semantics, keyboard, ARIA, contrast, motion
- ระบุ coverage ของ automated vs manual checks
- next action ชัดเจนผ่าน section `## Fix`
