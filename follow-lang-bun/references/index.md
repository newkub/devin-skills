# Bun API References

ภาพรวม Bun native APIs และ Web-standard APIs แบ่งตาม category สำหรับการพัฒนาโปรเจกต์ด้วย Bun runtime

## Reference Files

- `bun-http-server.md` - HTTP Server APIs (`Bun.serve()`, `Bun.websocket()`)
- `bun-shell-process.md` - Shell & Process APIs (`$`, `Bun.spawn()`, `Bun.spawnSync()`)
- `bun-file-io.md` - File I/O APIs (`Bun.file()`, `Bun.write()`, standard streams)
- `bun-networking.md` - Networking APIs (`Bun.listen()`, `Bun.connect()`, `Bun.udpSocket()`, `Bun.dns.lookup()`)
- `bun-bundler.md` - Bundler & Build APIs (`Bun.build()`, `Bun.plugin()`, `Bun.Transpiler()`, `Bun.FileSystemRouter()`)
- `bun-database.md` - Database APIs (`bun:sqlite`, `Bun.SQL`, `Bun.RedisClient`)
- `bun-hashing-crypto.md` - Hashing & Crypto APIs (`Bun.password`, `Bun.hash()`, `Bun.CryptoHasher()`, `Bun.sha`)
- `bun-utilities.md` - Utilities APIs (`Bun.sleep()`, `Bun.nanoseconds()`, `Bun.which()`, `Bun.peek()`, etc.)
- `bun-compression.md` - Compression APIs (`Bun.gzipSync()`, `Bun.deflateSync()`, `Bun.zstdCompressSync()`)
- `bun-streams.md` - Streams & Buffer APIs (`Bun.readableStreamTo*()`, `Bun.ArrayBufferSink`)
- `bun-data-parsing.md` - Data Parsing APIs (`Bun.TOML.parse()`, `Bun.markdown()`, `Bun.Glob`, `Bun.Cookie`)
- `bun-security.md` - Security APIs (`Bun.CSRF`, `HTMLRewriter`)
- `bun-ffi.md` - FFI & Low-level APIs (`bun:ffi`, `bun:jsc`, `Bun.mmap`, `Bun.gc`)
- `bun-other.md` - Other Bun APIs (`bun:test`, `Bun.env`, `Bun.version`, `Bun.resolveSync()`)
- `bun-web-apis.md` - Web-standard APIs (`fetch`, `Worker`, `ReadableStream`, `crypto`, etc.)

## Related Skills

- `follow-runtime-bun` - Bun runtime CLI (run, install, test, build, config)

| [website.md](website.md) | Official resources and links |
| [apis/index.md](apis/index.md) | API, dependencies, and programmatic usage |