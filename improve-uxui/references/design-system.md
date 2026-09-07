# Design System Review

## Goal

ตรวจ design system consistency จากมุม stakeholder — โฟกัส predictability และ polish

## Checklist

- Spacing ใช้ scale เดียวกัน (เช่น 4/8px base) ไม่มีค่า ad-hoc
- Component variants (primary, secondary, ghost) ใช้สม่ำเสมอ
- Border radius, shadow, elevation เป็นระบบเดียวกัน
- Icon set ชุดเดียวกัน ขนาดและ stroke สม่ำเสมอ
- Button sizes มี hierarchy ชัด (sm/md/lg ใช้ตาม context เดิม)
- ไม่มี one-off component ที่ควรใช้ของเดิม
- Tokens (colors, spacing, typography) map จาก design system ไม่ใช่ hardcode
- Component states ครบ: default, hover, active, disabled, loading

## Common Issues

- Component 2 ตัวทำหน้าที่เดียวกันแต่หน้าตาต่างกัน
- Hardcode hex/spacing โดยตรงแทน token
- Focus state ตกหล่นในบาง component
