---
title: Testing Configuration
description: Configuration สำหรับ testing และ CI/CD
---

## Tauri Configuration for Testing

```json
// tauri.conf.json
{
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all"
    }
  }
}
```

## CI/CD Configuration

**GitHub Actions**

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: dtolnay/rust-toolchain@stable
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test
      
      - name: Run Rust tests
        run: cargo test
```
