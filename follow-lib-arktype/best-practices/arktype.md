# Arktype — Best Practices

Recommended patterns สำหรับ Arktype — runtime validation ที่ infer TypeScript types จาก definition เดียว

## Recommended Patterns

- เขียน type ด้วย `type()` DSL string เป็นหลัก — concise และ infer TS type อัตโนมัติ: `type("{ name: string, age?: number }")`
- ใช้ `type.infer` / `typeof t.infer` สำหรับ static type — definition เป็น single source of truth (ไม่เขียน interface แยก)
- จัดกลุ่ม types ที่เกี่ยวกันด้วย `scope()` — share aliases และ reference กันใน scope เดียว
- Validate ที่ boundary เท่านั้น (API input, env, external data) — data ภายในไม่ต้อง re-validate
- ใช้ `.assert` สำหรับ throw-on-invalid, `.allows` สำหรับ boolean check — เลือกตาม error strategy

## Common Pitfalls

- `type()` throw ทันทีที่ compile เมื่อ definition ผิด — parse errors เป็น build-time not runtime; test definitions เสมอ
- Traversal errors ของ Arktype เป็น structured `ArkErrors` — iterate แล้ว format เอง อย่า rely บน raw `error.message` string เดียว
- Morphs (`.to()`/pipe) เปลี่ยน output type — ตรวจว่า downstream รับ morphed type ไม่ใช่ input type
- Optional vs default ต่างกัน: `key?:` = ไม่ต้องมี, `key = default` (ใน scope syntax) = เติมค่า — เลือกให้ตรง intent

## Perf Notes

- Arktype JIT-compiles validators — compile ครั้งเดียวแล้ว reuse `type` object; ห้ามสร้าง `type()` ใน loop/hot path
- `.assert`/`.allows` เร็วกว่า try/catch `parse` — ใช้ตามความเหมาะสม

## Do / Don't

| Do | Don't |
|----|-------|
| `type()` + `type.infer` single source | เขียน interface + validator แยกกัน |
| `scope()` สำหรับ type families | global aliases กระจาย |
| validate ที่ boundary เท่านั้น | validate ซ้ำทุก function layer |
| reuse compiled `type` | `type()` ภายใน request handler |
