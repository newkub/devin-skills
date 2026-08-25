---
name: accessibility
description: Accessibility review ตามมาตรฐาน WCAG 2.1 AA/AAA
---

## Goal

Review accessibility ตามมาตรฐาน WCAG 2.1 ครอบคลุม keyboard navigation, screen reader, color contrast, forms, media และ automated testing

## WCAG Compliance Levels

| Level | Description | Use Case |
|---|---|---|
| A | ขั้นต่ำ พื้นฐาน | ไม่แนะนำ ใช้เป็น baseline เท่านั้น |
| AA | มาตรฐานหลัก | ใช้สำหรับทุก project |
| AAA | สูงสุด | critical applications, government, healthcare |

## Review Checklist

### 1. Keyboard Navigation

1. ทดสอบ navigation ด้วย keyboard เท่านั้น — Tab, Shift+Tab, Enter, Space, Escape, Arrow keys
2. ตรวจ tab order ตาม visual order — ไม่ข้ามหรือย้อนสับสน
3. ตรวจ focus indicators ชัดเจน — visible focus ring, ไม่ `outline: none` โดยไม่มี alternative
4. ตรวจ keyboard shortcuts — ไม่ขัดแย้งกับ browser/OS shortcuts, มี documentation
5. ตรวจ skip-to-content link — มีและทำงานได้

### 2. Screen Reader

1. ทดสอบด้วย screen reader (NVDA, JAWS, VoiceOver)
2. ตรวจ ARIA labels และ roles — ใช้ถูกประเภท, ไม่ overuse
3. ตรวจ alt text สำหรับ images — มีและสื่อความหมาย
4. ตรวจ semantic HTML — ใช้ `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`, `<a>` ถูกต้อง
5. ตรวจ heading hierarchy — ไม่ข้าม level, มีเพียงหนึ่ง `<h1>`
6. ตรวจ live regions — ใช้ `aria-live` สำหรับ dynamic content updates

### 3. Color Contrast

1. ตรวจ contrast ratio ตาม WCAG:
   - AA: text ≥ 4.5:1, large text ≥ 3:1, UI components ≥ 3:1
   - AAA: text ≥ 7:1, large text ≥ 4.5:1
2. ใช้ tools: axe DevTools, Lighthouse, WebAIM Contrast Checker
3. ตรวจว่าไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย — มี icon, text, หรือ pattern เสริม
4. ตรวจ text กับ background contrast — รวม disabled, placeholder, error states

### 4. Forms

1. ตรวจ form labels — ทุก input มี `<label>` หรือ `aria-label`
2. ตรวจ error messages — ใช้ `aria-describedby`, `role="alert"` สำหรับ errors
3. ตรวจ validation messages — ประกาศผ่าน screen reader, ไม่ใช้ color เพียงอย่างเดียว
4. ตรวจ form controls — ใช้ keyboard ได้ครบ, ไม่ trap focus
5. ตรวจ required field indicators — มี `aria-required` หรือ `required` attribute

### 5. Media

1. ตรวจ captions สำหรับ videos — มีและถูกต้อง
2. ตรวจ audio descriptions — มีสำหรับ video ที่มี visual-only information
3. ตรวจ autoplay — ไม่รบกวน, มี controls หยุดได้
4. ตรวจ media controls — ใช้ keyboard ได้, มี ARIA labels

### 6. Automated Testing

1. รัน accessibility audit tools — axe Core, Lighthouse, pa11y
2. ตรวจ automated violations — ระบุและจัดลำดับ
3. ทำ manual testing สำหรับสิ่งที่ automated ไม่ตรวจได้ — keyboard, screen reader, cognitive
4. ตรวจ with zoom tools — ยืนยันใช้งานได้ที่ 200% zoom
5. ตรวจ with color blindness simulators — ยืนยันไม่พึ่งสีเพียงอย่างเดียว

## Severity Classification

- Critical: ขัดขวางการใช้งานอย่างสิ้นเชิง — no keyboard access, no alt text บน critical images, contrast < 3:1
- High: ทำให้ใช้งานยากอย่างมาก — missing labels, broken heading hierarchy, no focus indicators
- Medium: ทำให้ใช้งานยากเล็กน้อย — missing skip link, incomplete ARIA, contrast 3:1-4.5:1
- Low: best practices — missing `lang` attribute, minor semantic improvements

## Tools

- `axe DevTools` — browser extension สำหรับ automated audit
- `Lighthouse` — built-in accessibility audit
- `pa11y` — CLI accessibility testing
- `NVDA` — free screen reader (Windows)
- `VoiceOver` — built-in screen reader (macOS)
- `WebAIM Contrast Checker` — color contrast verification

## Expected Outcome

- Accessibility ผ่าน WCAG AA ขั้นต่ำ
- Keyboard navigation ทำงานได้ครบ
- Screen reader อ่านเนื้อหาได้ถูกต้อง
- Color contrast ผ่านมาตรฐาน
- Forms ใช้งานได้โดยทุกคน
- ระบุ violations พร้อม severity และ remediation steps
