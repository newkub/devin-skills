# CSS And Styling Checks

## Goal

ตรวจสอบ styling approach, CSS organization, specificity, responsive CSS, และ CSS performance

## Checks

### Styling Approach

1. ใช้ styling approach ที่ consistent ไหม (CSS modules, Tailwind, UnoCSS, styled-components)
2. มี mixed styling approaches ไหม
3. styling approach เหมาะสมกับ project ไหม
4. มี migration path ถ้าเปลี่ยน approach ไหม
5. มี styling conventions ไหม

### CSS Organization

1. CSS file structure สม่ำเสมอไหม
2. มี naming convention ไหม (BEM, utility-first, CSS modules)
3. CSS จัดกลุ่มตาม component ไหม
4. มี global CSS ที่ควรเป็น scoped ไหม
5. มี dead CSS ไหม

### CSS Specificity

1. มี `!important` ไหม — ระบุ location และ reason
2. มี deep selectors ไหม (`:deep()`, `>>>`, `/deep/`)
3. มี specificity wars ไหม (competing selectors)
4. มี inline styles ที่ bypass CSS system ไหม
5. specificity สม่ำเสมอไหม

### Responsive CSS

1. ใช้ media queries ที่เหมาะสมไหม
2. ใช้ container queries ไหม (modern CSS)
3. ใช้ mobile-first approach ไหม
4. มี breakpoints ที่ครบถ้วนไหม
5. มี responsive ที่ broken บน breakpoint ใดไหม

### CSS Performance

1. มี unused CSS ไหม
2. มี duplicate styles ไหม
3. CSS bundle size อยู่ในเกณฑ์ไหม (< 50KB)
4. มี CSS ที่ block render ไหม
5. ใช้ CSS containment ไหม (`contain`, `content-visibility`)

## Severity

- Critical: `!important` ทั่วทั้ง project, global CSS ที่ leak, broken responsive บน breakpoint หลัก, no styling convention
- High: specificity wars, inconsistent styling approach, unused CSS มาก, missing responsive, large CSS bundle
- Medium: minor specificity issue, inconsistent naming, minor unused CSS, missing container queries
- Low: minor naming, documentation gap, cosmetic CSS issue
