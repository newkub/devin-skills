# ctx API Reference

> Source: https://ctx.rs and https://github.com/ctxrs/ctx (accessed 2026-10-22)

| key | value |
|---|---|
| package | ctx (`ctxrs/ctx`) |
| install (Windows) | `irm https://ctx.rs/install.ps1 \| iex` |
| install (macOS/Linux) | `curl -fsSL https://ctx.rs/install -o /tmp/ctx-install.sh && sh /tmp/ctx-install.sh` |
| stable version | 2.2.8 (`Cargo.toml` on `main`, observed 2026-10-22) |
| license | Apache-2.0 |
| docs | https://ctx.rs |
| repo | https://github.com/ctxrs/ctx |
| official agent skill | https://github.com/ctxrs/ctx/blob/main/skills/ctx/SKILL.md |
| data root | `~/.ctx` — override with `--data-root` or `CTX_DATA_ROOT` |
| MCP entry | `ctx mcp serve` |

| api | description | signature/example |
|---|---|---|
| `ctx search` | ranked history search over sessions and events | `ctx search "failed migration"` |
| `ctx show event` | one event hit with neighboring events | `ctx show event <id> --window 5` |
| `ctx show session` | one transcript in lite, full, or log mode | `ctx show session <id> --mode log` |
| `ctx locate` | source identity for a session or event | `ctx locate event <id> --format json` |
| `ctx list events` | deterministic machine enumeration with cursors | `ctx list events --since <ts> --format jsonl` |
| `ctx blame` | committed code to producing agent session | `ctx blame file <path> --lines 118:146` |
| `ctx graph` | call, dependency, and impact queries on a snapshot | `ctx graph callers <symbol>` |
| `ctx sift` | execute once and compact tool output | `ctx sift -- <program> <args>` |
| `ctx docs` | embedded documentation matched to the binary | `ctx docs show search` |
| MCP `blame` | structured target `file`, `commit`, or `pull_request` | `{"target":{"kind":"file","path":"src/a.ts"},"limit":8}` |
| `CTX_QUIET=1` | suppress successful setup/status human output | script default for `setup` and `status` |
| `CTX_OUTPUT_CONFIG_DIR` | output config location | separate from the history data root |
| `CTX_OUTPUT_STATE_DIR` | output state location | separate from the history data root |
| `--server NAME` | saved remote connection for `search`, `show`, `mcp serve` | `ctx --server prod search "query"` |
