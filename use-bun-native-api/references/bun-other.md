# Other Bun APIs

| API | Description |
|-----|-------------|
| `bun:test` | Built-in test runner (Jest-compatible; parallel test/run since Bun 1.4) |
| `Bun.version` / `Bun.revision` | Runtime version info — read at runtime, never hardcode |
| `Bun.main` | Absolute path of the entry-point file |
| `Bun.resolveSync()` | Synchronous module resolution |
| `Worker` | Bun-flavored Web Workers (also see `references/bun-web-apis.md`) |
| `Bun.Image` | Image decode/encode/resize (introduced in Bun 1.4) |
| `Bun.WebView` | Native webview windows (introduced in Bun 1.4, experimental) |
| `Bun.cron()` | Cron-style in-process scheduling (introduced in Bun 1.4) |
| `Bun.Terminal` | PTY terminal sessions (introduced in Bun 1.4) |
