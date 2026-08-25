# Zig Language

## Install

Latest stable: Zig 0.16.0 (released 2026-04-13).

Download from `https://ziglang.org/download/`.

```bash
zig version             # Verify installation
mise use -g zig         # Install via mise
brew install zig        # Install via Homebrew (macOS)
```

## Language Conventions

- `camelCase` for variable names
- `PascalCase` for type names
- `snake_case` for file names
- 4 spaces indentation
- 100 characters line length

### Basic Syntax

```zig
const std = @import("std");

pub fn main() !void {
    std.debug.print("Hello World!\n", .{});
}
```

### Constants and Variables

```zig
const x: i32 = 5;       // Immutable
var y: i32 = 10;        // Mutable
y += 1;
```

### Error Handling

```zig
const std = @import("std");

const ParseError = error{
    Overflow,
    InvalidCharacter,
};

fn parseU64(buf: []const u8) !u64 {
    var result: u64 = 0;
    for (buf) |c| {
        if (c < '0' or c > '9') return error.InvalidCharacter;
        result = std.math.mul(u64, result, 10) catch return error.Overflow;
        result += c - '0';
    }
    return result;
}

pub fn main() !void {
    const value = parseU64("123") catch |err| {
        std.debug.print("Parse failed: {}\n", .{err});
        return;
    };
    std.debug.print("Value: {}\n", .{value});
}
```

### defer and errdefer

```zig
const std = @import("std");

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    const buffer = try allocator.alloc(u8, 100);
    defer allocator.free(buffer);  // Always runs on scope exit

    const file = std.fs.cwd().openFile("data.txt", .{}) catch |err| {
        std.debug.print("Failed to open: {}\n", .{err});
        return;
    };
    errdefer file.close();  // Runs only if function returns error
    defer file.close();     // Runs on normal exit too
}
```

### Allocators

```zig
const std = @import("std");

pub fn main() !void {
    // General purpose allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const slice = try allocator.alloc(u8, 128);
    defer allocator.free(slice);

    // Arena allocator for batch allocations
    var arena = std.heap.ArenaAllocator.init(allocator);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const buf = try arena_alloc.alloc(u8, 256);
    // No need to free - arena.deinit() frees everything
}
```

### comptime

```zig
const std = @import("std");

fn pow(base: u32, exp: u32) u32 {
    return switch (exp) {
        0 => 1,
        else => base * pow(base, exp - 1),
    };
}

pub fn main() !void {
    const result = comptime pow(2, 10);
    std.debug.print("2^10 = {}\n", .{result});
}
```

### C Interop

```zig
const c = @cImport({
    @cInclude("stdio.h");
});

pub fn main() !void {
    _ = c.printf("Hello from C\n");
}
```

> Note: `@cImport` is deprecated in 0.16.0. C translation is moving to the
> build system via `b.addTranslateC`.

## CLI Commands

```bash
zig build                  # Build the project (default: install step)
zig build run              # Run the application
zig build test             # Run tests
zig build --help           # Show available steps and options
zig build -l               # List available steps
zig build --release=fast   # Build with release optimizations
zig build-exe source.zig   # Build executable directly
zig build-lib source.zig   # Build library directly
zig build-obj source.zig   # Build object file directly
zig test source.zig        # Run tests directly
```

## Source URLs

- Zig homepage: `https://ziglang.org/`
- Zig download: `https://ziglang.org/download/`
- Zig language reference: `https://ziglang.org/documentation/`
- Zig standard library: `https://ziglang.org/documentation/master/std/`
- 0.16.0 release notes: `https://ziglang.org/download/0.16.0/release-notes.html`
