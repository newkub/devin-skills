| command | description | options |
|---|---|---|
| `my-tool` | dev server (default command) at `http://localhost:9999/` — or `cli.port` when set | `--port`, `--host`, `--open`/`--no-open` |
| `my-tool --config ./my.config.mjs` | custom flags via `cli.configure()` | `--config` |
| `my-tool build --out-dir dist-static` | self-contained static deploy | `--out-dir`, `--base` |
| `my-tool mcp` | stdio MCP server | — |

| `cli` field (definition) | description | default |
|---|---|---|
| `command` | binary name | `id` |
| `port` | preferred dev port | `9999` |
| `portRange` | forwarded to get-port-please | — |
| `random` | prefer random open port | `false` |
| `host` | host (`--host` overrides) | `localhost` |
| `open` | auto-open browser (embeds OTP); `boolean` or string = path to open | `true` |
| `flags` | typed flags via `defineCliFlags` | — |
| `configure(cli)` | contribute cac options/commands — runs *before* `createCac`'s `configureCli` | — |

| `createCac(def, options)` | description | default |
|---|---|---|
| `defaultPort` | dev port when `--port` is not given | `9999` or `def.cli?.port` |
| `configureCli` | `(cli: CAC) => void` add commands/flags | none |
| `onReady` | `(info: { origin, port, app }) => void \| Promise<void>` called once listening succeeds | none |
