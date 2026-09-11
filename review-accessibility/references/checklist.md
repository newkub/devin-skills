# review-accessibility — Full Dimension Checklist (WCAG 2.2)

## 1. Perceivable

- [ ] text alternatives: alt text, aria-label, decorative images marked correctly
- [ ] media: captions, transcripts, audio descriptions
- [ ] color contrast 4.5:1 text, 3:1 large text/UI
- [ ] ไม่พึ่งสีอย่างเดียว (icons/text เสริม)
- [ ] text resize 200% ไม่พัง, reflow ที่ 320px
- [ ] content visible ทั้ง portrait/landscape

## 2. Operable

- [ ] keyboard: ทุก function ใช้ได้ด้วย keyboard, focus order สมเหตุสมผล
- [ ] visible focus indicator, no keyboard trap (ยกเว้น modal ที่ออกได้ด้วย Esc)
- [ ] skip links, landmark navigation
- [ ] timing: ไม่มี timeout ที่ extend ไม่ได้, pause/stop auto-play
- [ ] seizures: ไม่มี flash >3 ครั้ง/วินาที
- [ ] touch targets ≥24px, drag alternatives, pointer cancellation
- [ ] motion: `prefers-reduced-motion`, ไม่มี parallax บังคับ

## 3. Understandable

- [ ] `lang` attribute, language of parts
- [ ] predictable: consistent nav, no context change on focus/input
- [ ] input assistance: labels, instructions, error identification + suggestion
- [ ] error prevention: confirm/undo สำหรับ legal/financial/data actions
- [ ] reading level, abbreviations, pronunciation hints เมื่อจำเป็น

## 4. Robust

- [ ] valid HTML (no dup IDs, proper nesting)
- [ ] name/role/value ครบสำหรับ custom components
- [ ] status messages ผ่าน `aria-live`
- [ ] ARIA เฉพาะเมื่อ semantic HTML ไม่พอ — ตรวจ ARIA misuse

## 5. Screen Reader

- [ ] ทดสอบจริง NVDA/JAWS/VoiceOver ถ้าทำได้
- [ ] announcements ถูกต้องสำหรับ dynamic content, dialogs, toasts
- [ ] tables มี headers, forms มี programmatic labels

## 6. Cognitive And Mobile

- [ ] ชัดเจน, consistent, forgiving forms
- [ ] mobile: touch, orientation, gesture alternatives, zoom ไม่ถูก block

## 7. Legal And Tooling

- [ ] target level (A/AA) และ jurisdiction (ADA, EN 301 549, WCAG 2.2)
- [ ] automated coverage note (~40% max) + manual check evidence

## Scoring

- pass = 1, warning = 0.5, fail = 0 ต่อ check; grade A (90+), B (80+), C (70+), D (60+), F (<60)
