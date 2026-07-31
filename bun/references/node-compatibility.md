# Node.js Compatibility - Bun

## Overview

Bun provides Node.js-compatible modules prefixed with `node:` for seamless migration.

## node:fs

File system operations - Read, write, and manipulate files and directories with Node.js-compatible API.

```typescript
import { readFileSync, writeFileSync, readFile, writeFile } from "node:fs"

const content = readFileSync("file.txt")
writeFileSync("output.txt", "Hello")
```

## node:path

Path manipulation - Join, resolve, and manipulate file system paths cross-platform.

```typescript
import { join, dirname, resolve, basename } from "node:path"

const path = join(__dirname, "file.txt")
```

## node:crypto

Cryptography - Hash, HMAC, and random bytes generation for security operations.

```typescript
import { createHash, randomBytes, createHmac } from "node:crypto"

const hash = createHash("sha256").update("data").digest("hex")
```

## node:http

HTTP server - Create HTTP servers with Node.js-compatible request/response handling.

```typescript
import { createServer } from "node:http"

const server = createServer((req, res) => {
  res.writeHead(200)
  res.end("Hello")
})
```

## node:https

HTTPS server - Create HTTPS servers with TLS support for secure communication.

```typescript
import { createServer } from "node:https"
```

## node:events

Event emitter - Event-driven architecture with EventEmitter for custom events.

```typescript
import { EventEmitter } from "node:events"

const emitter = new EventEmitter()
emitter.on("event", () => {})
```

## node:stream

Streams - Process data in chunks with readable, writable, and transform streams.

```typescript
import { Readable, Writable, Transform } from "node:stream"
```

## node:util

Utilities - Promisify callback functions and inspect objects for debugging.

```typescript
import { promisify, inspect } from "node:util"
```

## node:url

URL parsing - Parse and format URLs with query string and fragment handling.

```typescript
import { parse, format } from "node:url"
```

## node:os

Operating system - Get system information like platform, architecture, CPU cores, and memory.

```typescript
import { platform, arch, cpus, totalmem } from "node:os"
```

## node:buffer

Buffer - Binary data manipulation with Buffer for encoding/decoding operations.

```typescript
import { Buffer } from "node:buffer"

const buf = Buffer.from("hello")
```

---

**See also:**
- [Node.js Compatibility](https://bun.sh/docs/runtime/nodejs-apis)
