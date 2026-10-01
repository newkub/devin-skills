# Data Validation — Best Practices

Validator usage discipline — schemas, boundaries และ error surfacing

## Recommended Patterns

- Validate ที่ system boundaries เท่านั้น: API inputs, env vars, form submits, external payloads, DB results ที่ไม่ trust — ภายใน trust types
- Schema = source of truth — derive types จาก schema (`z.infer`, `type.infer`) ไม่เขียน interface แยก
- Fail-fast + structured errors: collect `issues` ทั้งหมดแล้ว format — อย่า throw raw error แรกให้ user
- Env validation ตอน boot — startup crash ดีกว่า runtime misconfig เงียบ
- Reuse schemas ข้าม layers: API contract = form validation = DB input เดียวกัน

## Common Pitfalls

- Double validation ทุก layer = ช้า + error paths ซ้ำ — validate ครั้งเดียวที่เข้าระบบ แล้ว typed ต่อ
- Parse vs validate: transformation ใน schema (`.transform`, morphs) เปลี่ยน output — ตรวจ output type
- Error messages ต้อง user-mappable — path + code + message structure ไม่ใช่ string เดียว
- อย่า validate ใน loops/hot paths — hoisted validators + validate batch เดียว
- Sensitive fields: อย่า log raw validated data ที่มี secrets/PII — sanitize error payloads

## Security Notes

- Validation ≠ sanitization — HTML/JS sanitize เป็นงานแยก (DOMPurify); schema แค่เช็ค shape/type
- Strict unknown-key handling — passthrough/loose objects เปิด mass-assignment; explicit fields เสมอ
- Size limits: `max` strings/arrays ป้องกัน DoS payload ใหญ่

## Do / Don't

| Do | Don't |
|----|-------|
| validate ที่ boundaries เดียว | re-validate ทุก function call |
| structured issues → UI errors | raw error strings ให้ user |
| env validation ตอน boot | lazy env checks ใน runtime |
| strict schemas + explicit fields | passthrough objects ทั่วไป |
