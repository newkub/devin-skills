# Performance Principles - Bun

## Overview

Bun ถูกออกแบบมาเพื่อ performance สูง แต่ยังมี best practices ที่ควรปฏิบัติตาม

## Core Principles

### Use Bun APIs

```typescript
// ✅ Good
const file = Bun.file("data.json")
const content = await file.text()

// ❌ Bad
import { readFile } from "fs"
const content = await readFile("data.json", "utf-8")
```

### Zero-Config TypeScript

```typescript
// ✅ Good
bun run src/index.ts

// ❌ Bad
tsc src/index.ts && node dist/index.js
```

### Built-in Bundler

```typescript
// ✅ Good
bun build src/index.ts --outdir dist

// ❌ Bad
webpack --config webpack.config.js
```

### Optimize Dependencies

```bash
bun add lodash
bun add -d typescript @types/node
```

## Async Operations

### Use Async/Await

```typescript
// ✅ Good
async function fetchAll() {
  const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])
  return { users, posts }
}

// ❌ Bad
async function fetchAll() {
  const users = await fetchUsers()
  const posts = await fetchPosts()
  return { users, posts }
}
```

## Memory Management

### Avoid Memory Leaks

```typescript
// ✅ Good
let cache = new Map()
function setCache(key: string, value: any) {
  cache.set(key, value)
  if (cache.size > 1000) cache.clear()
}

// ❌ Bad
let cache = new Map()
function setCache(key: string, value: any) {
  cache.set(key, value)
}
```

## Caching

Bun caches dependencies automatically ไม่ต้องใช้ caching layer เพิ่ม

## Best Practices

- Profile before optimizing - ใช้ profiling tools ก่อน optimize
- Measure performance - benchmark ก่อนและหลัง optimize
- Avoid premature optimization - focus ที่ critical paths ก่อน
- Use Bun's native APIs - เร็วกว่า external libraries
- Keep dependencies minimal - ลด bundle size
