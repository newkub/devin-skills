# Web APIs - Bun

## Overview

Bun implements standard Web APIs for compatibility with browser environments.

## Globals

Global variables and classes available in Bun's global scope for web standard compatibility.

| Variable | Type | Description |
|----------|------|-------------|
| `globalThis` | object | Global scope |
| `process` | object | Node.js compatible |
| `console` | object | Console API |
| `fetch` | function | Web fetch API |
| `Request` | class | Web Request |
| `Response` | class | Web Response |
| `URL` | class | URL handling |
| `Blob` | class | Binary data |
| `TextEncoder` | class | Text encoding |
| `TextDecoder` | class | Text decoding |
| `WebSocket` | class | WebSocket |
| `EventSource` | class | Server-sent events |
| `FormData` | class | Form data |
| `Headers` | class | HTTP headers |
| `AbortController` | class | Abort control |
| `AbortSignal` | class | Abort signal |
| `crypto` | object | Web Crypto API |
| `performance` | object | Performance API |
| `structuredClone` | function | Structured clone |

## fetch

HTTP client - Make HTTP requests with the standard fetch API for REST APIs and data fetching.

```typescript
const response = await fetch("https://api.example.com")
const data = await response.json()
```

## WebSocket

WebSocket client/server - Real-time bidirectional communication for live updates and chat applications.

```typescript
const ws = new WebSocket("ws://localhost:8080")
ws.onmessage = (event) => console.log(event.data)
```

## EventSource

Server-sent events - Receive server push events for real-time data streams.

```typescript
const es = new EventSource("https://example.com/events")
es.onmessage = (event) => console.log(event.data)
```

## FormData

Form data - Build and manipulate form data for HTTP requests with multipart support.

```typescript
const form = new FormData()
form.append("name", "value")
```

## Headers

HTTP headers - Manage HTTP request and response headers with standard API.

```typescript
const headers = new Headers()
headers.set("Content-Type", "application/json")
```

## AbortController

Abort control - Cancel fetch requests and async operations with signal-based cancellation.

```typescript
const controller = new AbortController()
fetch(url, { signal: controller.signal })
controller.abort()
```

## crypto

Web Crypto API - Cryptographic operations for hashing, encryption, and secure random generation.

```typescript
const hash = await crypto.subtle.digest("SHA-256", data)
```

## performance

Performance API - Measure execution time and performance metrics for optimization.

```typescript
const start = performance.now()
// ... code ...
const end = performance.now()
console.log(`Took ${end - start}ms`)
```

---

**See also:**
- [Web APIs Documentation](https://bun.sh/docs/runtime/web-apis)
