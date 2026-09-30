| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/drizzle-kit |
| repository | https://github.com/drizzle-team/drizzle-orm |
| docs | https://orm.drizzle.team/docs/kit-overview |

| commands | description | default | options |
|---|---|---|---|
| `drizzle-kit generate` | สร้าง SQL migration จาก schema | `./drizzle` out | --name, --custom |
| `drizzle-kit migrate` | Apply migrations | - | - |
| `drizzle-kit push` | Push schema ตรงๆ (dev) | - | --force |
| `drizzle-kit pull` | Introspect DB → schema | - | --tablesFilter |
| `drizzle-kit check` | Validate migrations | - | - |
| `drizzle-kit studio` | Data browser UI | - | --port |
| `drizzle-kit up` | Upgrade snapshots | - | - |
