# Key Concept

## What is Zig?

Zig เป็น general-purpose programming language ที่พัฒนาโดย Andrew Kelley เน้นหลัก 3 อย่าง:
- **Simplicity**: ไม่มี hidden control flow, hidden memory allocations, ไม่มี preprocessor
- **Performance**: Zero-cost abstractions, explicit control ทุกอย่าง
- **Safety**: Memory safety ที่ชัดเจนผ่าน comptime และ explicit allocations

## Core Features

- **No Hidden Control Flow**: ไม่มี ทุกอย่างเขียนอย่างชัดเจน
- **Comptime**: Compile-time code execution สำหรับ metaprogramming
- **Explicit Memory Allocation**: ควบคุม allocation ได้เองผ่าน allocators
- **Optional Types**: `?T` สำหรับ nullable types
- **Error Unions**: `anyerror!T` สำหรับ error handling
- **Defer**: Resource cleanup ที่ชัดเจน
- **Cross-compilation**: รองรับหลาย platforms
- **C Interop**: เรียก C libraries ได้โดยตรง

## When to Use

- Systems programming (OS, drivers, embedded systems)
- Game development และ game engines
- CLI tools และ command-line applications
- WebAssembly development
- C/C++ interoperability
- โปรเจกต์ที่ต้องการ control สูงและ zero hidden costs

## Zig vs Other Languages

| Feature | Zig | C/C++ | Rust | Go |
|---------|-----|-------|------|-----|
| Memory Safety | Manual + Comptime | Manual | Borrow checker | GC |
| Hidden Control Flow | None | Some | None | Some |
| Comptime | Yes | No | No (const fn) | No |
| Learning Curve | Moderate | Steep | Steep | Easy |
| Build System | Built-in | Make/CMake | Cargo | Go modules |
| Cross-compilation | Native | Manual | Cargo | GOOS/GOARCH |

## Design Philosophy

### No Hidden Costs

```zig
// Zig: ชัดเจน
const array = try allocator.alloc(u32, 10);
defer allocator.free(array);

// ไม่มี hidden allocations, ไม่มี hidden control flow
```

### Explicit is Better than Implicit

```zig
// Error handling ต้องจัดการ explicitly
const result = try someFunction();

// Optional ต้อง unwrap
const value: ?i32 = getOptional();
if (value) |v| {
    // use v
}
```

### Comptime = Power

```zig
const fibonacci = comptime fib(10);
// คำนวณตอน compile time
```

## Key Concepts Overview

| Concept | Description |
|---------|-------------|
| Comptime | Compile-time execution, lazy evaluation, type manipulation |
| Allocator | Memory allocation patterns, GeneralPaiAllocator, ArenaAllocator |
| Error Handling | Error unions, error sets, try/catch |
| Optional Types | Nullable types with `?T` syntax |
| Defer | Guaranteed cleanup on scope exit |
| Slices | View into arrays with bounds checking |
| Unions | Tagged unions for type-safe variants |