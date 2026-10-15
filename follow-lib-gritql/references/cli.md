| key | value |
|---|---|
| note | GritQL runs through the Biome CLI (`@biomejs/biome` v2+) — no standalone binary |
| install | `bun add -D @biomejs/biome` |

| command | description | options |
|---|---|---|
| `bunx biome search '<gritql-pattern>' ./src` | structural code search — pattern wrapped in backticks+single quotes | `--language=<lang>` |
| `bunx biome check --write` | apply safe fixes from GritQL plugins (`.grit` files in `biome.json`) | `--write` |
| `bunx biome check --write --unsafe` | apply including unsafe fixes | `--unsafe` |
| `bunx biome lint --write` | lint-only fixes | — |
