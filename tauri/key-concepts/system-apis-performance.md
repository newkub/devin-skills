---
title: System APIs Performance
description: Performance tips สำหรับ System APIs
---

## Batch Operations

```typescript
// Bad: Multiple individual calls
for (const file of files) {
  await readTextFile(file)
}

// Good: Batch when possible
const contents = await Promise.all(
  files.map(file => readTextFile(file))
)
```

## Caching

```typescript
const cache = new Map()

async function getCachedFile(path: string) {
  if (cache.has(path)) {
    return cache.get(path)
  }
  
  const content = await readTextFile(path)
  cache.set(path, content)
  return content
}
```

## Lazy Loading

```typescript
// Load resources only when needed
async function loadResource() {
  if (!resourceLoaded) {
    resource = await loadHeavyResource()
    resourceLoaded = true
  }
  return resource
}
```
