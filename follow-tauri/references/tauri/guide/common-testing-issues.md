---
title: Common Testing Issues
description: ปัญหาทั่วไปในการทดสอบและวิธีแก้ไข
---

## Async Tests

```typescript
test('async operation', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})
```

## Timeout Issues

```typescript
test('slow operation', async () => {
  const result = await slowFunction()
  expect(result).toBe('expected')
}, 10000) // 10 second timeout
```

## Platform-Specific Tests

```rust
#[cfg(target_os = "windows")]
#[test]
fn test_windows_only() {
    // Windows-specific test
}
```
