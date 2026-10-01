# Drizzle ORM — Best Practices

Schema-first ORM patterns, query discipline และ migration hygiene

## Recommended Patterns

- Schema = single source of truth — เขียน `pgTable`/`sqliteTable`/`mysqlTable` ให้ mirror DB จริง, relations ใน `relations()` blocks แยกต่างหาก
- Relational queries (`db.query.table.findMany({ with: ... })`) สำหรับ reads ที่ต้อง nested — core API (`select().from().leftJoin()`) เมื่อต้องคุม columns/shape แน่น
- Prepared statements สำหรับ hot paths: `db.select()...prepare()` — reuse ข้าม requests
- Transactions: `db.transaction(async (tx) => ...)` สำหรับ multi-write — ไม่เชื่อ partial success
- Indexes/unique/FK ประกาศใน schema เสมอ — อย่าพึ่ง DB ที่ "เคยทำมือ"

## Common Pitfalls

- `drizzle-kit generate` vs `push` — `generate` = migration files (production), `push` = dev-only shortcut; ห้าม push บน prod schema
- Migration files = artifacts ที่ต้อง commit — ห้าม regenerate ทับ history ที่ apply แล้ว
- `with` nested queries สร้าง N+1 patterns ได้ถ้า `limit` ไม่คุม — ระวัง deep nesting + big tables
- `.returning()` ใช้ได้เฉพาะ dialects ที่รองรับ (pg/sqlite) — mysql ไม่มี
- Snake↔camel: ใช้ `casing` option ใน drizzle config แทนเขียน column names เองทุกตัว

## Perf Notes

- เลือก columns เจาะจง (`select({ id: t.id })`) — `select *` ลาก JSON blob/bytea มาเกินจำเป็น
- `db.$count` / `sql` fragments สำหรับ aggregates — ไม่ fetch rows มานับเอง
- Connection: ใช้ pool driver (`postgres.js`, `@electric-sql/pglite`, D1 adapter) ตาม runtime — serverless → adapter ที่ไม่ hold socket (neon/http, D1)

## Do / Don't

| Do | Don't |
|----|-------|
| schema-first + `generate` migrations | `push` บน production |
| prepared statements ใน hot paths | rebuild query objects ทุก request |
| transactions สำหรับ multi-write | sequential writes ไม่ atomic |
| indexes/FK ใน schema | DB constraints ทำมือนอก repo |
