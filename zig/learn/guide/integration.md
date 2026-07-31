# Integration

## C Interoperability

### Calling C from Zig

```zig
const c = @cImport(@cInclude("stdio.h"));

pub fn main() void {
    c.printf("Hello from C!\n");
}
```

### Including C Headers

```zig
const c = @cImport(@cInclude("stdlib.h"));
const c = @cImport(@cInclude("my_header.h"));
```

### Linking C Libraries

```zig
// build.zig
pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "my-project",
        .root_module = b.createModule(.{
            .source_file = .{ .path = "src/main.zig" },
        }),
    });

    // Link against libc
    exe.linkLibC();

    // Link custom library
    exe.addLibraryPath("/path/to/lib");
    exe.linkSystemLibrary("mylib");
}
```

### Using C Pointers

```zig
const c = @cImport(@cInclude("stdlib.h"));

pub fn main() void {
    const ptr = c.malloc(1024);
    defer c.free(ptr);

    // Use the pointer
    _ = ptr;
}
```

## Zig as a C Compiler

### Compile C with Zig

```bash
# Compile C file
zig cc -o output main.c

# Compile and link
zig cc -o output main.c -lssl -lcrypto

# Cross-compile
zig cc -target x86_64-windows-gnu -o output.exe main.c
```

### Use Zig Build System for C

```zig
// build.zig
pub fn build(b: *std.Build) void {
    const lib = b.addSharedLibrary("myclib", null, .{
        .link_libc = true,
    });

    lib.addCSourceFile("src/mylib.c", &[_]String{});
    b.installArtifact(lib);
}
```

## C++ Integration

```zig
const cpp = @cImport(@cInclude("iostream"));

pub fn main() void {
    cpp.stdout.puts("Hello from C++\n");
}
```

### Building with C++ Libraries

```zig
// build.zig
pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "my-project",
        .root_module = b.createModule(.{
            .source_file = .{ .path = "src/main.zig" },
        }),
    });

    exe.linkLibCpp();
    exe.linkSystemLibrary("mystdlib");
}
```

## WebAssembly

### Build for WASM

```bash
# Create project
mkdir my-wasm && cd my-wasm
zig init-exe

# Build for WASM
zig build -Dtarget=wasm32-wasi
```

### WASM with JavaScript

```zig
const std = @import("std");

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn getString() [*:0]const u8 {
    return "Hello from Zig!";
}
```

### JavaScript Interop

```javascript
// Using wasm-bindgen alternative patterns
const wasm = await WebAssembly.instantiateStreaming(
    fetch('my-wasm.wasm')
);
const result = wasm.instance.exports.add(1, 2);
```

## Build System Integration

### CMake with Zig

```cmake
# CMakeLists.txt
find_program(ZIG_EXECUTABLE NAMES zig)

add_custom_target(zig-build
    COMMAND ${ZIG_EXECUTABLE} build
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
)
```

### Makefile Integration

```makefile
zig-build:
	zig build -Drelease

zig-test:
	zig build test

zig-fmt:
	zig fmt .
```

## Database Integration

### SQLite with Zig

```zig
const std = @import("std");

pub fn main() !void {
    const db = try std.sqlite.open("my.db");
    defer db.close();

    try db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");
    try db.exec("INSERT INTO users (name) VALUES ('Alice')");

    var stmt = try db.prepare("SELECT * FROM users");
    defer stmt.deinit();

    while (try stmt.step()) {
        const id = stmt.columnInt(0);
        const name = stmt.columnText(1);
        std.debug.print("{}: {s}\n", .{ id, name });
    }
}
```

### HTTP Client

```zig
const std = @import("std");

pub async fn fetchUrl(url: []const u8) ![]u8 {
    const client = std.http.Client{ .allocator = allocator };
    defer client.deinit();

    const response = try client.fetch(.{
        .location = std.Uri.parse(url),
    });

    return response.body;
}
```

## Logging

### Built-in Logging

```zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Debug: {}\n", .{value});
    std.log.info("Info: {}", .{message});
    std.log.err("Error: {}", .{err});
}
```

### Custom Logging

```zig
const std = @import("std");

pub fn logMessage(level: []const u8, msg: []const u8) void {
    const timestamp = std.time.timestamp();
    std.debug.print("[{}] {}: {s}\n", .{ timestamp, level, msg });
}
```

## Testing Integration

### Using std.testing

```zig
const std = @import("std");

test "basic assertions" {
    try std.testing.expect(2 + 2 == 4);
    try std.testing.expectEqual(10, 10);
}

test "string operations" {
    const str = "hello world";
    try std.testing.expect(std.mem.containsAtLeast(u8, str, 1, "hello"));
}

test "error handling" {
    try std.testing.expectError(error.NotFound, failingFunction());
}
```

### Integration Tests

```zig
test "file operations" {
    const test_file = "test-data.txt";
    defer std.fs.cwd().deleteFile(test_file) catch {};

    try std.fs.cwd().writeFile(test_file, "test data");
    const content = try std.fs.cwd().readFileAlloc(allocator, test_file, 1024);
    defer allocator.free(content);

    try std.testing.expectEqualStrings("test data", content);
}
```