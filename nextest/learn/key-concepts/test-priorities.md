# Test Priorities

## Overview

Test Priorities เป็น feature ของ Nextest ที่ช่วยให้ control execution order ของ tests โดยกำหนด priority levels สำหรับ tests ต่างๆ

## Why Test Priorities?

การกำหนด priorities มีประโยชน์หลายอย่าง:

- **Faster Feedback**: Run tests ที่สำคัญก่อนเพื่อได้ feedback เร็วขึ้น
- **Resource Optimization**: Run tests ที่ใช้ resources น้อยก่อน
- **Dependency Management**: Run tests ที่ไม่มี dependencies ก่อน
- **CI Efficiency**: Fail fast ด้วยการ run critical tests ก่อน

## Priority Levels

Nextest รองรับ priority levels ต่อไปนี้:

| Priority | Description | Use Case |
|----------|-------------|----------|
| `high` | Run first | Critical tests, smoke tests |
| `medium` | Run second | Integration tests |
| `low` | Run last | Slow tests, optional tests |

## Configuration

ตั้งค่า priorities ผ่าน configuration:

```toml
# .config/nextest.toml
[[profile.default.overrides]]
filter = "test(smoke_)"
priority = "high"

[[profile.default.overrides]]
filter = "test(integration_)"
priority = "medium"

[[profile.default.overrides]]
filter = "test(slow_)"
priority = "low"
```

## Execution Order

```
┌─────────────────────────────────────────┐
│  Test Execution with Priorities         │
│                                         │
│  Phase 1: High Priority Tests           │
│  ├─ smoke_test_1                       │
│  ├─ smoke_test_2                       │
│  └─ smoke_test_3                       │
│                                         │
│  Phase 2: Medium Priority Tests        │
│  ├─ integration_test_1                  │
│  ├─ integration_test_2                  │
│  └─ integration_test_3                  │
│                                         │
│  Phase 3: Low Priority Tests           │
│  ├─ slow_test_1                        │
│  ├─ slow_test_2                        │
│  └─ slow_test_3                        │
└─────────────────────────────────────────┘
```

## Use Cases

### 1. Smoke Tests First

```toml
# .config/nextest.toml
[[profile.default.overrides]]
filter = "test(smoke_)"
priority = "high"
```

```rust
#[test]
fn smoke_test_basic_functionality() {
    // Critical basic functionality test
}

#[test]
fn smoke_test_api_connectivity() {
    // API connectivity test
}
```

### 2. Fast Tests Before Slow Tests

```toml
# .config/nextest.toml
[[profile.default.overrides]]
filter = "test(fast_)"
priority = "high"

[[profile.default.overrides]]
filter = "test(slow_)"
priority = "low"
```

```rust
#[test]
fn fast_test_unit() {
    // Fast unit test
}

#[test]
fn slow_test_integration() {
    // Slow integration test
}
```

### 3. Critical Path Tests

```toml
# .config/nextest.toml
[[profile.default.overrides]]
filter = "test(critical_)"
priority = "high"

[[profile.default.overrides]]
filter = "not test(critical_)"
priority = "medium"
```

```rust
#[test]
fn critical_test_payment_processing() {
    // Critical payment processing test
}

#[test]
fn critical_test_user_authentication() {
    // Critical authentication test
}
```

## Priority with Test Groups

รวม priorities กับ test groups สำหรับ control ที่ละเอียดยิ่งขึ้น:

```toml
# .config/nextest.toml
[groups]
critical = { max_fail = 1 }

[[test-groups]]
name = "critical"
filter = "test(critical_)"

[[profile.default.overrides]]
filter = "test(critical_)"
priority = "high"
```

## Priority with Retry Policies

รวม priorities กับ retry policies:

```toml
# .config/nextest.toml
[profile.default]
retries = 2

[[profile.default.overrides]]
filter = "test(critical_)"
priority = "high"
retries = 0  # Don't retry critical tests

[[profile.default.overrides]]
filter = "test(flaky_)"
priority = "low"
retries = 5  # Retry flaky tests more
```

## Best Practices

### 1. Naming Convention

ใช้ naming convention ที่ชัดเจนสำหรับ priorities:

```rust
#[test]
fn high_priority_smoke_test() {
    // High priority smoke test
}

#[test]
fn medium_priority_integration_test() {
    // Medium priority integration test
}

#[test]
fn low_performance_benchmark() {
    // Low priority benchmark
}
```

### 2. Profile-Specific Priorities

ตั้งค่า priorities ที่แตกต่างสำหรับ profiles ต่างๆ:

```toml
# Local: Run all tests
[profile.default]
# No priority overrides

# CI: Run critical tests first
[profile.ci]
[[profile.ci.overrides]]
filter = "test(critical_)"
priority = "high"
```

### 3. Fail Fast with High Priority

ใช้ `fail-fast` กับ high priority tests:

```toml
# .config/nextest.toml
[profile.ci]
fail-fast = true

[[profile.ci.overrides]]
filter = "test(critical_)"
priority = "high"
```

### 4. Measure Impact

Track impact ของ priorities ด้วย timing:

```bash
# Run with timing
cargo nextest run --profile ci --hide-progress-bar

# Compare execution times
cargo nextest run --profile ci --final-status-level pass
```

## Advanced Configuration

### Dynamic Priority Assignment

ใช้ filter expressions ที่ซับซ้อน:

```toml
# .config/nextest.toml
[[profile.default.overrides]]
filter = "test(smoke_) or test(critical_)"
priority = "high"

[[profile.default.overrides]]
filter = "test(integration_) and not test(slow_)"
priority = "medium"

[[profile.default.overrides]]
filter = "test(slow_) or test(benchmark_)"
priority = "low"
```

### Priority-Based Thread Allocation

จัดสรร threads ตาม priorities:

```toml
# .config/nextest.toml
[profile.default]
test-threads = "num-cpus"

[[profile.default.overrides]]
filter = "test(critical_)"
priority = "high"
test-threads = 4  # Use more threads for critical tests
```

## Troubleshooting

### Priorities Not Working

ตรวจสอบ filter expressions:

```bash
# Test filter expression
cargo nextest list -E 'test(smoke_)'
```

### Tests Running in Wrong Order

ตรวจสอบ configuration:

```bash
# Show configuration
cargo nextest show-config --profile default
```

### No Performance Improvement

ตรวจสอบว่า tests มี variance ใน execution times:

```bash
# Run with timing
cargo nextest run --final-status-level slow
```

## See Also

- [Test Groups](./test-groups.md) - สำหรับ test organization
- [Retry Policies](./retry-policies.md) - สำหรับ retry logic
- [Configuration](../guide/configuration.md) - สำหรับ setup options
