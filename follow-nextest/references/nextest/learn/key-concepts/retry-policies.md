# Retry Policies

## Definition

Retry policies คือการกำหนดวิธี retry tests ที่ fail:
- Retry อัตโนมัติเมื่อ test fail
- กำหนดจำนวน retry สูงสุด
- กำหนดเงื่อนไข retry
- ลด false positives

## Nextest Retry

### Configuration

```toml
# .config/nextest.toml
[profile.default]
retry = 2  # Retry up to 2 times
```

### Per-Test Retry

```rust
#[test]
#[nextest::retry(3)]
fn test_flaky_operation() {
    // Retry up to 3 times
}
```

## Retry Strategies

### Fixed Retry

```toml
[profile.default]
retry = 2  # Always retry 2 times
```

### Conditional Retry

```rust
#[test]
#[nextest::retry(flaky)]
fn test_network_operation() {
    // Retry only if marked as flaky
}
```

### No Retry

```rust
#[test]
#[nextest::retry(0)]
fn test_critical_operation() {
    // No retry
}
```

## When to Use Retry

### Flaky Tests
- Tests ที่ fail บางครั้ง
- Network-dependent tests
- Timing-dependent tests
- External service tests

### Not for Real Failures
- ไม่ retry tests ที่ fail จริง
- ไม่ retry logic errors
- ไม่ retry assertion failures

## Best Practices

1. **Use Sparingly**: Retry เฉพาะจำเป็น
2. **Fix Root Cause**: แก้ flaky tests ไม่ใช่ retry
3. **Document Reasons**: Document ทำไมต้อง retry
4. **Monitor Retries**: Track retry rates
5. **Limit Retries**: จำกัดจำนวน retry
