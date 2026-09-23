# Component Architecture Checks

## Goal

ตรวจสอบ component composition, boundaries, reusability, API design, และ organization

## Checks

### Component Composition

1. ใช้ compound components สำหรับ related components ไหม (e.g. `Select.Trigger`, `Select.Content`)
2. ใช้ slots หรือ render props สำหรับ flexible composition ไหม
3. ใช้ children patterns ที่ composable ไหม
4. มี component ที่ composed จาก smaller components ไหม
5. มี prop drilling ที่ควรเป็น context ไหม

### Component Boundaries

1. แต่ละ component มี single responsibility ไหม
2. มี prop drilling ลึกเกินไปไหม (5+ levels)
3. components มี coupling สูงไหม
4. มี components ที่ import internal ของกันและกันไหม
5. มี circular dependency ระหว่าง components ไหม

### Component Reusability

1. components reusable ไหม หรือ one-off
2. abstraction level เหมาะสมไหม (ไม่ over-abstract, ไม่ under-abstract)
3. มี duplicate components ที่ทำฟังก์ชันเดียวกันไหม
4. components มี variant system ไหม
5. components รองรับหลาย use cases ไหม

### Component API

1. prop design ชัดเจนไหม (naming, types, defaults)
2. มี default values ที่ sensible ไหม
3. prop types ครบถ้วนไหม
4. มี variant prop ที่ type-safe ไหม
5. API consistent ระหว่าง components ไหม

### Component Organization

1. ใช้ feature-based folders ไหม
2. ใช้ atomic design ไหม (atoms, molecules, organisms, templates, pages)
3. folder structure สม่ำเสมอไหม
4. มี barrel exports สำหรับ components ไหม
5. มี component documentation ไหม

## Severity

- Critical: God component ที่ทำทุกอย่าง, prop drilling ลึก 5+ levels, broken component composition, circular dependency
- High: tight coupling ระหว่าง components, missing abstraction, inconsistent component API, no variant system, duplicate components
- Medium: minor prop drilling, inconsistent organization, missing barrel exports, over-abstracted component
- Low: naming convention, minor API improvement, documentation gap
