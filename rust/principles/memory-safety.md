# Memory Safety Principles

## Goal

ทำความเข้าใจและใช้งาน memory safety ใน Rust อย่างถูกต้อง

## Core Principles

### 1. Ownership Guarantees

- **Single Owner** - ทุกค่ามี owner เดียวเสมอ
- **Automatic Cleanup** - เมื่อ owner ออกจาก scope ค่าจะถูก drop อัตโนมัติ
- **No Dangling Pointers** - compiler ป้องกัน dangling pointers อัตโนมัติ

### 2. Borrowing Rules

- **Multiple Readers** - สามารถมี immutable references หลายตัวพร้อมกัน
- **Single Writer** - สามารถมี mutable reference เพียงตัวเดียว
- **No Mutation While Borrowed** - ไม่สามารถ mutate ขณะที่มี active references

### 3. Lifetime Management

- **Explicit Lifetimes** - ระบุ lifetime เมื่อ compiler ไม่สามารถ infer ได้
- **Lifetime Elision** - compiler จะ infer lifetimes ใน patterns ที่พบบ่อย
- **Lifetime Subtyping** - lifetime ที่ยาวกว่าสามารถ coerce เป็นที่สั้นกว่าได้

## Best Practices

### Use References Instead of Cloning

```rust
// ❌ Bad: Unnecessary cloning
fn process(data: Vec<i32>) -> i32 {
    data.iter().sum()
}

// ✅ Good: Use reference
fn process(data: &[i32]) -> i32 {
    data.iter().sum()
}
```

### Prefer Borrowing Over Ownership Transfer

```rust
// ❌ Bad: Ownership transfer
fn modify(mut data: Vec<i32>) -> Vec<i32> {
    data.push(42);
    data
}

// ✅ Good: Borrowing
fn modify(data: &mut Vec<i32>) {
    data.push(42);
}
```

### Use Smart Pointers Appropriately

```rust
// Box<T> - Single ownership, heap allocation
let boxed = Box::new(5);

// Rc<T> - Multiple ownership, single-threaded
use std::rc::Rc;
let shared = Rc::new(5);

// Arc<T> - Multiple ownership, multi-threaded
use std::sync::Arc;
let shared = Arc::new(5);
```

## Common Pitfalls

### 1. Dangling References

```rust
// ❌ Compile error: dangling reference
fn bad() -> &String {
    let s = String::from("hello");
    &s  // s is dropped here
}
```

### 2. Data Races

```rust
// ❌ Compile error: data race prevented
use std::thread;

fn bad() {
    let mut data = vec![1, 2, 3];
    let handle = thread::spawn(|| {
        data.push(4);  // Error: data may be invalid
    });
    data.push(5);
    handle.join().unwrap();
}
```

### 3. Iterator Invalidation

```rust
// ❌ Compile error: iterator invalidation
fn bad() {
    let mut vec = vec![1, 2, 3];
    for item in &vec {
        vec.push(4);  // Error: cannot mutate while iterating
    }
}
```

## Expected Outcome

- Memory safety ที่รับประกันโดย compiler
- ไม่มี null pointer dereferences
- ไม่มี dangling pointers
- ไม่มี data races
- Memory leaks ลดลงอย่างมาก
- Code ที่ปลอดภัยและ performant
