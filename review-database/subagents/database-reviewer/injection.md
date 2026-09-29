# Query Safety And Injection Checklist — review-database

## Parameterization

- [ ] ทุก user input → parameterized — placeholders (`$1`, `?`, `:name`) เท่านั้น ไม่มี interpolation
- [ ] no string concat เข้า SQL — `` `WHERE id = ${input}` `` = fail
- [ ] ORM methods safe — `.where({ id })` parameterizes, ไม่ใช่ `.where("id = " + id)`
- [ ] prepared statement caching — reuse ไม่ re-parse ทุก call
- [ ] LIKE wildcards escaped — user input ใน `LIKE '%...%'` escape `%`/`_`

## Raw SQL Audit

- [ ] raw escape points inventory — `sql`, `raw`, `execute`, `whereRaw`, `query` ทุกจุด
- [ ] ทุก raw call มี justification — comment ว่าทำไม raw จำเป็น
- [ ] identifier escaping — table/column names ไม่ parameterize ได้ → whitelist/quote helper
- [ ] `ORDER BY`/`LIMIT`/`OFFSET` จาก user — whitelist values ไม่ใช่ raw strings
- [ ] dynamic table names — multi-tenant/sharded names validate ก่อนใส่ query

## ORM Raw Escapes

- [ ] Drizzle `sql` template — values ผ่าน params, ไม่ใช่ `${raw(input)}` ทุกที่
- [ ] Prisma `$queryRaw`/`$executeRaw` — tagged templates ปลอดภัย, `$queryRawUnsafe` ห้ามใช้กับ user input
- [ ] Sequelize `literal`/`raw` — bind params, ไม่ interpolation
- [ ] stored procedures — dynamic SQL ข้างใน proc ก็ต้อง parameterized

## Second-Order Injection

- [ ] stored data → query later — input ที่ save แล้ว re-use ใน query ก็ต้อง parameterized
- [ ] JSON/JSONB paths — `->` operators กับ user keys ไม่ injection
- [ ] LIKE/regex patterns — user patterns escape special chars
- [ ] report/export queries — dynamic column selection whitelist

## Access Control

- [ ] least-privilege DB user — app role ไม่ใช่ superuser, ไม่มี DDL rights บน prod
- [ ] separate users per service — read-only replicas user สำหรับ reporting
- [ ] row-level security — multi-tenant isolation ที่ DB ไม่ใช่แค่ app layer (ถ้ามี)
- [ ] audit trail — sensitive table access logged

## Mass Assignment

- [ ] input → object → save — ไม่ merge raw request body เข้า update โดยตรง
- [ ] whitelist updateable fields — `pick(input, allowed)` ก่อน `update()`
- [ ] hidden fields protected — `role`, `is_admin`, `tenant_id` ไม่ user-settable
- [ ] ORM mass-assignment guards — `fillable`/`strict` mode

## NoSQL Injection

- [ ] MongoDB operator injection — `{ $gt: "" }` ใน user input stripped/validated
- [ ] `$where`/eval disabled — JS execution off on prod
- [ ] schema validation — MongoDB validators หรือ app-layer schema

## Detection

- grep string concat into queries — `` `WHERE`, `` `SELECT`, `+` in query builders
- grep `raw`, `literal`, `execute`, `$queryRaw`, `sql\``
- grep request body → ORM save directly — `update(req.body)`, `create(req.body)`

Severity: string-interpolated user input in SQL = Critical, `*Unsafe` APIs with user input = Critical, mass assignment = High, missing LIKE escape = Medium
