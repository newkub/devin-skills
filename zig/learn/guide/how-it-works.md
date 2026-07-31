# How It Works

## Zig Build System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Zig Build System                      │
├─────────────────────────────────────────────────────────┤
│  1. build.zig           → Build configuration            │
│  2. Zig Compiler        → Compile Zig code               │
│  3. Zig Build Executor  → Run build steps               │
│  4. Linker              → Link with system libraries   │
└─────────────────────────────────────────────────────────┘
```

## Zig Compilation Flow

```
┌─────────────────────────────────────────────────────────┐
│               Zig Compilation Pipeline                   │
├─────────────────────────────────────────────────────────┤
│  1. Parse            → AST (Abstract Syntax Tree)       │
│  2. Analyze          → Type checking, Comptime        │
│  3. Codegen          → LLVM IR → Machine Code          │
│  4. Link             → Produce executable/library      │
└─────────────────────────────────────────────────────────┘
```

## Comptime Execution

Comptime คือการรัน code ตอน compile time เพื่อ:
- คำนวณค่าคงที่
- Generate types
- Validate code at compile time

```zig
const fib = comptime fibonacci(20);
// คำนวณตอน compile time, ไม่มี runtime cost

fn fibonacci(n: u32) u32 {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Comptime Blocks

```zig
const result = comptime {
    var sum: u32 = 0;
    for (0..100) |i| {
        sum += i;
    }
    break :blk sum;
};
```

### Comptime vs Runtime

| Feature | Comptime | Runtime |
|---------|----------|---------|
| Execution | During compilation | During program run |
| Access | Types as values | Values only |
| Performance | Zero cost | Normal cost |
| Use case | Constants, type generation | Logic, algorithms |

## Allocator System

```
┌─────────────────────────────────────────────────────────┐
│                  Memory Allocator Flow                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   std.mem.Allocator (interface)                         │
│         ↓                                              │
│   ┌─────────────────────────────────┐                  │
│   │ GeneralPurposeAllocator          │                  │
│   │ ArenaAllocator                   │                  │
│   │ FixedBufferAllocator             │                  │
│   │ c_allocator                      │                  │
│   └─────────────────────────────────┘                  │
│         ↓                                              │
│   allocator.alloc() → memory                            │
│   allocator.free()  ← return memory                     │
└─────────────────────────────────────────────────────────┘
```

### Using Allocators

```zig
const allocator = std.heap.page_allocator;

// Allocate
const slice = try allocator.alloc(u8, 100);
defer allocator.free(slice);

// Allocate with initial value
const array = try allocator.allocWithOptions(u32, 50, .{
    .alignment = 4,
});

// Free
allocator.free(slice);
```

## Error Handling Flow

```zig
┌─────────────────────────────────────────────────────────┐
│                  Error Handling Pattern                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   fnRisky() anyerror!T {                                │
│       try riskyOperation();                             │
│       try anotherOperation();                          │
│       return success;                                   │
│   }                                                    │
│                                                         │
│   try: ถ้า error จะ return error ทันที                   │
│   catch: จัดการ error                                  │
└─────────────────────────────────────────────────────────┘
```

### Error Sets

```zig
const MyError = error{
    NotFound,
    InvalidInput,
    OutOfMemory,
};

fn failingFunction() MyError!void {
    return error.NotFound;
}
```

### Try Operator

```zig
const content = try std.fs.cwd().readFileAlloc(
    allocator,
    "file.txt",
    1024 * 1024,
);
// ถ้า error จะ return error เลย
```

## Optional Types

```zig
┌─────────────────────────────────────────────────────────┐
│                    Optional Type (?T)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   const value: ?i32 = null;     // nullable            │
│   const value: ?i32 = 42;       // has value           │
│                                                         │
│   if (value) |v| {              // unwrap              │
│       // v is i32              │
│   }                             │
└─────────────────────────────────────────────────────────┘
```

### Unwrapping Optional

```zig
const optional: ?i32 = getValue();

// if var
if (optional) |value| {
    std.debug.print("Got: {}\n", .{value});
}

// orelse
const actual = optional orelse 0;

// orelse_error
const actual2 = optional orelse error.NotFound;
```

## Defer Mechanism

```zig
fn readFile(path: []const u8) !void {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();  // always executed on scope exit

    const content = try file.readToEndAlloc(allocator, 1024);
    // file.close() called here automatically
}
```

## Build Configuration

```zig
// build.zig
const Builder = @import("std").build.Builder;

pub fn build(b: *Builder) void {
    const mode = b.standardReleaseOptions();
    const exe = b.addExecutable("my-app", "src/main.zig");

    exe.setBuildMode(mode);
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
}
```

## Cross-Compilation

```bash
# Target Windows x64
zig build -Dtarget=x86_64-windows-gnu

# Target Linux x64
zig build -Dtarget=x86_64-linux-gnu

# Target ARM64
zig build -Dtarget=aarch64-linux-gnu

# Native (same as host)
zig build
```