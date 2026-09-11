# Lib GritQL API & Dependencies

GritQL ใน repo นี้หมายถึง pattern language ที่ Biome ใช้ (`biome search` / lint plugin rules) — ไม่ใช่ npm package แยก

## Install

```sh
# GritQL engine มาพร้อม Biome v2+
bun add -D @biomejs/biome

# standalone GritQL SDK (optional, beta)
bun add -D gritql
```

## Version

- `@biomejs/biome`: `2.5.13` — มี GritQL engine built-in (verified 2026-09-11)
- `gritql` npm: `3.0.0-beta.31` (beta — ระวัง API เปลี่ยน)
- [Repository](https://github.com/biomejs/biome) / [GritQL upstream](https://github.com/getgrit/gritql)

## Dependencies

- ไม่มี deps เพิ่ม — Biome เป็น Rust binary
- standalone `gritql` ใช้ WASM/bindings จาก getgrit/gritql

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `` `pattern($x)` `` | Code snippet pattern | - | metavariables `$name` |
| `where <cond>` | Filter matches | - | `<`, `contains`, `within` |
| `language js(ts,jsx)` | Target language | - | `css`, `json`, `html` |
| `engine biome(1.0)` | Bind to Biome AST nodes | - | node names เช่น `JsIfStatement` |
| `biome search '<pattern>'` | Run pattern over project | src | --stdin-file-path |

## Source

- Official docs: https://biomejs.dev/reference/gritql/
- Description: Declarative code search/rewrite pattern language.
