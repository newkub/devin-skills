# Other Bun APIs

ใช้ Bun APIs อื่นๆ สำหรับ utilities

- `bun:test` - Built-in test runner (Jest-compatible, `bun test --parallel` ตั้งแต่ 1.4)
- `Bun.env` - Environment variables (faster than `process.env`)
- `Bun.version` / `Bun.revision` - Bun version information (latest `1.4.2 (verified 2026-09-12)`)
- `Bun.main` - Main entry point file path
- `Bun.resolveSync()` - Module resolution (sync)
- `Bun.Image` - Image decode/encode/resize (1.4)
- `Bun.WebView` - Native webview windows (1.4)
- `Bun.cron()` - Cron-style scheduling (1.4)
- `Bun.Terminal` - PTY terminal sessions (1.4)
