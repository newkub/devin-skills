# Best Practices

## Naming Conventions

```zig
// Structs: PascalCase
const UserAccount = struct { };
const HttpResponse = struct { };

// Enums: PascalCase
const Status = enum { pending, completed };
const Color = enum { red, green, blue };

// Functions: snake_case
fn calculateTotal() void { }
fn validateEmail() bool { }

// Variables: snake_case
const user_count: u32 = 10;
const is_active: bool = true;

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT: u32 = 3;
const DEFAULT_TIMEOUT_MS: u32 = 5000;

// Error sets: PascalCase
const MyError = error{
    NotFound,
    InvalidInput,
};
```

## Error Handling

```zig
// Prefer explicit error handling
fn readFile(path: []const u8) ![]u8 {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();

    return try file.readToEndAlloc(std.heap.page_allocator, 1024 * 1024);
}

// Use custom error sets for specific domains
const FileError = error{
    NotFound,
    AccessDenied,
    IsDirectory,
    Unexpected,
};

// Handle errors explicitly
const result = readFile("config.json") catch |err| {
    std.debug.print("Failed to read config: {}\n", .{err});
    return error.FallbackConfig;
};
```

## Memory Management

```zig
// Always pair allocation with deallocation via defer
pub fn example(allocator: std.mem.Allocator) !void {
    const buffer = try allocator.alloc(u8, 1024);
    defer allocator.free(buffer);

    // use buffer
}

// Use ArenaAllocator for temporary allocations
var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
defer arena.deinit();
const allocator = arena.allocator();

// errdefer for cleanup on error
fn riskyOperation() !void {
    const resource = try acquireResource();
    errdefer releaseResource(resource);  // only on error

    try process(resource);
}
```

## Code Organization

```zig
// modules/foo.zig
pub const Foo = struct {
    pub fn create() Foo {
        return Foo{};
    }

    pub fn method(self: *Foo) void {
        // implementation
    }
};

// main.zig
const foo = @import("modules/foo.zig");
const my_foo = foo.Foo.create();
```

## Optional Handling

```zig
// Prefer if over orelse when you need the value
if (value) |v| {
    std.debug.print("Got: {}\n", .{v});
}

// Use orelse for defaults
const safe = optional_value orelse default_value;

// Use try for propagating errors
const must_have = try optional_error_value;
```

## Comptime Usage

```zig
// Use comptime for constants
const fib_cache = comptime blk: {
    var result: [20]u32 = undefined;
    result[0] = 0;
    result[1] = 1;
    for (2..20) |i| {
        result[i] = result[i - 1] + result[i - 2];
    }
    break :blk result;
};

// Validate at compile time
comptime {
    if (MAX_BUFFER < 1024) {
        @compileError("MAX_BUFFER must be at least 1024");
    }
}
```

## Testing

```zig
test "my test" {
    const result = myFunction();
    try std.testing.expect(result == expected);
}

test "error handling" {
    try std.testing.expectError(error.NotFound, failingFunction());
}
```

## Formatting

```zig
// Use zig fmt
// Run: zig fmt .

// Keep lines under 120 characters
fn veryLongFunctionName(
    parameter_one: Type,
    parameter_two: Type,
    parameter_three: Type,
) ReturnType {
    // ...
}
```

## Performance

```zig
// Preallocate when size is known
const slice = try allocator.alloc(u8, known_size);

// Use slices instead of arrays when size is dynamic
const dynamic_slice = arr[start..end];

// Prefer value types over pointers when possible
const point = Point{ .x = 1, .y = 2 };  // stack allocated

// Use for loops over while loops when iterating
for (items) |item| {
    process(item);
}
```

## Documentation

```zig
/// Represents a user in the system.
/// All fields are required.
pub const User = struct {
    /// User's unique identifier
    id: u64,
    /// User's display name
    name: []const u8,
};

/// Calculates the distance between two points.
/// Returns the Euclidean distance.
pub fn distance(p1: *const Point, p2: *const Point) f32 {
    // ...
}
```