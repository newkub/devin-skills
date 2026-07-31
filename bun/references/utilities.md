# Utilities - Bun

## Overview

Bun provides utility APIs for common operations.

## File I/O

| API | Description |
|-----|-------------|
| `Bun.file(path)` | Create a file reader |
| `Bun.write(path, data)` | Write to file |
| `Bun.stdin` | Standard input |
| `Bun.stdout` | Standard output |
| `Bun.stderr` | Standard error |
| `Bun.read(path)` | Read file content |
| `Bun.readSync(path)` | Synchronous read |
| `Bun.exists(path)` | Check if file exists |
| `Bun.glob(pattern)` | Glob pattern matching |

## Networking

| API | Description |
|-----|-------------|
| `Bun.serve()` | HTTP/HTTPS server |
| `Bun.listen()` | TCP server |
| `Bun.connect()` | TCP client |
| `Bun.udpSocket()` | UDP socket |
| `Bun.dns.lookup()` | DNS lookup |
| `Bun.resolve()` | DNS resolve |

## Shell

```typescript
const result = await $`ls -la`
console.log(result.stdout)
console.log(result.exitCode)
```

## Hashing

| API | Description |
|-----|-------------|
| `Bun.hash()` | Fast hash function |
| `Bun.password.hash()` | Password hashing |
| `Bun.password.verify()` | Verify password |
| `Bun.CryptoHasher` | Custom hashing |

## Utilities

| API | Description |
|-----|-------------|
| `Bun.version` | Bun version string |
| `Bun.env` | Environment variables |
| `Bun.main` | Entry point path |
| `Bun.sleep()` | Async sleep |
| `Bun.randomUUIDv7()` | Generate UUID |
| `Bun.which()` | Find executable |
| `Bun.deepEquals()` | Deep equality check |
| `Bun.peek()` | Peek at value |
| `Bun.escapeHTML()` | Escape HTML |
| `Bun.semver` | Semver utilities |
| `Bun.inspect()` | Object inspection |
| `Bun.format()` | String formatting |

## Compression

| API | Description |
|-----|-------------|
| `Bun.gzipSync()` | Gzip compress |
| `Bun.gunzipSync()` | Gzip decompress |
| `Bun.deflateSync()` | Deflate compress |
| `Bun.inflateSync()` | Deflate decompress |
| `Bun.brotliCompressSync()` | Brotli compress |
| `Bun.brotliDecompressSync()` | Brotli decompress |

---

**See also:**
- [Global APIs](./global-apis.md)
