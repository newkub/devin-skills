| key | value |
|---|---|
| package | `@native-sdk/cli` — app packages: `@native-sdk/core`, `@native-sdk/services` |
| install | `npm install -g @native-sdk/cli` · `bunx @native-sdk/cli` (see the broken-npm note in `SKILL.md` Rules §6 on this machine) |
| version | 0.11.0 (npm latest, verified 2026-10-20) |
| license | Apache-2.0 |
| repo | https://github.com/vercel-labs/native |
| docs | https://native-sdk.dev |
| runtime needs | Zig 0.16.0 (auto-downloaded to `~/.native/toolchains/` with checksum) + Node 24+ at build/dev time only — neither ships in the binary |

| api | description | example |
|---|---|---|
| `native init <name>` | scaffold ts-core (default), zig-core, or a webview frontend | `native init my_app --template zig-core` |
| `app.json` | manifest: capabilities (`persist`, `store`, `sqlite`, `filesystem`, `tray`), theme pack, `updates{feed_url,public_key}` | `--frontend vite` switches to a hosted frontend |
| `src/core.ts` | TEA core: `Model`, `Msg`, `initialModel()`, `update(model,msg)` | `update(model, msg): Model \| [Model, Cmd<Msg>]` |
| `src/app.native` | declarative markup bound to the model | `on-press="toggle:{t.id}"` |
| `@native-sdk/core` | core helpers/types | `import { utf8Bytes, asciiBytes } from "@native-sdk/core"` |
| `@native-sdk/services` | typed client for full-TS services on the `<app>_services` carrier | `Cmd.request(name, payload, { key, ok, err })` |
| `@native-sdk/core/testing` | unit-test harness | `NativeApp.start()` → `findWidget/click/setText/snapshot/effects/verifyReplay` |
| `Cmd` vocabulary | effects: `now delay fetch readFile writeFile clipboard* spawn showNotification quitApp persist store.* db.query request batch` | `Cmd.delay(...)` |
| `Sub` subscriptions | long-lived effects | `Sub.timer("tick", 1000, "tick")` |
| `src/schema/NNNN_name.sql` | SQLite migrations (WAL, `sqlite` capability) | `native db new-migration` |
| `src/queries.sql` | named queries → generated `Cmd.qName` / `Sub.qName` | `-- name: x :live` |
| `windows(model)` | multi-window scene model (≤16, desktop only) | `close_policy quit\|hide` |
