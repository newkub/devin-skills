# Test Isolation

## Definition

Test isolation คือการทำให้แต่ละ test ทำงานแยกกันโดยสมบูรณ์:
- ไม่ share state ระหว่าง tests
- ไม่มี side effects ระหว่าง tests
- ทำงานได้ parallel โดยไม่ขัดแย้ง
- ลด flaky tests

## Why Test Isolation?

### Benefits
- **Reliability**: Tests ไม่ flaky เพราะไม่มี interference
- **Parallel Execution**: Run tests พร้อมกันได้
- **Debugging**: Debug ง่ายขึ้นเพราะแต่ละ test independent
- **Reproducibility**: Results สม่ำเสมอ
- **Speed**: Parallel execution = faster test runs

## Nextest Approach

### Per-Test Isolation
Nextest ใช้ per-test isolation:
- แต่ละ test ทำงานใน process แยกกัน
- Isolate file system operations
- Isolate environment variables
- Isolate global state

### Binary Partitioning
- Group tests ด้วย binary partitioning
- Balance load ข้าม cores
- Optimize parallel execution
- Reduce idle time

## Common Issues

### Shared State

❌ **Bad:**
```rust
static mut COUNTER: i32 = 0;

#[test]
fn test_increment() {
    unsafe { COUNTER += 1; }
    assert_eq!(unsafe { COUNTER }, 1);
}
```

✅ **Good:**
```rust
#[test]
fn test_increment() {
    let mut counter = 0;
    counter += 1;
    assert_eq!(counter, 1);
}
```

### File System

❌ **Bad:**
```rust
#[test]
fn test_write_file() {
    std::fs::write("test.txt", "data").unwrap();
    // May conflict with other tests
}
```

✅ **Good:**
```rust
#[test]
fn test_write_file() {
    let temp_dir = tempfile::tempdir().unwrap();
    let file_path = temp_dir.path().join("test.txt");
    std::fs::write(&file_path, "data").unwrap();
    // Isolated to temp directory
}
```

### Environment Variables

❌ **Bad:**
```rust
#[test]
fn test_env_var() {
    std::env::set_var("TEST_VAR", "value");
    // Affects other tests
}
```

✅ **Good:**
```rust
#[test]
fn test_env_var() {
    // Use test-specific config
    let config = Config::with_env("TEST_VAR", "value");
    // Isolated configuration
}
```

## Best Practices

1. **Avoid Global State**: ไม่ใช้ static mutable variables
2. **Use Temp Directories**: ใช้ tempfile สำหรับ file operations
3. **Reset State**: Reset state ก่อนและหลัง test
4. **Mock Dependencies**: Mock external dependencies
5. **Independent Tests**: แต่ละ test ควร standalone
6. **Test Order Independence**: Tests ไม่ควรพึ่งพา order
