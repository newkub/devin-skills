# Best Practices Review

## Goal

ตรวจ code/project ว่าปฏิบัติตาม best practices ของ language, framework, และ project conventions

## Checklist

- โครงสร้างไฟล์และโฟลเดอร์สอดคล้องกับ project convention
- การจัดการ dependencies ไม่มี unused/dead packages
- Error handling ครอบคลุม critical paths
- Testing ครอบคลุม happy path และ edge cases
- Security practices เช่น ไม่ expose secrets, ไม่ใช้ `eval` โดยไม่จำเป็น
- Performance ไม่มี bottlenecks ที่ชัดเจน
- Maintainability: function ไม่ยาวเกิน 250 บรรทัด, nesting ไม่ลึกเกิน 3 ระดับ
- อ้างอิงจาก `AGENTS.md`, `global_rules.md`, และ official docs ก่อน generic practices

## Severity

- `Critical`: security, data loss, broken invariant
- `High`: ผลกระทบต่อ maintainability สูง
- `Medium`: ปรับปรุงได้
- `Low`: แนะนำทั่วไป

## Fix Path

- `/follow-best-practice` สำหรับ topic ทีเกี่ยวข้อง
- `/refactor` สำหรับ structure issues
- `/resolve-errors` สำหรับ bugs
