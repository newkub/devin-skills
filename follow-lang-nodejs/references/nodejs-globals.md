# Node.js Global Objects and Utilities

## Overview

Node.js provides global objects and utilities available without importing modules. This reference covers globals, timers, constants, and type definitions.

## Global Objects

### process

Process information and control.

```typescript
process.cwd()                    // Current working directory
process.exit()                   // Exit process
process.env                      // Environment variables
process.argv                      // Command line arguments
process.version                  // Node version
process.platform                 // Platform (win32, linux, darwin)
process.arch                     // Architecture (x64, arm64)
```

### globalThis

Global scope equivalent across environments.

```typescript
globalThis.console
globalThis.setTimeout
globalThis.setInterval
```

### console

Console output operations.

```typescript
console.log("info")
console.error("error")
console.warn("warning")
console.debug("debug")
console.table(data)
console.time("label")
console.timeEnd("label")
```

### Fetch API (v18+)

Web-compatible fetch API.

```typescript
const response = await fetch("https://api.example.com")
const data = await response.json()
```

## Timers

```typescript
setTimeout(() => {}, 1000)
setInterval(() => {}, 1000)
setImmediate(() => {})
clearTimeout(id)
clearInterval(id)
clearImmediate(id)
```

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `undefined` | undefined | Undefined value |
| `NaN` | NaN | Not a Number |
| `Infinity` | Infinity | Infinity |
| `Symbol()` | symbol | Symbol |

## Type Definitions

Install Node.js types:

```bash
bun add -D @types/node
```

---

See also:
- [Official API Docs](https://nodejs.org/api/)
- [Globals](https://nodejs.org/api/globals.html)
- [Modules](https://nodejs.org/api/modules.html)
