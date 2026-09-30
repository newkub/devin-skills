| key | value |
|---|---|
| version | 3.4.9 |
| package registry | https://www.npmjs.com/package/postgres |
| repository | https://github.com/porsager/postgres |
| docs | https://github.com/porsager/postgres |

| api | description | default | options |
|---|---|---|---|
| `postgres(url, opts)` | Create client | - | `host`, `max`, `ssl`, `prepare`, `idle_timeout`, `connect_timeout` |
| `` sql`SELECT ...` `` | Tagged template query | - | auto-parameterized |
| `sql.begin(fn)` / `sql.transaction` | Transaction | - | callback receives tx `sql` |
| `sql.unsafe(str, params)` | Raw query | - | ใช้เมื่อ dynamic identifiers |
| `` sql([{...}]).insert/update `` | Helper insert/update | - | `sql(table)` |
| `sql.listen(channel, cb)` | LISTEN/NOTIFY | - | - |
| `sql.end()` | Close pool | - | `{timeout}` |
