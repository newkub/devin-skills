---
name: follow-lib-effect-ts-use-platform
description: Effect Platform — FileSystem, Path, HttpServer/Client, Command, Terminal per runtime
argument-hint: "[package]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
---

## Goal

ใช้ `@effect/platform-*` abstractions — FileSystem, Path, HttpServer/HttpClient, Command, Socket, Terminal — แบบ runtime-agnostic

## Scope

platform services (v3: `@effect/platform`, `platform-node`, `platform-bun`, `platform-browser`, `platform-node-shared`) — API-consistent services ที่ testable ผ่าน Layer swap

## Execute

### 1. Install Per Runtime

```bash
bun i @effect/platform @effect/platform-bun      # Bun
# @effect/platform-node (Node), @effect/platform-browser (browser)
```

- ทุก service เป็น Tag — provide ด้วย runtime layer: `BunContext.layer`, `NodeContext.layer`

### 2. Core Services

```ts
import { FileSystem, Path, Command, Terminal } from "@effect/platform"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  yield* fs.writeFileString(path.join(dir, "out.txt"), data)
  const term = yield* Terminal.Terminal
  yield* term.display("done\n")
})
```

### 3. HttpServer And HttpClient

```ts
// server: HttpServer.router + HttpServer.server.serve()
const HttpLive = HttpRouter.Default.pipe(Layer.provide(BunHttpServer.layer({ port: 3000 })))
// client: HttpClient.HttpClient — request/execute, Schema decode response
```

- `HttpClient` — request building, retries, `schemaBodyJson`/`schemaNoBody` decode integration
- `HttpServer` — router groups, middleware, multipart, websockets (per-runtime support ต่างกัน)

### 4. Command And Interop

- `Command.make("bun", "x", "tsc")` — spawn processes effectfully, stdout capture
- `Socket` — tcp/ws clients; `KeyValueStore` — KV abstraction (redis/fs/memory)

### 5. Testability

- Platform services mockable ผ่าน Layer — `FileSystem` มี `FileSystem.layerNoop`/test impls
- อย่า import `fs`/`path` ตรงใน effect code — ผ่าน platform services เสมอ

## Rules

- Install platform package **ที่ตรง runtime** — `platform-node` ≠ `platform-bun` context layers
- ทุก IO (fs/http/process) ผ่าน platform service — test แทนด้วย Layer
- HttpClient reuse instance — อย่า `fetch` ตรงถ้าอยู่ใน effect world
- Check runtime support matrix — บาง service (Terminal, Socket) ไม่มีในบาง platform

## Expected Outcome

- IO ผ่าน platform services ครบ, runtime layer provide ที่ boundary
- Testable ผ่าน Layer swap — ไม่ mock module imports
