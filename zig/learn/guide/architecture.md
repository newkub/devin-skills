# Architecture

## Project Structure

```
my-project/
├── build.zig              # Build configuration
├── build.zig.zon          # Package manifest
├── src/
│   ├── main.zig           # Entry point
│   ├── root.zig           # Library root (if lib)
│   ├── app.zig            # Application logic
│   ├── db.zig             # Database layer
│   └── utils.zig          # Utilities
├── libs/
│   └── mylib/
│       ├── build.zig.zon
│       └── src/
│           └── mylib.zig
├── tests/
│   └── integration.zig
└── examples/
    └── basic.zig
```

## Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
├─────────────────────────────────────────────────────────┤
│  main.zig, cli.zig, http.zig                           │
│  - Entry point, CLI handlers, HTTP handlers             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
├─────────────────────────────────────────────────────────┤
│  services.zig, handlers.zig                            │
│  - Business logic, orchestration                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                        │
├─────────────────────────────────────────────────────────┤
│  models.zig, entities.zig                               │
│  - Core entities, domain logic                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                   │
├─────────────────────────────────────────────────────────┤
│  db.zig, network.zig, allocator.zig                    │
│  - Database, external services, memory                  │
└─────────────────────────────────────────────────────────┘
```

## Module Organization

### Entry Point (main.zig)

```zig
const std = @import("std");
const root = @import("root");
const app = @import("app.zig");

pub fn main() !void {
    try app.run();
}
```

### Application Module (app.zig)

```zig
const std = @import("std");
const db = @import("db.zig");

pub fn run() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer _ = gpa.deinit();

    try db.init(allocator);
    defer db.deinit();

    std.debug.print("Application started\n", .{});
}
```

## State Management

### Application State

```zig
const std = @import("std");

pub const AppState = struct {
    allocator: std.mem.Allocator,
    config: Config,
    db_pool: DatabasePool,

    pub fn init(allocator: std.mem.Allocator, config: Config) !AppState {
        const db_pool = try DatabasePool.connect(config.db_url);
        return AppState{
            .allocator = allocator,
            .config = config,
            .db_pool = db_pool,
        };
    }

    pub fn deinit(self: *AppState) void {
        self.db_pool.disconnect();
    }
};
```

### Shared State with Arena

```zig
pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // All allocations cleaned up automatically
    const buffer = try allocator.alloc(u8, 1024);
    const strings = try allocator.alloc([]const u8, 10);
    // No need to free - arena handles it
}
```

## Error Handling Architecture

### Error Sets by Domain

```zig
const DbError = error{
    ConnectionFailed,
    QueryFailed,
    NotFound,
    Duplicate,
};

const ConfigError = error{
    FileNotFound,
    ParseError,
    InvalidValue,
};

const AppError = error{
    DatabaseError,
    ConfigError,
    NotFound,
    Internal,
};
```

### Error Propagation

```zig
fn doSomething() !void {
    const data = try db.query("SELECT * FROM users");
    const parsed = try config.parse(data);
    try app.validate(parsed);
}
```

## Testing Architecture

### Unit Tests in Same File

```zig
const std = @import("std");

fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "add numbers" {
    try std.testing.expectEqual(add(2, 2), 4);
}
```

### Integration Tests

```zig
// tests/integration.zig
const std = @import("std");
const app = @import("app.zig");

test "full workflow" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    try app.init(gpa.allocator());
    defer app.deinit();

    try app.process("test input");
}
```

## Memory Architecture

### Allocator Selection

```zig
const std = @import("std");

pub fn main() !void {
    // For short-lived allocations
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    // For persistent allocations
    var arena = std.heap.ArenaAllocator.init(gpa.allocator());
    defer arena.deinit();

    // For large single allocations
    const buffer = try gpa.allocator().alloc(u8, 1024 * 1024);
    defer gpa.allocator().free(buffer);
}
```

## Build Patterns

### Executable

```zig
// build.zig
pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "my-app",
        .root_module = b.createModule(.{
            .source_file = .{ .path = "src/main.zig" },
        }),
    });

    b.installArtifact(exe);
}
```

### Library

```zig
// build.zig
pub fn build(b: *std.Build) void {
    const lib = b.addStaticLibrary(.{
        .name = "mylib",
        .root_module = b.createModule(.{
            .source_file = .{ .path = "src/root.zig" },
        }),
    });

    b.installArtifact(lib);
}
```

### Multi-target

```zig
pub fn build(b: *std.Build) void {
    const targets = &.{
        .{ .target = .{ .cpu_arch = .x86_64, .os_tag = .windows }, .name = "win64" },
        .{ .target = .{ .cpu_arch = .x86_64, .os_tag = .linux }, .name = "linux64" },
        .{ .target = .{ .cpu_arch = .aarch64, .os_tag = .linux }, .name = "linuxarm" },
    };

    for (targets) |t| {
        const exe = b.addExecutable(.{
            .name = t.name,
            .root_module = b.createModule(.{
                .source_file = .{ .path = "src/main.zig" },
            }),
            .target = t.target,
        });
        b.installArtifact(exe);
    }
}
```