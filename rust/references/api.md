# Rust API Reference

## Standard Library

### Core Modules

| Module | Description |
|--------|-------------|
| `std::collections` | Collections (Vec, HashMap, HashSet) |
| `std::fs` | File system operations |
| `std::io` | Input/output operations |
| `std::net` | Networking primitives |
| `std::thread` | Threading and concurrency |
| `std::sync` | Synchronization primitives |
| `std::time` | Time utilities |
| `std::path` | Path manipulation |

### Common Types

| Type | Module | Description |
|------|--------|-------------|
| `Vec<T>` | std::vec | Dynamic array |
| `HashMap<K, V>` | std::collections | Hash map |
| `String` | std::string | UTF-8 string |
| `Option<T>` | std::option | Optional value |
| `Result<T, E>` | std::result | Error handling |
| `Box<T>` | std::boxed | Heap allocation |
| `Rc<T>` | std::rc | Reference counting |
| `Arc<T>` | std::sync | Thread-safe reference counting |
| `Mutex<T>` | std::sync | Mutual exclusion |
| `RwLock<T>` | std::sync | Read-write lock |

## Common Traits

| Trait | Description |
|-------|-------------|
| `Display` | String formatting |
| `Debug` | Debug formatting |
| `Clone` | Explicit cloning |
| `Copy` | Implicit copying |
| `Drop` | Destructor |
| `Iterator` | Iteration |
| `IntoIterator` | Conversion to iterator |
| `From<T>` | Conversion from T |
| `Into<T>` | Conversion to T |
| `AsRef<T>` | Cheap reference conversion |
| `Borrow<T>` | Borrowing semantics |
| `Default` | Default value |
| `Eq` / `PartialEq` | Equality comparison |
| `Ord` / `PartialOrd` | Ordering comparison |
| `Hash` | Hashing |
| `Send` | Thread-safe transfer |
| `Sync` | Thread-safe sharing |

## Common Macros

| Macro | Description |
|-------|-------------|
| `println!` | Print to stdout |
| `eprintln!` | Print to stderr |
| `vec!` | Create vector |
| `format!` | Format string |
| `panic!` | Panic with message |
| `assert!` | Assertion |
| `assert_eq!` | Equality assertion |
| `unreachable!` | Unreachable code |
| `todo!` | Unimplemented code |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| Rust Standard Library | https://doc.rust-lang.org/std/ | Official std documentation |
| Rust API Guidelines | https://rust-lang.github.io/api-guidelines/ | API design guidelines |
