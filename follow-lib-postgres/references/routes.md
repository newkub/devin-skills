# Lib Postgres Routes / Topics

| Route / Topic | URL |
|---|---|
| README/docs | https://github.com/porsager/postgres |
| Queries & interpolation | https://github.com/porsager/postgres#queries |
| Transactions | https://github.com/porsager/postgres#transactions |
| Connection options | https://github.com/porsager/postgres#connection |
| Listen/Notify | https://github.com/porsager/postgres#listen--notify |
| Errors | https://github.com/porsager/postgres#errors |

## Key Concepts

- Tagged template auto-parameterize — ปลอดภัยจาก SQL injection โดย default
- Dynamic identifiers: `` sql(['col']) ``, `` sql('table') `` — ไม่ใช่ string concat
- Pool: `max` connections, `idle_timeout` สำคัญบน serverless
- Cursor: `` sql`...`.cursor() `` สำหรับ streaming rows
- Bun: `Bun.sql` ใช้ API เดียวกันแบบ native (เร็วกว่า)
