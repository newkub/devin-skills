---
title: Quick Start
description: เริ่มต้นใช้งาน cargo-nextest
---

## Basic Usage

### 1. Run All Tests

```bash
cargo nextest run
```

### 2. Run Specific Test

```bash
cargo nextest run test_name
```

### 3. Run Tests in Specific Crate

```bash
cargo nextest run -p crate_name
```

### 4. Run with Coverage

```bash
cargo llvm-cov nextest
```

### 5. Run Doctests (Separate)

```bash
cargo test --doc
```

## Common Patterns

### Run Tests Matching Pattern

```bash
cargo nextest run "test::module::*"
```

### Exclude Tests

```bash
cargo nextest run --exclude "test::slow::*"
```

### List All Tests

```bash
cargo nextest run --list
```

## Integration with CI

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: cargo nextest run --profile ci
```
