# Forms Review

## Goal

ตรวจ form จากมุม stakeholder — โฟกัส completion rate และ error recovery

## Checklist

- ทุก field มี label ที่เห็นได้ตลอด (ไม่ใช่แค่ placeholder)
- Required/optional บอกชัดเจน
- Validation แสดง inline หลัง blur หรือ submit ไม่ใช่ทุก keystroke
- Error message อยู่ใกล้ field ที่ผิดและบอกวิธีแก้
- Tab order ถูกต้องตามลำดับ visual
- Submit button บอก action ชัด ("Create account" ไม่ใช่ "Submit")
- Form ยาวแบ่งเป็น steps พร้อม progress indicator
- Autocomplete attributes ถูกต้องเพื่อให้ browser ช่วยกรอก
- Submit แล้วป้องกัน double-submit

## Common Issues

- Placeholder หายไปเมื่อกรอกแล้ว user ลืมว่า field คืออะไร
- Error แสดงที่บนสุดของฟอร์มแต่ field อยู่ล่าง
- Password requirements แจ้งหลัง submit แทนที่จะแสดงก่อน
