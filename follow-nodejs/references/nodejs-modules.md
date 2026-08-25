# Node.js Built-in Modules

## Overview

Node.js provides a comprehensive set of built-in modules for file system, networking, streams, cryptography, and more.

## fs - File System

```typescript
import fs from "fs"
import fs from "fs/promises"

// Sync
const content = fs.readFileSync("file.txt", "utf-8")
fs.writeFileSync("file.txt", "content")

// Async
const data = await fs.readFile("file.txt", "utf-8")
await fs.writeFile("file.txt", "content")
```

| Method | Description |
|--------|-------------|
| `readFile` | Read file |
| `writeFile` | Write file |
| `appendFile` | Append to file |
| `mkdir` | Create directory |
| `rm` | Remove file/directory |
| `readdir` | Read directory |
| `stat` | File stats |
| `exists` | Check existence |
| `copyFile` | Copy file |
| `rename` | Rename file |

## path - Path Manipulation

```typescript
import path from "path"

path.join("a", "b", "c")       // a/b/c
path.resolve("a", "b")         // Absolute path
path.dirname("/a/b/c")          // /a/b
path.basename("/a/b/c.txt")     // c.txt
path.extname("/a/b/c.txt")      // .txt
path.parse("/a/b/c.txt")        // { root, dir, base, ext, name }
```

## http / https - HTTP Server

```typescript
import http from "http"

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello")
})

server.listen(3000)
```

## url - URL Handling

```typescript
import { URL, fileURLToPath } from "url"

const url = new URL("https://example.com/path?query=1")
url.hostname    // example.com
url.pathname    // /path
url.searchParams.get("query")  // 1
```

## events - Event Emitter

```typescript
import { EventEmitter } from "events"

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter()

emitter.on("event", (data) => console.log(data))
emitter.emit("event", { value: 1 })
```

## stream - Streams

```typescript
import { Readable, Writable, Transform } from "stream"

const readable = new Readable({
  read() {
    this.push("data")
    this.push(null)
  }
})
```

## util - Utilities

```typescript
import { promisify, inspect } from "util"

const promiseFn = promisify(callbackFn)
inspect({ a: 1 })  // '{ a: 1 }'
```

## crypto - Cryptography

```typescript
import crypto from "crypto"

const hash = crypto.createHash("sha256")
hash.update("data")
console.log(hash.digest("hex"))
```

## os - Operating System

```typescript
import os from "os"

os.cpus()           // CPU info
os.freemem()        // Free memory
os.totalmem()       // Total memory
os.homedir()        // Home directory
os.tmpdir()         // Temp directory
os.platform()       // Platform
os.arch()           // Architecture
os.networkInterfaces()  // Network interfaces
```

## buffer - Binary Data

```typescript
import { Buffer } from "buffer"

const buf = Buffer.from("hello", "utf-8")
buf.toString("hex")    // 68656c6c6f
Buffer.alloc(10)       // Create buffer
```

## querystring - Query Strings

```typescript
import querystring from "querystring"

querystring.stringify({ a: 1, b: 2 })  // a=1&b=2
querystring.parse("a=1&b=2")            // { a: "1", b: "2" }
```

## child_process - Child Processes

```typescript
import { exec, spawn } from "child_process"

exec("ls -la", (err, stdout) => console.log(stdout))
spawn("node", ["script.js"], { stdio: "inherit" })
```

## worker_threads - Worker Threads

```typescript
import { Worker, parentPort } from "worker_threads"

const worker = new Worker("worker.js")
worker.postMessage({ data: 1 })
worker.on("message", (result) => console.log(result))
```

## async_hooks - Async Context

```typescript
import { async_hooks } from "async_hooks"

async_hooks.createHook({
  init(id, type) {},
  before(id) {},
  after(id) {},
  destroy(id) {}
}).enable()
```

## v8 - V8 API

```typescript
import v8 from "v8"

v8.serialize({ data: 1 })    // Serialize
v8.deserialize(buffer)       // Deserialize
v8.getHeapStatistics()        // Heap info
```

## vm - VM (Sandbox)

```typescript
import vm from "vm"

vm.runInContext("1 + 1", vm.createContext({}))
```

---

**See also:**
- [Official API Docs](https://nodejs.org/api/)
- [Modules](https://nodejs.org/api/modules.html)
