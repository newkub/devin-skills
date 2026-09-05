# Theme Review

## Goal

ตรวจ theme จากมุม stakeholder — โฟกัส color, contrast และ dark/light consistency

## Checklist

- Contrast ratio ผ่าน WCAG AA (4.5:1 สำหรับ text, 3:1 สำหรับ large text/UI)
- Dark/light mode ครอบคลุมทุก component ไม่มีจุดที่ลืม
- Semantic colors (success, warning, error, info) สม่ำเสมอทั้ง app
- Brand color ใช้จงใจ ไม่กระจายจนหมดความหมาย
- Focus ring เห็นชัดบนทั้งสอง theme
- Images/icons ปรับตาม theme (logo สีเข้มบนพื้นเข้ม)
- Theme toggle เข้าถึงง่ายและจำ preference
- สีไม่ใช่สื่อเดียวในการสื่อความหมาย (มี icon/label ประกอบ)

## Common Issues

- Dark mode ทำให้ shadow/border หาย
- Accent color contrast ไม่ผ่านบน background ใหม่
- Theme flash ตอนโหลดหน้า (FOUC ของ theme)
