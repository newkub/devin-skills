# Core Concepts - Bun

## Overview

Bun เป็น all-in-one JavaScript runtime ที่รวม runtime, package manager, bundler, และ test runner เข้าไว้ในโปรแกรมเดียว

## Runtime

### Running JavaScript/TypeScript

```bash
bun run src/index.ts
bun run src/index.js
```

### Shebang Support

```typescript
#!/usr/bin/env bun

console.log("Hello from Bun!")
```

## Package Management

### Install Dependencies

```bash
bun add lodash
bun add -d typescript @types/node
bun add -g bun
```

### Create Project

```bash
bun init
bun create <template> <name>
```

### Lockfile

Bun ใช้ `bun.lockb` แทน `package-lock.json`

## Transpiling

Bun รองรับ TypeScript และ JSX โดยตรง:

```typescript
// src/hello.ts
export function greet(name: string): string {
  return `Hello, ${name}!`
}
```

```bash
bun run src/hello.ts
```

## HTTP Server

### Built-in HTTP

```typescript
Bun.serve({
  port: 3000,
  fetch(request) {
    return new Response("Hello Bun!")
  }
})
```

## Testing

### Using Bun Test

```typescript
import { test, expect } from "bun:test"

test("2 + 2 is 4", () => {
  expect(2 + 2).toBe(4)
})
```

```bash
bun test
```

## File System

```typescript
const file = Bun.file("package.json")
const content = await file.text()
```
