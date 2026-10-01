# Zod — Best Practices

Schema-first validation — inference, error handling และ perf discipline

## Recommended Patterns

- Schema = source of truth: `z.infer<typeof schema>` สำหรับ TS types — ไม่เขียน interface แยก
- `safeParse` ที่ boundary — return `{success, data, error}` ไม่ throw; `parse` เฉพาะเมื่อ invariant จริง (throw = bug signal)
- Compose: `.extend`, `.merge`, `.pick`, `.omit`, `.partial` — derive schemas แทน duplicate
- `.transform`/`.refine`/`.superRefine` — transform เมื่อ shape เปลี่ยน, refine เมื่อ cross-field/custom logic
- `z.discriminatedUnion` สำหรับ variants — เร็วกว่า `z.union` + error messages ดีกว่า
- Error surfacing: `error.issues`/`z.treeifyError`/`z.flattenError` — format ให้ UI ใช้ได้ ไม่ส่ง raw message

## Common Pitfalls

- `.default()` vs `.optional()` — default เติมค่าเมื่อ undefined, optional แค่ยอม undefined; output types ต่างกัน
- `.passthrough()`/`.loose()` (zod4: `z.looseObject`) เปิด unknown keys — strict default ดีกว่า security-wise; เลือก `.catchall` แทนถ้าต้อง validate extras
- Transform ทำ output ≠ input — ตรวจ `z.infer` vs `z.input`/`z.output` ให้ตรงฝั่งที่ใช้
- Async refinements → ต้อง `safeParseAsync`/`parseAsync` — sync parse จะ throw
- Recursion: `z.lazy()` + explicit type annotation — TS infer ไม่ได้ใน recursive schemas

## Perf Notes

- Schemas compile ตอนสร้าง — hoist เป็น module-level const, ห้ามสร้างใน request handler
- `z.union` ใหญ่ช้า — ใช้ discriminated union เมื่อมี discriminant key
- `z.object` strict checks key ทั้งหมด — schemas ที่ validate ซ้ำหนักๆ พิจารณา caching parsed result

## Do / Don't

| Do | Don't |
|----|-------|
| `safeParse` ที่ boundaries | `parse` ทุกจุดแล้ว try/catch |
| `discriminatedUnion` สำหรับ variants | `z.union` ยาวๆ |
| derive schemas (`.pick`/`.omit`) | duplicate schema definitions |
| hoist schema module-level | construct schema ใน hot path |
