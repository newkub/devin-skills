# Design-Dev Handoff Checks

## Goal

ตรวจสอบ design specs in code, responsive implementation, cross-browser, และ design documentation

## Checks

### Design Specs In Code

1. code สะท้อน design specs ไหม (Figma, Sketch)
2. มี design debt ไหม (code ต่างจาก design)
3. มี drift ไหม (design เปลี่ยน code ไม่ตาม)
4. spacing, color, typography ตรง design ไหม
5. มี design review process ไหม

### Responsive Implementation

1. ทำ responsive ครบไหม (mobile, tablet, desktop)
2. มี breakpoints ที่ไม่ครบ ไหม
3. มี overflow ไหม (content ล้น container)
4. มี horizontal scroll ที่ไม่จำเป็นไหม
5. ใช้ mobile-first approach ไหม

### Cross-Browser

1. มี vendor prefixes ที่จำเป็นไหม
2. มี fallbacks สำหรับ modern CSS ไหม
3. มี browser-specific hacks ไหม
4. ทดสอบบน target browsers ไหม
5. มี browser support config ไหม (browserslist)

### Design Documentation

1. design tokens documented ไหม
2. component docs ครบไหม (props, variants, examples)
3. มี Storybook ไหม
4. มี design system docs ไหม
5. มี changelog สำหรับ design changes ไหม

## Severity

- Critical: design กับ code ต่างกันมาก, responsive พังบน breakpoint หลัก, broken บน target browser, no design documentation
- High: significant design drift, missing responsive breakpoints, missing component docs, missing fallbacks
- Medium: minor design drift, incomplete responsive, missing Storybook, minor cross-browser issue
- Low: minor documentation gap, cosmetic responsive issue, minor design debt
