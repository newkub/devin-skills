# Global APIs - Bun

## Overview

Bun provides native APIs on the `Bun` global object, heavily optimized for common functionality.

## Bun.serve

HTTP/HTTPS server - Create a high-performance web server with support for HTTP, HTTPS, WebSocket, and custom routing.

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(request) { return new Response("Hello Bun!") }
})
```

| Option | Type | Description |
|--------|------|-------------|
| `port` | number | Port to listen on |
| `hostname` | string | Hostname to bind |
| `tls` | object | TLS configuration |
| `fetch` | function | Request handler |
| `websocket` | object | WebSocket handler |
| `development` | boolean | Development mode |
| `baseURL` | string | Base URL for routing |
| `maxRequestBodySize` | number | Max request body size |
| `lowLatency` | boolean | Low latency mode |

## Bun.file

File reader - Efficiently read files with support for text, JSON, and binary data. Provides file metadata like size and type.

```typescript
const file = Bun.file("data.json")
const content = await file.text()
const json = await file.json()
const size = file.size
const type = file.type
```

## Bun.write

Write to file - Write text, JSON, or binary data to files asynchronously with high performance.

```typescript
await Bun.write("output.txt", "Hello!")
await Bun.write("output.json", JSON.stringify(data))
await Bun.write("output.bin", buffer)
```

## Bun.password

Password hashing and verification - Securely hash passwords using bcrypt and verify them against stored hashes.

```typescript
const hash = await Bun.password.hash("secret")
const isValid = await Bun.password.verify("secret", hash)
```

## Bun.listen

TCP server - Create a TCP server for custom protocols and Unix domain sockets.

```typescript
const server = Bun.listen({
  socket: "/tmp/bun.sock",
  data(socket) {
    socket.write("Hello!")
  }
})
```

## Bun.connect

TCP client - Connect to TCP servers for custom protocols and network communication.

```typescript
const socket = await Bun.connect({
  hostname: "localhost",
  port: 8080,
  data(socket) {
    socket.write("Hello!")
  }
})
```

## Bun.udpSocket

UDP socket - Create UDP sockets for connectionless protocols and datagram communication.

```typescript
const socket = Bun.udpSocket({
  data: (buf, addr) => {
    console.log("Received:", buf)
  }
})
socket.bind(8080)
```

## Bun.sleep

Async sleep - Pause execution for a specified duration in milliseconds or human-readable format (e.g., '1s').

```typescript
await Bun.sleep(1000) // Sleep 1 second
await Bun.sleep("1s")  // Sleep 1 second
```

## Bun.spawn

Spawn subprocess - Execute external commands and manage their I/O streams and exit codes.

```typescript
const proc = Bun.spawn({
  cmd: ["ls", "-la"],
  stdout: "pipe",
  stderr: "pipe"
})
await proc.exited
```

## Bun.which

Find executable - Locate the absolute path of a command in the system PATH.

```typescript
const nodePath = Bun.which("node")
```

## Bun.version

Bun version - Get the current Bun runtime version string.

```typescript
console.log(Bun.version)
```

## Bun.env

Environment variables - Access environment variables with automatic .env file loading support.

```typescript
const apiKey = Bun.env.API_KEY
```

## Bun.main

Entry point path - Get the absolute path of the main entry point file being executed.

```typescript
console.log(Bun.main)
```

## Bun.deepEquals

Deep equality check - Compare objects and arrays recursively for structural equality.

```typescript
const isEqual = Bun.deepEquals(obj1, obj2)
```

## Bun.peek

Peek at value - Read a value without triggering lazy evaluation or side effects.

```typescript
const value = Bun.peek(obj)
```

## Bun.escapeHTML

Escape HTML - Escape HTML entities to prevent XSS attacks in user-generated content.

```typescript
const safe = Bun.escapeHTML("<script>alert('xss')</script>")
```

## Bun.randomUUIDv7

Generate UUID - Generate a UUID v7 (time-ordered) for unique identifiers.

```typescript
const uuid = Bun.randomUUIDv7()
```

## Bun.hash

Fast hash function - Compute a fast hash for strings and objects using a non-cryptographic algorithm.

```typescript
const hash = Bun.hash("data")
```

## Bun.CryptoHasher

Custom hashing - Create a streaming hash for cryptographic operations with incremental updates.

```typescript
const hasher = new Bun.CryptoHasher("sha256")
hasher.update("data")
const hash = hasher.digest()
```

---

**See also:**
- [Official API Docs](https://bun.sh/docs/runtime/bun-apis)
