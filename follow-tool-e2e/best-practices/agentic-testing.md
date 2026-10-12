# e2e best practices

## Do

- หนึ่ง goal ต่อ `agent.act` — agent คุม flow ใน goal, เราคุม order ของ goals
- ใช้คำที่ screen แสดงจริงใน goal text; ย้ายคำที่ใช้ซ้ำหลาย goal ไป `context`
- `expect(locator)` หลัง `agent.act` เสมอ — เป็นเงื่อนไขให้ cache record goal นั้น
- `unique()` สำหรับค่าที่เปลี่ยนทุก run (email, slug) — cache ยัง replay ได้
- judge meaning ไม่ใช่ exact sentence สำหรับ text ที่ model เขียน; ต้องการ exact → locator assertion
- `{ vision: 'only' }` เมื่อ judge screenshot ล้วน; `{ vision: true }` เมื่อต้องดู pixels เสริม

## Don't

- อย่าใช้ `agent.act` กับ action ที่รู้ exact selector — เสีย model call โดยไม่จำเป็น
- อย่า interpolate password/token ลง goal string — ใช้ `Secret` param
- อย่าพึง direct read (`textContent()`) กับค่าที่ต้องรอ — มันไม่ retry
- อย่า query ที่ match หลาย node โดยไม่ `.filter()/.first()/.nth()` — action/read/single-node assertion จะ fail

## Cost

- `scan` deterministic = ฟรี; `act` ถูก cache หลัง verified; `assert`/`waitFor`/`extract` เสมอเสีย token — วาง assert ให้น้อยแต่ครอบคลุม
- decision model + small text model สำหรับ bounded actions แทน full LLM agent เมื่อ flow แคบ
