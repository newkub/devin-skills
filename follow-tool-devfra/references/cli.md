| command | description | options |
|---|---|---|
| `my-tool` | dev server (default command) at `http://localhost:9999/` — or `cli.port` เมื่อตั้งไว้ | `--port`, `--host`, `--open`/`--no-open` |
| `my-tool --config ./my.config.mjs` | custom flags ผ่าน `cli.configure()` | `--config` |
| `my-tool build --out-dir dist-static` | self-contained static deploy | `--out-dir`, `--base` |
| `my-tool mcp` | stdio MCP server | — |

| `cli` field (definition) | description | default |
|---|---|---|
| `command` | binary name | `id` |
| `port` | preferred dev port | `9999` |
| `portRange` | forwarded to get-port-please | — |
| `random` | prefer random open port | `false` |
| `host` | host (`--host` overrides) | `localhost` |
| `open` | auto-open browser (embeds OTP); `boolean` หรือ string = path to open | `true` |
| `flags` | typed flags via `defineCliFlags` | — |
| `configure(cli)` | contribute cac options/commands — runs *before* `createCac`'s `configureCli` | — |

| `createCac(def, options)` | description | default |
|---|---|---|
| `defaultPort` | dev port เมื่อ `--port` ไม่ระบุ | `9999` หรือ `def.cli?.port` |
| `configureCli` | `(cli: CAC) => void` เพิ่ม commands/flags | none |
| `onReady` | `(info: { origin, port, app }) => void \| Promise<void>` เรียกเมื่อ listen สำเร็จ | none |
