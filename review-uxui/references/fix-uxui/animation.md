# Animation Review

## Goal

ตรวจ motion จากมุม stakeholder — โฟกัสว่า animation ช่วยความเข้าใจ ไม่ใช่แค่ตกแต่ง

## Checklist

- Animation มีจุดประสงค์: บอก state change, guide attention, หรือ feedback
- Duration อยู่ในช่วง 150-400ms สำหรับ micro-interactions
- Easing เป็นธรรมชาติ (ease-out สำหรับเข้า, ease-in สำหรับออก)
- เคารพ `prefers-reduced-motion`
- ไม่มี animation ที่บังคับ user รอก่อนทำงานต่อได้
- Layout shift ไม่เกิดจาก animation
- Stagger/sequence ใช้เพื่อแสดงลำดับความสัมพันธ์
- Animation loop ไม่รบกวน (autoplay video, marquee)

## Common Issues

- Animation ช้าเกินทำให้ UI รู้สึกหน่วง
- Hover animation ไม่มีบน touch devices แต่ไม่มี fallback
- Motion ขัดกับ brand tone
