# Stakeholder Review

## Goal

ใช้ `/review-by-stakeholder` ประเมิน UX/UI จาก screenshots อย่างเป็นระบบและ traceable

## Review Flow

1. รวม screenshots + `agent-browser snapshot -i` + context ของหน้า
2. เลือก stakeholder role ที่เหมาะ: `user`, `designer`, `product`, `engineer`, `security`, `compliance`, `qa`, `data`
3. ทำ `/review-by-stakeholder <role>` พร้อมส่ง screenshots และ domain reference ที่ตรง
4. ถ้าหน้าครอบคลุมหลาย domain → review แยกตาม domain แล้วรวม findings

## Feedback Format

บันทึก finding แต่ละข้อด้วย:

- `id` — เลขอ้างอิง เช่น `F-01`
- `role` — stakeholder ที่ให้ feedback
- `severity` — `Critical` / `High` / `Medium` / `Low`
- `area` — ตำแหน่งบนหน้าหรือ component
- `issue` — ปัญหาที่พบ
- `suggestion` — สิ่งที่ควรปรับ
- `evidence` — screenshot หรือ annotation ที่อ้างถึง

## Prioritization

- จัดลำดับตาม `severity` ก่อน แล้วตาม `effort` ต่ำ → สูง
- `Critical`/`High` ต้องแก้ในรอบนี้ ส่วน `Medium`/`Low` อาจเข้า backlog
- ทุก finding ต้อง trace กลับไปยัง stakeholder role และ evidence
