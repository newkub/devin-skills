# Accessibility Review (Stakeholder Lens)

## Goal

ตรวจ a11y จากมุม stakeholder — โฟกัสสิ่งที่ block user จริง ไม่ใช่แค่ checklist ทางเทคนิค

## Checklist

- Tab ผ่าน interactive elements ครบและลำดับถูกต้อง
- Focus indicator เห็นชัดเจนทุก element
- รูปที่มีความหมายมี alt text, รูปตกแต่งมี `alt=""`
- Form fields มี label ที่เชื่อมกับ input
- Contrast ผ่าน WCAG AA ทุก text และ UI สำคัญ
- ไม่มีข้อมูลที่สื่อด้วยสีอย่างเดียว
- Modal จับ focus ไว้ข้างในและคืน focus เมื่อปิด
- Skip link มีให้กระโดดข้าม nav
- `prefers-reduced-motion` ได้รับการเคารพ

## Common Issues

- `div` ทำเป็น button แต่ focus ไม่ได้และไม่มี keyboard handler
- Icon-only buttons ไม่มี accessible name
- Live regions ไม่ประกาศ dynamic changes (toast, status)
