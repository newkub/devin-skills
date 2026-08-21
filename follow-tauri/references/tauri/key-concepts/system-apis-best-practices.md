---
title: System APIs Best Practices
description: Best practices สำหรับ System APIs
---

## Error Handling

```typescript
try {
  const content = await readTextFile('path/to/file.txt')
  console.log(content)
} catch (error) {
  console.error('Failed to read file:', error)
}
```

## Async Operations

```typescript
// Always use await for async operations
const content = await readTextFile('path/to/file.txt')
```

## Path Resolution

```typescript
import { join } from '@tauri-apps/api/path'

const appDir = await appDir()
const filePath = await join(appDir, 'data.txt')
```

## Resource Cleanup

```typescript
// Always cleanup event listeners
const unlisten = await listen('event', handler)
// Later
unlisten()
```
