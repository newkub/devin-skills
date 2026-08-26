# Content Quality Check

ตรวจคุณภาพเนื้อหา skill หลังเขียนเพื่อให้ทำตามได้จริง ไม่มี noise ไม่ซ้ำซ้อน

## Simplify And Remove Redundancy

1. ทำ `/review-writing` ∥ `/simplify` เพื่อกระชับเนื้อหา
2. ตรวจเนื้อหาซ้ำซ้อนระหว่าง `Execute` และ `Rules`
3. ถ้าเนื้อหาใน `Rules` ซ้ำกับ skill อื่น → แทนที่ด้วย reference
4. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal

## High Impact Content

1. ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
2. ห้าม TODO, MOCK, placeholder, generic filler หรือคำสวยแต่ไม่ actionable
3. การ simplify ต้องเก็บ context ครบ ไม่ลบข้อมูลสำคัญ
4. ถ้าพบ gaps ใน coverage → ทำ `/update-review-cli-and-run`

## Clarity And Determinism

1. ตรวจ active voice, ระบุ subject/object, หลีกเลี่ยงคำกำกวม
2. ตรวจ validation criteria ว่า measurable: ระบุ threshold, expected format, pass/fail, retry limit
3. ตรวจว่าไม่มี assumptions ที่ไม่ได้ระบุ
4. ถ้าเนื้อหากำกวม → rewrite แล้ว recheck (max 3 → stop/report)

## Scoring

- `Critical`: มี TODO/MOCK/placeholder, เนื้อหากำกวมจนทำตามไม่ได้
- `High`: เนื้อหาซ้ำซ้อนระหว่าง Execute และ Rules, ขาด validation criteria
- `Medium`: generic filler, ขาด active voice
- `Low`: กระชับได้อีก, คำสวยแต่ไม่ actionable
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน
