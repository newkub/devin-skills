# fix-* Template

แก้ไข findings/bugs/errors ที่รู้ root cause แล้ว — apply fix อย่าง minimal และ verify

## Execute Pattern

- ยืนยัน root cause ก่อนแก้ — อ่าน finding/error evidence, reproduce ถ้าทำได้ ห้ามแก้ตาม symptom. ถ้าไม่ชัด → `/analyze-root-cause-analysis` หรือ `/deep-debug` ก่อน
- แก้แบบ minimal — เฉพาะจุดที่เป็น root cause ไม่ refactor โดยไม่จำเป็น. หลาย fix อิสระกัน → แยก commit หรือแยก step ชัดเจน
- verify fix — รัน test/check ที่เกี่ยวข้องจนผ่าน (`/run-test-*`, `/run-check`) และยืนยันว่าไม่เกิด regression. ถ้าไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

