# Best Practices: postgres.js (postgres Driver)

แนวทางใช้ `postgres` driver ให้ปลอดภัยจาก injection, pool ไม่ล้น และ transaction ถูกต้อง

## Recommended Patterns

- สร้าง client ครั้งเดียว `postgres(url, {max, prepare, idle_timeout})` ต่อ app — pool จัดการเอง
- Query ด้วย tagged template เสมอ `` sql`SELECT * FROM t WHERE id = ${id}` `` — parameterized อัตโนมัติ กัน SQL injection
- Transaction ด้วย `sql.begin(async sql => {...})` — callback ได้ tx-scoped `sql`; error = rollback อัตโนมัติ
- Insert/update helper: `sql(table).insert({...})` หรือ `sql([{...}])` สำหรับ bulk — ลด dynamic SQL
- LISTEN/NOTIFY ผ่าน `sql.listen(channel, cb)` / `sql.notify(channel, payload)` — realtime ง่ายๆ ไม่ต้อง pub/sub แยก
- `sql.subscribe(pattern, cb)` สำหรับ row-change events — สร้าง dedicated connection ให้เอง
- ปิด pool ด้วย `await sql.end()` ใน shutdown — graceful drain

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ tagged template ทุก query | concatenate string เข้า SQL (injection) |
| `sql.unsafe(str, params)` เมื่อ dynamic identifiers จริงๆ | ใช้ `sql.unsafe` กับ user input ดิบ |
| ตั้ง `max` pool ตาม DB capacity + app concurrency | เปิด connection ต่อ request (serverless) — ใช้ pooler |
| `sql.begin` สำหรับ multi-statement atomicity | เรียก `BEGIN`/`COMMIT` เองผ่าน `sql.unsafe` |
| Handle `error` event + connection retry | assume pool heal เองเสมอ |
| `sql.end()` ใน graceful shutdown | kill process ทิ้ง connections ค้าง |

## Common Pitfalls

- String concat `` `WHERE id = ${id}` `` (ไม่ใช่ tagged template) = injection — template tag ต้องเป็น `sql` prefix เสมอ
- `sql.unsafe` กับ dynamic table/column names — whitelist identifiers เอง; อย่าส่ง user input ตรงๆ
- Pool exhaust: `max` สูงเกิน Postgres `max_connections` → connection refused; นับรวมทุก instance
- Transaction callback ที่ throw — rollback เกิดอัตโนมัติ แต่ swallow error ใน callback ทำให้ silent fail
- LISTEN บน pooled connection — `sql.listen` ใช้ dedicated conn; อย่า assume listener อยู่ใน pool เดียวกับ queries
- Prepared statement name collision ข้าม session — `prepare: false` เมื่อ debug หรือ dynamic shape บ่อย
- `sql.end({timeout})` ไม่รอ — ตั้ง timeout ให้ pending queries จบ

## Performance Notes

- `max` pool size ~10-20 ต่อ instance พอ — มากไป thrash; ขึ้นกับ query latency และ DB size
- `prepare: true` (default) cache statements — query shape ซ้ำเร็วขึ้น; dynamic IN clause ใหญ่ๆ อาจ invalidate
- `idle_timeout` + `connect_timeout` กัน zombie connections บน serverless/spotty network
- Serverless (Lambda, Workers): อย่าเปิด pool ต่อ invocation — ใช้ PgBouncer, RDS Proxy หรือ Hyperdrive
- Batch ด้วย `sql([{...}]).insert` / unnest arrays แทน loop insert
- LISTEN/NOTIFY payload limit ~8KB — ส่ง id/key ไม่ใช่ payload เต็ม

## Ecosystem / Integration

- ORM layer → `/follow-lib-drizzle` (drizzle ใช้ postgres.js เป็น driver)
- Bun-only project พิจารณา `Bun.sql` built-in — แต่ postgres.js portable กว่า
- Migration tooling แยก (drizzle-kit, หรือ sql files) — driver ไม่มี migration
- PgBouncer/Hyperdrive สำหรับ serverless pooling; connection string ต่อ pooler endpoint
