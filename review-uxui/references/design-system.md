# Design System Checks

## Goal

ตรวจสอบ design tokens, component library, design system compliance, และ theme support

## Checks

### Design Tokens

1. มี design tokens ไหม (color, spacing, typography, radius, shadow, z-index)
2. tokens เป็น semantic (e.g. `color.surface.primary`) หรือ raw (e.g. `#ffffff`)
3. token architecture แยก raw จาก semantic ไหม
4. tokens ครบทุก category ที่จำเป็นไหม
5. tokens อยู่ในที่เดียว หรือกระจายหลายไฟล์

### Token Usage

1. ใช้ tokens สม่ำเสมอไหม ไม่มี hardcoded values
2. มี magic numbers ไหม (e.g. `margin-top: 13px`)
3. มี inline styles ที่ bypass token system ไหม
4. ใช้ raw values แทน semantic tokens ไหม
5. มี token override ที่ไม่จำเป็นไหม

### Component Library

1. มี reusable components ไหม
2. components composable ไหม (compound components, slots)
3. variant system ชัดไหม (CVA, variants prop)
4. components มี consistent API ไหม
5. มี component documentation ไหม (Storybook, docs)

### Design System Compliance

1. components ใช้ design system จริงไหม
2. มี one-off styles ที่ไม่ผ่าน design system ไหม
3. มี duplicate components ที่ทำฟังก์ชันเดียวกันไหม
4. มี component ที่ bypass design system ไหม
5. มี style overrides ที่ทำลาย design system ไหม

### Theme Support

1. มี dark mode ไหม
2. มี theming system ไหม (CSS variables, token switching)
3. theme switching ทำงานได้ไหม
4. มี theme tokens ครบไหม
5. มี prefers-color-scheme support ไหม

## Severity

- Critical: ไม่มี design tokens เลย, ไม่มี component library, hardcoded values ทั่วทั้ง project, no theme support บน production
- High: token ไม่ครบ, inconsistent token usage, missing dark mode, one-off styles กระจาย, no component documentation
- Medium: raw tokens แทน semantic, minor token gaps, inconsistent variant system, missing theme tokens
- Low: token naming convention, minor documentation gap, cosmetic token issue
