# Test Groups

## Definition

Test groups คือการจัดกลุ่ม tests เพื่อ:
- Run เฉพาะกลุ่มที่ต้องการ
- จัดลำดับความสำคัญของ tests
- จัดการ dependencies ระหว่าง tests
- Optimize execution time

## Nextest Test Groups

### Group Definition

```toml
# .config/nextest.toml
[[profile.default.group]]
name = "fast"
max_threads = 8

[[profile.default.group]]
name = "slow"
max_threads = 2
```

### Group Assignment

```rust
#[test]
#[nextest::group(fast)]
fn test_fast_operation() {
    // Fast test
}

#[test]
#[nextest::group(slow)]
fn test_slow_operation() {
    // Slow test
}
```

## Group Strategies

### By Speed

```toml
[[profile.default.group]]
name = "fast"
max_threads = 8

[[profile.default.group]]
name = "slow"
max_threads = 2
```

### By Importance

```toml
[[profile.default.group]]
name = "critical"
max_threads = 4

[[profile.default.group]]
name = "non-critical"
max_threads = 8
```

### By Resource

```toml
[[profile.default.group]]
name = "io-heavy"
max_threads = 2

[[profile.default.group]]
name = "cpu-heavy"
max_threads = 8
```

## Running Groups

```bash
# Run specific group
cargo nextest run --group fast

# Run multiple groups
cargo nextest run --group fast --group slow

# Exclude group
cargo nextest run --exclude-group slow
```

## Best Practices

1. **Logical Grouping**: Group tests ตาม logic
2. **Resource Awareness**: จัด groups ตาม resource usage
3. **Critical Tests**: Prioritize critical tests
4. **Parallel Optimization**: Adjust threads per group
5. **Documentation**: Document group purposes
