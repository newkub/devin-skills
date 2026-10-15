# Bun Utilities APIs

| API | Description |
|-----|-------------|
| `Bun.sleep()` / `Bun.sleepSync()` | Await/sync delay in milliseconds |
| `Bun.nanoseconds()` | Monotonic high-resolution timer |
| `Bun.randomUUIDv7()` | Time-ordered UUID v7 |
| `Bun.which()` | Locate an executable on `PATH` (cross-platform `which`) |
| `Bun.peek()` | Peek a settled Promise value without blocking |
| `Bun.deepEquals()` | Deep equality comparison |
| `Bun.inspect()` | Object inspection (Node `util.inspect`-compatible) |
| `Bun.escapeHTML()` | Escape HTML special characters |
| `Bun.stringWidth()` | Display width of a string (Unicode, ANSI-aware) |
| `Bun.gc()` | Force garbage collection |
| `Bun.env` | Environment variables (faster than `process.env`) |
| `Bun.semver` | Semantic version parsing and comparison |
| `Bun.Glob` | Glob pattern matching (fast file matching) |
