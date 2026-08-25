# Bun Shell & Process APIs

ใช้ Bun shell และ process APIs สำหรับ system operations

- `$` - Shell template literal สำหรับรัน shell commands แบบ cross-platform
- `Bun.spawn()` - Spawn child process (async) คืน `Subprocess` object
- `Bun.spawnSync()` - Spawn child process (sync) คืน `SpawnSyncResult`
- รองรับ stdin/stdout/stderr redirection, environment variables
