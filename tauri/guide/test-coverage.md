---
title: Test Coverage
description: Test coverage สำหรับ Rust และ JavaScript
---

## Rust Coverage

```bash
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

## JavaScript Coverage

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
})
```
