| key | value |
|---|---|
| install | none — `vp fmt` ships with Vite+ and `bun fmt` ships with Bun; `bun add -D @biomejs/biome` or `dprint` only for Node/npm/pnpm repos |
| config | `fmt` block in root `vite.config.ts` (Vite+) / `bunfig.toml [fmt]` (Bun) / `biome.json` / `dprint.json` |
| docs | https://viteplus.dev/guide/fmt |
| docs (bun fmt) | https://bun.com/docs/format |

| commands | description | default | options |
|---|---|---|---|
| `vp fmt` | Format with Oxfmt (Vite+) | all files, respects ignores | --check, -c/--config |
| `vp fmt --check` | Report unformatted files for CI | all files | -c/--config |
| `bun fmt` | Format with the built-in Bun formatter (Prettier-compatible output) | all files, respects ignores | --check, --staged, --changed, --stdin-filepath, --no-script |
| `bunx biome format --write` | Format with Biome | all files | --stdin-file-path |
| `dprint fmt` | Format with dprint | config spec | --incremental |
| `cargo fmt` | Format Rust | all crates | --check |
| `ruff format` | Format Python | current dir | --check, --diff |
