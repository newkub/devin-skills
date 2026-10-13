# Bun Shell & Process APIs

Use Bun shell and process APIs for system operations

- `$` - Shell template literal for running shell commands cross-platform
- `Bun.spawn()` - Spawn a child process (async), returns a `Subprocess` object
- `Bun.spawnSync()` - Spawn a child process (sync), returns a `SpawnSyncResult`
- Supports stdin/stdout/stderr redirection and environment variables
