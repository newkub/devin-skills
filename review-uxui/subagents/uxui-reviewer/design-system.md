# Design System Checks

## Goal

ตรวจสอบ design tokens, component library, design system compliance, และ theme support — ประเมินเทียบกับ design system principles ด้านล่าง

## Design System Principles

หลักการที่ใช้เป็นเกณฑ์ประเมิน — ทุก check ด้านล่าง map กลับมาที่หลักการเหล่านี้:

1. **Single source of truth** — design decisions (color, spacing, type) อยู่ในที่เดียว (tokens/theme config) ไม่ซ้ำหลายจุด — แก้ที่เดียวแล้วกระทบทั้งระบบ
2. **Semantic over raw** — ใช้ semantic tokens (`bg-primary`, `surface`) แทน raw values (`#fff`, `blue-500`) — ให้ intent ชัดและรองรับ theming
3. **Consistency** — pattern เดียวกันต้องดูและทำงานเหมือนกันทุกจุด — spacing scale, radius, typography ไม่ deviate โดยไม่มีเหตุผล
4. **Composability** — system ประกอบจาก primitives เล็กๆ ที่ compose ได้ (tokens → utilities → components) ไม่ใช่ one-off monolith
5. **Theme-ability** — design แยกจากค่าสี/ค่าจริงผ่าน token layer — สลับ theme (dark/light/brand) ได้โดยไม่แตะ component
6. **Scalability** — เพิ่ม color/component/page ใหม่โดยไม่ต้องแก้ระบบเดิม — token structure และ variant system รองรับการขยาย
7. **Constraint by default** — system บังคับค่าที่ถูกต้อง (scale เท่านั้น) แทนปล่อยให้เลือกอิสระ — ลด inconsistency ตั้งแต่ต้น

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
