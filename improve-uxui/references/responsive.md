# Responsive Review

## Goal

ตรวจ responsive behavior จากมุม stakeholder — โฟกัสว่าใช้งานได้จริงทุกขนาดจอ

## Checklist

- ใช้งานได้ครบบน mobile (375px), tablet (768px), desktop (1280px+)
- Touch targets อย่างน้อย 44x44px บน mobile
- ไม่มี horizontal scroll ที่ไม่ตั้งใจ
- Sticky elements ไม่บัง content บนจอเล็ก
- Table กว้างมี scroll, card view, หรือ column priority
- Modal/dropdown ไม่ล้นจอและปิดได้ง่าย
- Images มี responsive sizing ไม่มีภาพใหญ่โหลดช้าบน mobile
- Landscape orientation ยังใช้งานได้

## Common Issues

- Hover-only interactions หายไปบน touch
- Content ซ่อนหลัง keyboard บน mobile
- Fixed header กินพื้นที่จอเล็กเกินไป
