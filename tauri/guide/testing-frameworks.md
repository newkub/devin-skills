---
title: Testing Frameworks
description: Testing frameworks สำหรับ Rust และ JavaScript
---

## Rust Testing

**Built-in Testing**
```rust
#[test]
fn test_example() {
    assert!(true);
}
```

**External Libraries**
- `cargo-nextest` - Faster test runner
- `criterion` - Benchmarking
- `proptest` - Property-based testing

## JavaScript Testing

**Vitest** (Recommended)
```bash
bun install -D vitest @vitest/ui
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom'
  }
})
```

**Jest**
```bash
bun install -D jest @types/jest
```

**React Testing Library**
```bash
bun install -D @testing-library/react @testing-library/jest-dom
```
