---
title: Configuration
description: การตั้งค่า cargo-nextest
---

## Configuration File

สร้าง `.config/nextest.toml` ที่ root ของ project

## Basic Configuration

```toml
[profile.default]
# จำนวน threads สำหรับ parallel execution
test-threads = "num-cpus"

# timeout สำหรับแต่ละ test
slow-timeout = "60s"

# แสดง output เมื่อ test สำเร็จ
success-output = "immediate"

# แสดง output เมื่อ test fail
failure-output = "immediate-final"
```

## CI Profile

```toml
[profile.ci]
# ใช้ threads น้อยลงสำหรับ CI
test-threads = 4

# ไม่แสดง progress bar
hide-progress-bar = true

# fail-fast เปิดใช้
fail-fast = true
```

## Environment Variables

```toml
[env]
RUST_LOG = "debug"
RUST_BACKTRACE = "1"
```

## Per-Test Configuration

```toml
[[profile.default.overrides]]
filter = "test::slow"
slow-timeout = "300s"
```
