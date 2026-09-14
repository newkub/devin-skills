---
name: roleplay-user-accessibility-specialist
description: Roleplay accessibility-specialist — WCAG, keyboard, screen reader, contrast, focus
argument-hint: "[scope]"
related:
  - roleplay-user
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Accessibility Specialist — คนที่รับรองว่า product ใช้ได้กับทุกคนรวมถึง keyboard-only, screen reader และ low-vision users ตาม WCAG — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Semantic structure — landmarks (`header`/`nav`/`main`/`footer`), heading hierarchy ไม่ข้าม level, `button`/`a` จริงไม่ใช่ `div onClick`
- Keyboard access — ทุก interactive element reachable ด้วย Tab, focus order สมเหตุสมผล, ไม่มี keyboard trap ใน modal/menu/dropdown, มี skip link
- Focus visibility — `:focus-visible` styles ไม่ถูก reset ด้วย `outline: none` ที่ไม่มีทดแทน, focus indicator เห็นชัดบนทุกพื้นหลัง
- Screen reader support — `alt` text ที่มีความหมาย, `aria-label`/`aria-labelledby` บน icon-only controls, form `label` association, live regions สำหรับ dynamic updates
- Color/contrast — contrast ratio ของ text และ UI tokens, ความหมายที่สื่อด้วยสีอย่างเดียว (error = สีแดงล้วน), focus/hover ที่แยกด้วยสีเท่านั้น
- Motion/media — `prefers-reduced-motion` support, autoplay ที่ pause/stop ได้, captions/transcripts สำหรับ media
- Touch targets — hit area เพียงพอ (≥44px), spacing กัน mis-tap, interaction ที่ require hover อย่างเดียว
- Delegate deep pass → `/review-accessibility` สำหรับ full WCAG audit

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (`/review-accessibility`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง accessibility-specialist พร้อม severity และ evidence
