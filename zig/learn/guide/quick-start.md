# Quick Start

## Create New Project

```bash
# Create and initialize new project
mkdir my-project
cd my-project
zig init

# Create manually
mkdir my-project && cd my-project
mkdir src
touch src/main.zig
touch build.zig
```

## Hello World

```zig
// src/main.zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello, World!\n", .{});
}
```

```bash
zig build run
```

## Variables

```zig
pub fn main() void {
    // Immutable
    const x: i32 = 42;
    const name: []const u8 = "Zig";

    // Mutable
    var y: f64 = 3.14;
    y = 2.71;

    // Type inference
    const inferred = 100;  // comptime_int
    const float_inferred: f32 = 1.0;
}
```

## Functions

```zig
fn add(a: i32, b: i32) i32 {
    return a + b;
}

fn greet(name: []const u8) void {
    std.debug.print("Hello, {s}!\n", .{name});
}

fn optionalReturn(x: i32) ?i32 {
    if (x > 0) return x;
    return null;
}

pub fn main() void {
    const result = add(5, 3);
    greet("Zig");
    if (optionalReturn(10)) |v| {
        std.debug.print("Got: {}\n", .{v});
    }
}
```

## Structs

```zig
const Point = struct {
    x: f32,
    y: f32,

    fn distance(self: *const Point, other: *const Point) f32 {
        const dx = self.x - other.x;
        const dy = self.y - other.y;
        return std.math.sqrt(dx * dx + dy * dy);
    }
};

pub fn main() void {
    const p1 = Point{ .x = 0.0, .y = 0.0 };
    const p2 = Point{ .x = 3.0, .y = 4.0 };
    const dist = p1.distance(&p2);
    std.debug.print("Distance: {}\n", .{dist});
}
```

## Error Handling

```zig
const MyError = error{
    NotFound,
    Invalid,
};

fn risky() MyError!i32 {
    return 42;
    // return error.NotFound;
}

pub fn main() void {
    const result = risky() catch 0;
    std.debug.print("Result: {}\n", .{result});

    if (risky()) |value| {
        std.debug.print("Success: {}\n", .{value});
    } else |err| {
        std.debug.print("Error: {}\n", .{err});
    }
}
```

## Memory Allocation

```zig
const std = @import("std");

pub fn main() !void {
    var GPA = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = GPA.allocator();

    // Allocate
    const slice = try allocator.alloc(u8, 100);
    defer allocator.free(slice);

    // Use slice
    @memcpy(slice, "Hello, Zig!");
    std.debug.print("{s}\n", .{slice});
}
```

## Arrays and Loops

```zig
pub fn main() void {
    const array = [_]i32{ 1, 2, 3, 4, 5 };

    // For loop
    for (array, 0..) |value, index| {
        std.debug.print("[{}] = {}\n", .{ index, value });
    }

    // While loop
    var i: u32 = 0;
    while (i < 5) : (i += 1) {
        std.debug.print("{}\n", .{i});
    }
}
```

## Testing

```zig
test "basic test" {
    const sum = 2 + 2;
    try std.testing.expect(sum == 4);
}

test "string test" {
    const str: []const u8 = "hello";
    try std.testing.expect(str.len == 5);
}
```

```bash
zig build test
```

## Build and Run

```bash
# Debug build
zig build run

# Release build
zig build -Drelease

# Run tests
zig build test

# Cross-compile
zig build -Dtarget=x86_64-windows-gnu
```

## Project Structure

```
my-project/
├── build.zig          # Build configuration
├── build.zig.zon       # Package manifest
└── src/
    ├── main.zig        # Entry point
    └── root.zig        # Library root
```

## Common Patterns

### Optional Unwrap

```zig
const value: ?i32 = getOptional();

// Pattern 1: if
if (value) |v| {
    std.debug.print("{}", .{v});
}

// Pattern 2: orelse
const actual = value orelse 0;

// Pattern 3: orelse with error
const actual2 = try value orelse error.NotFound;
```

### Error Propagation

```zig
fn readFile(path: []const u8) ![]u8 {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();

    const content = try file.readToEndAlloc(std.heap.page_allocator, 1024 * 1024);
    return content;
}
```