---
title: Performance Issues
description: การแก้ปัญหา performance issues ที่พบบ่อย
---

## Issue: High CPU usage

**Cause**: Infinite loops หรือ inefficient code

**Solution**:
```rust
// Bad: Busy wait
while !condition {
    // Do nothing
}

// Good: Async wait
while !condition {
    tokio::time::sleep(Duration::from_millis(100)).await;
}
```

## Issue: High memory usage

**Cause**: Memory leaks หรือ large allocations

**Solution**:
```rust
// Use weak references
use std::sync::{Arc, Weak};

struct MyStruct {
    data: Vec<u8>,
}

// Cleanup when done
drop(my_struct);
```
