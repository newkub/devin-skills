---
title: All Features
description: ฟีเจอร์ทั้งหมดของ cargo-nextest
---

## Features

### Test Execution

- `cargo nextest run` - รัน tests ทั้งหมด
- `cargo nextest run <test-name>` - รัน test เฉพาะ
- `cargo nextest run --no-fail-fast` - ไม่หยุดเมื่อ fail
- `cargo nextest run --test-threads=<num>` - กำหนดจำนวน threads

### Filtering

- `cargo nextest run <filter>` - filter tests ด้วย pattern
- `cargo nextest run --exclude <filter>` - exclude tests
- `cargo nextest run --list` - list tests ทั้งหมด

### Output Control

- `cargo nextest run --hide-progress` - ซ่อน progress bar
- `cargo nextest run --success-output=immediate` - แสดง output ทันทีเมื่อ pass
- `cargo nextest run --failure-output=immediate-final` - แสดง output เมื่อ fail

### Configuration

- `.config/nextest.toml` - configuration file
- กำหนด test threads
- กำหนด timeouts
- กำหนด environment variables

### Integration

- `cargo llvm-cov nextest` - coverage reports
- `cargo nextest run --profile ci` - CI profile
