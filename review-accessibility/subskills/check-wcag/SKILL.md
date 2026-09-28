---
name: review-accessibility-check-wcag
description: Check WCAG sweep — perceivable/operable/understandable/robust ตาม criterion
argument-hint: "[url-or-route]"
related:
  - review-accessibility
  - use-agent-browser
  - run-test
  - report
---

## Goal

Run a WCAG-organized sweep ของ `/review-accessibility` แบบ focused — findings grouped ตาม WCAG principle/criterion

## Scope

- ใช้เมื่อ `/review-accessibility` dispatch มาที่ `wcag`/`audit` หรือเรียก standalone บน route
- ครอบคลุม: WCAG 2.x A/AA mechanical-detectable criteria — manual criteria (screen reader UX จริง) tag แยก

## Execute

### 1. Perceivable

> Goal: content รับรู้ได้ทุกช่องทาง

ทำตาม `../../references/visual-aria.md` + `../../references/media.md`

1. contrast 4.5:1/3:1, alt text, ไม่ใช้สีอย่างเดียวสื่อ state
2. media — captions/transcripts, `prefers-reduced-motion`

### 2. Operable

> Goal: ใช้งานได้ด้วย keyboard และไม่ก่ออันตราย

ทำตาม `../../references/keyboard-focus.md`

1. keyboard access ครบ, focus visible, no traps, skip links
2. timing/motion — ไม่มี flashing >3/s, auto-play หยุดได้

### 3. Understandable + Robust

> Goal: predictable + parse ได้ — `../../references/semantics.md`, `../../references/forms-errors.md`, `../../references/screenreader-cognitive.md`

1. lang attribute, consistent navigation, error identification
2. semantic HTML > ARIA, landmark regions, heading hierarchy
3. automated audit (axe ผ่าน `/use-agent-browser` หรือ e2e) + manual-check tags

### 4. Report

> Goal: findings grouped ตาม WCAG

ทำ `/report` ตาราง: `No.`, `Criterion`, `Level`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน `../improve-a11y/SKILL.md`
- ทุก finding map WCAG criterion + element evidence (selector/file:line)
- แยก machine-detectable vs manual-required — ห้าม claim pass บน manual criteria ที่ไม่ได้ test

## Expected Outcome

- Findings grouped per WCAG principle พร้อม criterion IDs
- แยก automated-audit results vs manual-review-needed
