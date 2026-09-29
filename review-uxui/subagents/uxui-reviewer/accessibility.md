# Accessibility Checks

## Goal

ตรวจสอบ accessibility ตาม WCAG 2.1 — semantic HTML, ARIA, keyboard navigation, color contrast, screen reader

## Checks

### Semantic HTML

1. ใช้ semantic tags ไหม (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`)
2. มี div soup ไหม (div แทน semantic tags)
3. heading hierarchy ถูกไหม (h1 → h2 → h3, no skip)
4. ใช้ `button` สำหรับ action และ `a` สำหรับ navigation ไหม
5. ใช้ `ul`/`ol` สำหรับ list ไหม

### ARIA

1. มี ARIA labels สำหรับ icon-only และ non-text elements ไหม
2. ใช้ ARIA ถูกไหม (`aria-label`, `aria-describedby`, `aria-live`)
3. มี over-ARIA ไหม (ARIA ที่ไม่จำเป็น)
4. มี live regions สำหรับ dynamic content ไหม
5. ใช้ ARIA roles ถูกไหม

### Keyboard Navigation

1. ใช้งานด้วย keyboard ได้ไหม (Tab, Shift+Tab, Enter, Space, Escape)
2. tab order สมเหตุสมผลไหม (visual order = DOM order)
3. มี focus indicators ไหม (visible focus ring)
4. มี focus traps ไหม (modal, drawer)
5. มี skip link ไหม (skip to main content)

### Color Contrast

1. text contrast ≥ 4.5:1 (WCAG AA normal text)
2. large text contrast ≥ 3:1 (WCAG AA large text ≥ 18pt)
3. non-text contrast ≥ 3:1 (UI components, graphics)
4. ไม่ใช้สีเพียงอย่างเดียวสื่อความหมาย
5. มี high contrast mode support ไหม

### Screen Reader

1. ใช้งานด้วย screen reader ได้ไหม
2. มี alt text สำหรับ images ไหม
3. มี aria-hidden ที่ไม่จำเป็นไหม (ซ่อนจาก screen reader ผิด)
4. form labels เชื่อมโยงกับ inputs ไหม
5. มี descriptive link text ไหม (not "click here")

### Automated Audit

1. รัน axe-core audit ถ้ามี
2. รัน Lighthouse accessibility audit ถ้ามี
3. รัน pa11y ถ้ามี
4. จับ findings จาก automated tools
5. กรอง false positives จาก automated tools

## Severity

- Critical: no keyboard access, no alt text บน critical images, contrast < 3:1, no focus indicators, no form labels
- High: missing ARIA labels, broken heading hierarchy, missing skip link, contrast < 4.5:1, no live regions
- Medium: over-ARIA, minor tab order issue, missing high contrast mode, minor semantic HTML issue
- Low: minor ARIA improvement, documentation gap, cosmetic accessibility issue
