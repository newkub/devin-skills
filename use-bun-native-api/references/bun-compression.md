# Bun Compression APIs

| API | Description |
|-----|-------------|
| `Bun.gzipSync()` / `Bun.gunzipSync()` | Gzip compress/decompress |
| `Bun.deflateSync()` / `Bun.inflateSync()` | Deflate/zlib compress/decompress |
| `Bun.zstdCompressSync()` / `Bun.zstdDecompressSync()` | Synchronous Zstd compress/decompress |
| `Bun.zstdCompress()` / `Bun.zstdDecompress()` | Async (stream) Zstd compress/decompress |
| `Bun.Archive` | Extract/create archives (per current docs — verify availability via `/deep-research`) |
