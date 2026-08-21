---
name: follow-design-system
description: Design system principles พื้นฐานที่ใช้ได้กับทุก platform (TUI, Web, Desktop,
  Mobile)
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

ใช้ design system principles ที่ universal ใช้ได้กับทุก platform เพื่อ consistency และ maintainability

## Scope

ครอบคลุม design tokens, component guidelines, และ platform-specific adaptations สำหรับ TUI, Web, Desktop, และ Mobile

## Execute

### 1. Define Design Tokens

1. กำหนด visual tokens: colors, typography, spacing, shadows, borders
2. กำหนด interaction tokens: transitions, animations, cursors
3. กำหนด language tokens: terminology, tone of voice, iconography
4. ถ้า project ใช้ UnoCSS ทำ `/follow-unocss-theme` สำหรับ HSL theme variables

### 2. Create Component Guidelines

1. สร้าง reusable components ด้วย atomic design (atoms → molecules → organisms)
2. ใช้ design tokens สำหรับทุก component
3. Document ทุก component และ pattern
4. กำหนด component variants (sizes, states, colors)

### 3. Apply To Platforms

1. แปลง tokens ตาม platform constraints (ดูตารางด้านล่าง)
2. ถ้า project เป็น web ทำ `/follow-web-design` สำหรับ web-specific guidelines
3. ถ้า project มี mobile ทำ `/review-codebase`
4. ถ้า project มี TUI ทำ `/review-codebase`

### 4. Ensure Accessibility

1. ทำตาม WCAG guidelines สำหรับทุก platform
2. รองรับ keyboard navigation
3. รองรับ screen readers
4. ตรวจสอบ color contrast ratio

### 5. Test And Validate

1. ทดสอบ visual consistency ทุก platform
2. ทดสอบ component reusability
3. ทดสอบ accessibility compliance
4. ทดสอบ responsive behavior

## Rules

### 1. Consistency

- Visual consistency: colors, typography, spacing สม่ำเสมอ
- Interaction consistency: patterns ซ้ำๆ ใช้วิธีเดียวกัน
- Language consistency: terminology, tone of voice สม่ำเสมอ

### 2. Scalability

- Component-based: สร้าง reusable components
- Token-based: ใช้ design tokens (colors, spacing, etc.)
- Documentation: document ทุก component และ pattern

### 3. Accessibility

- WCAG compliance: ทำตามมาตรฐาน accessibility
- Keyboard navigation: รองรับ keyboard
- Screen reader support: รองรับ screen readers
- Color contrast: contrast ratio ถูกต้อง

### 4. Platform Adaptations

| Platform | Color Palette | Spacing | Typography | Layout |
|----------|--------------|---------|------------|--------|
| TUI | 16 colors | character spacing | monospace only | grid-based |
| Web | full RGB | rem/em units | web fonts | flexbox, grid |
| Desktop | full RGB | platform units | system fonts | native layouts |
| Mobile | full RGB | touch-friendly | system fonts | responsive |

### 5. Naming Conventions

- PascalCase สำหรับ components
- camelCase สำหรับ props และ variables
- kebab-case สำหรับ CSS classes
- UPPER_SNAKE_CASE สำหรับ constants

## Expected Outcome

- Design tokens ที่สม่ำเสมอ
- Component library ที่ reusable
- Documentation ครบถ้วน
- Cross-platform consistency
- Accessibility compliance

## Common Mistakes

- ไม่กำหนด design tokens ก่อนสร้าง components
- สร้าง components โดยไม่ document
- ไม่ test accessibility
- ไม่พิจารณา platform differences

## References

- [Design Systems](https://www.designsystems.com/)
- [Atomic Design](http://atomicdesign.bradfrost.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
