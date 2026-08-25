# Visual Design Checks

## Goal

ตรวจสอบ color usage, typography, spacing, layout, visual hierarchy, และ iconography

## Checks

### Color Usage

1. palette สม่ำเสมอไหม ใช้ token colors ไหม
2. contrast พอไหม (WCAG AA: text ≥ 4.5:1, large text ≥ 3:1)
3. semantic colors ใช้ถูกไหม (success, warning, error, info)
4. มี color spam ไหม (ใช้สีเยอะเกินจำเป็น)
5. มี color ที่ไม่อยู่ใน palette ไหม

### Typography

1. type scale ชัดไหม (e.g. 12, 14, 16, 20, 24, 32)
2. hierarchy ชัดไหม (heading, body, caption)
3. line-height พอไหม (1.4-1.6 สำหรับ body)
4. font loading ดีไหม (font-display, preload, fallback)
5. มี font ที่ไม่อยู่ใน type system ไหม

### Spacing

1. spacing scale สม่ำเสมอไหม (e.g. 4, 8, 12, 16, 24, 32)
2. มี arbitrary spacing ไหม (e.g. `margin: 13px`)
3. rhythm สม่ำเสมอไหม
4. ใช้ spacing tokens ไหม
5. มี spacing ที่ไม่อยู่ใน scale ไหม

### Layout

1. grid system ชัดไหม (CSS grid, flexbox)
2. alignment สม่ำเสมอไหม
3. responsive breakpoints ดีไหม (mobile-first)
4. container/max-width ใช้ถูกไหม
5. มี layout ที่ไม่ตรง grid ไหม

### Visual Hierarchy

1. สามารถบอกได้ไหมว่าอะไรสำคัญกว่า
2. มี visual noise ไหม (elements เยอะเกิน)
3. focal point ชัดไหม
4. importance ordering ชัดไหม (size, weight, color)
5. มี competing focal points ไหม

### Iconography

1. icons สม่ำเสมอไหม (same set, same style)
2. มี mixed icon sets ไหม
3. size สม่ำเสมอไหม
4. semantic ไหม (icon สื่อความหมายถูก)
5. มี alt text หรือ aria-label สำหรับ icon-only ไหม

## Severity

- Critical: contrast < 3:1 บน text, color สื่อความหมายผิด, ใช้ไม่ได้จริง, no type hierarchy
- High: inconsistent palette, broken type hierarchy, arbitrary spacing กระจาย, no grid system, mixed icon sets
- Medium: minor contrast issues, inconsistent spacing, missing focal point, icon size inconsistency
- Low: polish ไม่พอ, minor icon issue, documentation gap
