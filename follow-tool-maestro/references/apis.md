| key | value |
|---|---|
| package | `maestro` CLI — single binary, no npm package |
| install | macOS/Linux/WSL: `curl -fsSL "https://get.maestro.mobile.dev" -o /tmp/maestro-install.sh && bash /tmp/maestro-install.sh` · Windows: installer page on the docs site |
| version | CLI 2.11.0 (released 2026-09-29) |
| license | Apache-2.0 |
| docs | https://docs.maestro.dev |
| repo | https://github.com/mobile-dev-inc/Maestro |
| prereq | Java 17+ |
| targets | Android emulator/device, iOS simulator, browser — physical iOS unsupported |

| api | description | signature/example |
|---|---|---|
| flow file | one journey per `.yaml`: header + `---` + flat command list | `appId:` then commands |
| `launchApp` / `stopApp` | app lifecycle | |
| `tapOn` / `inputText` / `scroll` / `back` | interaction | `tapOn: "Create new contact"` |
| `assertVisible` | assertion on the accessibility tree | `assertVisible: "John"` |
| selectors | text or id from the hierarchy | `maestro hierarchy` to inspect |
| `optional: true` / `when:` | tolerate optional UI and branch | per-command modifier |
| auto-wait | built-in retries — no sleeps in flows | remove manual waits |
| output | JUnit for CI artifacts | `--format JUNIT` |
| MCP server | live device control for agents | `maestro mcp` |
