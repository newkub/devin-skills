# MVP Scope Validation Checks

## Goal

ตรวจ MVP scope ก่อน `implement-features-to-mvp`

## Checks

### MVP Definition

1. ตรวจมี MVP checklist ที่ชัดเจน
2. ตรวจมี core value proposition ของ product
3. ตรวจมี minimum features ที่ต้องมี
4. ตรวจมี timeframe ที่ชัดเจน

### Feature Prioritization

1. ตรวจ features แบ่งเป็น must-have, should-have, nice-to-have
2. ตรวจ must-have features มี acceptance criteria
3. ตรวจ effort-to-impact ratio สำหรับแต่ละ feature
4. ตรวจไม่มี optional features ใน MVP scope

### Scope Validation

1. ตรวจ must-have features ครบสำหรับ MVP ใช้งานได้
2. ตรวจ critical user flows ครบถ้วน
3. ตรวจ scope ไม่เกิน timeframe
4. ตรวจไม่มี over-engineering ใน MVP

### Common Mistakes

1. ไม่กำหนด MVP requirements ชัดเจน
2. ทำ optional features ใน MVP
3. Over-engineer solutions สำหรับ MVP
4. ไม่หยุดเมื่อ MVP ครบ
5. เพิ่ม features โดยไม่ประเมิน impact

## Severity

- Critical: ไม่มี MVP checklist, must-have feature ขาด, critical flow ขาด
- High: must-have ไม่มี acceptance criteria, scope เกิน timeframe, optional ใน MVP
- Medium: prioritization ไม่ชัด, effort estimate ขาด, nice-to-have ปน
- Low: formatting ไม่สม่ำเสมอ, missing notes
