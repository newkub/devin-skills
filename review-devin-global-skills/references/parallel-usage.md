# Parallel And Script Usage Check

ตรวจการใช้ parallel markers และ scripts ใน skill content

## Parallel Markers

1. ตรวจ `parallel:` และ `∥` ใช้เฉพาะใน `Execute` numbered list
2. ตรวจว่าไม่ใช้ `∥` ใน validation checklist, Rules bullets, หรือ Expected Outcome
3. ตรวจว่า operations ที่ parallel ไม่มี dependency กันจริง

## Script Usage

1. ถ้า data processing ซับซ้อนหรือ operations > 10 ไฟล์ → ใช้ `/use-scripts`
2. ถ้า workflow มี > 5 steps หรือ high-risk actions → อ่าน `follow-context-rot` เพื่อ review context rot
3. ถ้าต้อง review context rot → ทำ `/follow-harness-engineering` ∥ `/review-codebase-everything`

## Goal

ลด tool calls โดยรักษา safety — parallel เฉพาะที่ปลอดภัย และ scripts เฉพาะที่จำเป็น

## Scoring

- `High`: `∥` ใช้ในที่ผิด (Rules, Expected Outcome), parallel กับ operations ที่มี dependency
- `Medium`: ขาด `/use-scripts` เมื่อ operations > 10 ไฟล์
- `Low`: ขาด parallel markers เมื่อสามารถทำได้ปลอดภัย
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน
