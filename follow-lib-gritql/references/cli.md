| key | value |
|---|---|
| note | GritQL รันผ่าน Biome CLI (`@biomejs/biome` v2+) — ไม่มี standalone binary |
| install | `bun add -D @biomejs/biome` |

| command | description | options |
|---|---|---|
| `bunx biome search '<gritql-pattern>' ./src` | structural code search — pattern ห่อด้วย backticks+single quotes | `--language=<lang>` |
| `bunx biome check --write` | apply safe fixes จาก GritQL plugins (`.grit` files ใน `biome.json`) | `--write` |
| `bunx biome check --write --unsafe` | apply รวม unsafe fixes | `--unsafe` |
| `bunx biome lint --write` | lint-only fixes | — |
