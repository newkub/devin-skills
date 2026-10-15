# Bun File I/O APIs

| API | Description |
|-----|-------------|
| `Bun.file()` | Lazy `BunFile` (Blob-like) for a path — read via `.text()`/`.bytes()`/`.stream()` without buffering the whole file |
| `Bun.write()` | Destination-aware write (path, `Bun.file`, Response, Blob, string, ArrayBuffer) — streams automatically |
| `Bun.fileURLToPath()` | Convert a `file://` URL to an OS path |
| `Bun.stdin` / `Bun.stdout` / `Bun.stderr` | Standard stream blobs (`.text()`, `.json()`, `.write()`) |
