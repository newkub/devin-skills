# Features

## Optional Types

### Basic Optional

```zig
// Nullable integer
const maybe: ?i32 = null;
const maybe: ?i32 = 42;

// Optional struct
const maybe_user: ?User = findUser(id);
```

### Unwrapping

```zig
const value: ?i32 = getValue();

// if (shorthand)
if (value) |v| {
    std.debug.print("Got: {}\n", .{v});
}

// orelse
const actual = value orelse 0;

// orelse with error
const actual2 = value orelse error.NotFound;

// coalesce
const result = value orelse 100;
```

## Error Handling

### Error Sets

```zig
const FileError = error{
    NotFound,
    AccessDenied,
    IsDirectory,
    Unexpected,
};

// Custom error sets
const NetworkError = error{
    ConnectionRefused,
    Timeout,
    HostUnreachable,
};
```

### Error Unions

```zig
// T!E means "either T or error E"
const result: anyerror!i32 = 42;
const result: anyerror!i32 = error.NotFound;

// Function returning error union
fn parseNumber(s: []const u8) !i32 {
    if (s.len == 0) return error.InvalidInput;
    return std.fmt.parseInt(i32, s, 10);
}
```

### Try Operator

```zig
// Try = "if error, return the error"
const content = try std.fs.cwd().readFile("test.txt");

// Multiple tries
const file = try openFile("data.txt");
const content = try file.readToEndAlloc(allocator, 1024);
try file.close();

// Combining with optional
const value = (try getOptional()) orelse default_value;
```

### catch Operator

```zig
const result = failingFunction() catch 0;
const result = failingFunction() catch |err| {
    std.debug.print("Error: {}\n", .{err});
    return error.Recovered;
};
```

## Comptime

### Comptime Expressions

```zig
const fib = comptime fibonacci(20);
const size = comptime: {
    var sum: u32 = 0;
    for (0..100) |i| sum += i;
    break :comptime sum;
};
```

### Type as Value

```zig
const T = comptime meta.Int(.signed, .u32);
const array_type = [10]u32;
const slice_type = []const u8;
```

### Comptime Functions

```zig
fn comptimeFib(n: u32) u32 {
    if (n < 2) return n;
    return comptimeFib(n - 1) + comptimeFib(n - 2);
}

const result = comptimeFib(10);
```

### @compileLog

```zig
comptime {
    @compileLog("Compiling with value: ", some_value);
}
```

## Defer

### Basic Defer

```zig
{
    const file = try std.fs.cwd().openFile("data.txt", .{});
    defer file.close();

    const content = try file.readToEndAlloc(allocator, 1024);
    // file.close() called at end of block
}
```

### Multiple Defers

```zig
{
    defer allocator.free(buffer1);
    defer allocator.free(buffer2);
    defer cleanup();
    // executes in reverse order
}
```

### errdefer

```zig
{
    const resource = try acquireResource();
    errdefer releaseResource(resource);  // only if error

    try useResource(resource);
    // releaseResource only if error occurred
}
```

## Slices and Arrays

### Arrays

```zig
const arr: [5]i32 = .{ 1, 2, 3, 4, 5 };
const arr2 = [_]i32{ 1, 2, 3, 4, 5 };  // auto-sized
```

### Slices

```zig
const slice: []i32 = arr[1..4];  // [2, 3, 4]
const slice2 = arr[0..];          // entire array

// Dynamic slice
const dynamic = try allocator.alloc(i32, 10);
defer allocator.free(dynamic);
```

### String Slices

```zig
const str: []const u8 = "hello";
const substr = str[0..3];  // "hel"
```

## Structs

### Basic Struct

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

const p = Point{ .x = 1.0, .y = 2.0 };
```

### Methods

```zig
const Vec3 = struct {
    x: f32,
    y: f32,
    z: f32,

    fn length(self: *const Vec3) f32 {
        return std.math.sqrt(self.x * self.x + self.y * self.y + self.z * self.z);
    }

    fn add(self: *const Vec3, other: *const Vec3) Vec3 {
        return Vec3{
            .x = self.x + other.x,
            .y = self.y + other.y,
            .z = self.z + other.z,
        };
    }
};
```

### Default Values

```zig
const Config = struct {
    name: []const u8 = "default",
    port: u16 = 8080,
    debug: bool = false,
};

const config = Config{};
```

## Enums

### Basic Enum

```zig
const Color = enum {
    red,
    green,
    blue,
};

const c = Color.red;
```

### Enum with Values

```zig
const Status = enum(u32) {
    pending = 1,
    running = 2,
    completed = 3,
};

const s = Status.pending;
const value: u32 = @intFromEnum(s);  // 1
```

### Enum Methods

```zig
const Direction = enum {
    north,
    south,
    east,
    west,

    fn isVertical(self: Direction) bool {
        return self == .north or self == .south;
    }
};
```

## Unions

### Tagged Unions

```zig
const Node = union(enum) {
    num: i32,
    str: []const u8,
    arr: []const i32,

    fn print(self: Node) void {
        switch (self) {
            .num => |v| std.debug.print("Number: {}\n", .{v}),
            .str => |v| std.debug.print("String: {s}\n", .{v}),
            .arr => |v| std.debug.print("Array: {any}\n", .{v}),
        }
    }
};
```

### Void Tagged Unions

```zig
const Result = union(enum) {
    success: void,
    error: Error,

    fn isError(self: Result) bool {
        return self == .error;
    }
};
```

## Switch

```zig
const value: u32 = 2;

switch (value) {
    1 => std.debug.print("one\n"),
    2 => std.debug.print("two\n"),
    else => std.debug.print("other\n"),
}

// With union
const node: Node = .{ .num = 42 };
switch (node) {
    .num => |v| std.debug.print("{}", .{v}),
    .str => |v| std.debug.print("{s}", .{v}),
    .arr => |v| std.debug.print("{any}", .{v}),
}
```

## Loops

### For Loop

```zig
const array = [_]i32{ 1, 2, 3, 4, 5 };

for (array) |value, index| {
    std.debug.print("[{}]: {}\n", .{ index, value });
}

// Range
for (0..10) |i| {
    std.debug.print("{}\n", .{i});
}
```

### While Loop

```zig
var count: u32 = 0;
while (count < 10) : (count += 1) {
    std.debug.print("{}\n", .{count});
}

// With condition
while (true) {
    const input = try getInput();
    if (input == null) break;
    try process(input.?);
}
```