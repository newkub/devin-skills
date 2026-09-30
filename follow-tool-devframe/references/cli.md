| key | value |
|---|---|
| adapter | `createCac(def)` จาก `devframe/adapters/cac` — wrap `createDevServer`/`createBuild`/`createMcpServer` เป็น CLI เดียว (peer: `bun add cac`) |
| source | https://devfra.me/raw/guide/standalone-cli.md, https://devfra.me/raw/adapters/cac.md (verified 2026-09-18) |

| command | description | options |
|---|---|---|
| `my-tool` | dev server (default command) at http://localhost:7777/ | `--port`, `--host`, `--open`/`--no-open` |
| `my-tool --config ./my.config.mjs` | custom flags ผ่าน `cli.configure()` | `--config` |
| `my-tool build --out-dir dist-static` | self-contained static deploy | `--out-dir`, `--base` |
| `my-tool mcp` | stdio MCP server | — |

| `cli` option | description | default |
|---|---|---|
| `command` | binary name | `id` |
| `port` | preferred port | `9999` |
| `portRange` | forwarded to get-port-please | — |
| `random` | prefer random open port | `false` |
| `host` | host (`--host` overrides) | `localhost` |
| `open` | auto-open browser (embeds OTP) | `true` |
| `flags` | typed flags via `defineCliFlags` | — |
| `configure(cli)` | contribute cac options/commands | — |

| api | description | signature |
|---|---|---|
| `defineCliFlags` | typed CLI flags (Standard Schema — booleans → `--verbose`/`--no-verbose`, camelCase → kebab-case) | `defineCliFlags({ depth: v.pipe(v.number()) })` |
| `InferCliFlags` | inferred flags type at call site | `setup(ctx, { flags })` |
| `parseCliFlags` | validate raw bag สำหรับ custom framework (commander/yargs/oclif) | `parseCliFlags(schema, rawBag)` |
| `createDevServer` | dev server factory → `StartedServer` | `createDevServer(def, { port, flags, onReady })` |
| `createBuild` | build factory | `createBuild(def, { outDir })` |
| `createMcpServer` | MCP server factory | `createMcpServer(def, { transport: 'stdio' })` |
