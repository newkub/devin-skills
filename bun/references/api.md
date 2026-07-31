# API Reference - Bun

## Overview

Bun provides native APIs on the `Bun` global object and built-in modules, heavily optimized for common functionality

## โครงสร้าง Directory

```
references/
├── api.md (index file)
├── global-apis.md
├── built-in-modules.md
├── node-compatibility.md
├── web-apis.md
├── cli.md
├── configuration.md
├── environment-variables.md
├── bundler.md
├── utilities.md
├── advanced-apis.md
├── http-server.md
├── shell.md
├── sqlite.md
├── test-runner.md
└── website.md
```

## หมวดหมู่ไฟล์

### Core APIs

- **Global APIs** - [global-apis.md](./global-apis.md) - Bun global object APIs (serve, file, write, password, listen, connect, udpSocket, sleep, spawn, which, version, env, main, deepEquals, peek, escapeHTML, randomUUIDv7, hash, CryptoHasher)
- **Built-in Modules** - [built-in-modules.md](./built-in-modules.md) - bun:* modules (sqlite, test, ffi)
- **Node.js Compatibility** - [node-compatibility.md](./node-compatibility.md) - node:* modules (fs, path, crypto, http, https, events, stream, util, url, os, buffer)
- **Web APIs** - [web-apis.md](./web-apis.md) - Web standard APIs (fetch, WebSocket, EventSource, FormData, Headers, AbortController, crypto, performance)

### Tooling & Configuration

- **CLI** - [cli.md](./cli.md) - CLI commands reference
- **Configuration** - [configuration.md](./configuration.md) - bunfig.toml configuration
- **Environment Variables** - [environment-variables.md](./environment-variables.md) - Environment variables
- **Bundler** - [bundler.md](./bundler.md) - Bundler reference

### Specialized Features

- **Utilities** - [utilities.md](./utilities.md) - File I/O, networking, shell, hashing, compression
- **Advanced APIs** - [advanced-apis.md](./advanced-apis.md) - Image processing, WebView, cron jobs, terminal
- **HTTP Server** - [http-server.md](./http-server.md) - HTTP server reference
- **Shell** - [shell.md](./shell.md) - Shell API reference
- **SQLite** - [sqlite.md](./sqlite.md) - SQLite reference
- **Test Runner** - [test-runner.md](./test-runner.md) - Test runner reference

### Resources

- **Website** - [website.md](./website.md) - Official resources and documentation

## Quick Reference

### Global APIs

See [global-apis.md](./global-apis.md) for complete documentation.

### Built-in Modules

See [built-in-modules.md](./built-in-modules.md) for complete documentation.

### Node.js Compatibility

See [node-compatibility.md](./node-compatibility.md) for complete documentation.

### Web APIs

See [web-apis.md](./web-apis.md) for complete documentation.

## Type Definitions

```bash
bun add -d @types/bun
```

**See also:**
- [Official API Docs](https://bun.sh/docs/runtime/bun-apis)
- [HTTP Server](https://bun.sh/docs/api/http)
- [SQLite](https://bun.sh/docs/runtime/sqlite)
- [Globals](https://bun.sh/docs/runtime/globals)
- [Web APIs](https://bun.sh/docs/runtime/web-apis)