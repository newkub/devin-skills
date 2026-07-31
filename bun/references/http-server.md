# HTTP Server Reference - Bun

## Overview

Bun.serve provides a fast HTTP/HTTPS server.

## Basic Server

```typescript
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello Bun!")
  }
})
```

## Routing

```typescript
Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url)
    
    if (url.pathname === "/api") {
      return new Response(JSON.stringify({ data: "API" }), {
        headers: { "Content-Type": "application/json" }
      })
    }
    
    return new Response("Not Found", { status: 404 })
  }
})
```

## TLS/HTTPS

```typescript
Bun.serve({
  port: 443,
  tls: {
    cert: Bun.file("cert.pem"),
    key: Bun.file("key.pem")
  },
  fetch(req) {
    return new Response("Secure!")
  }
})
```

## WebSockets

```typescript
Bun.serve({
  port: 3000,
  fetch(req, server) {
    const upgrade = server.upgrade(req)
    if (upgrade) {
      return new Response("WebSocket upgrade")
    }
    return new Response("Not a WebSocket request")
  }
})
```

## Static Files

```typescript
Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    const file = Bun.file(`.${url.pathname}`)
    
    if (await file.exists()) {
      return new Response(file)
    }
    
    return new Response("Not Found", { status: 404 })
  }
})
```

## Configuration

```toml
[serve]
port = 3000
hostname = "localhost"
```

## Server Options

| Option | Type | Description |
|--------|------|-------------|
| `port` | number | Port to listen on |
| `hostname` | string | Hostname to bind |
| `tls` | object | TLS configuration |
| `fetch` | function | Request handler |
| `websocket` | object | WebSocket handler |
| `development` | boolean | Development mode |

---

**See also:**
- [HTTP Server Docs](https://bun.sh/docs/api/http)
