# Configuration

## build.zig

The build.zig file defines how your project is built.

### Basic Structure

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const mode = b.standardReleaseOptions();

    const exe = b.addExecutable(.{
        .name = "my-app",
        .root_module = b.createModule(.{
            .source_file = .{ .path = "src/main.zig" },
        }),
        .target = target,
        .optimize = mode,
    });

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    if (b.validateStep) {
        const test_cmd = b.addTest(.{
            .root_module = b.createModule(.{
                .source_file = .{ .path = "src/main.zig" },
            }),
            .target = target,
            .optimize = mode,
        });
        b.step("test", "Run all tests");
        test_cmd.step.dependOn(b.getInstallStep());
    }

    const step = b.step("run", "Run the app");
    step.dependOn(&run_cmd.step);
}
```

### Build Modes

```zig
const modes = [_]std.builtin.Mode{
    .Debug,
    .ReleaseSafe,
    .ReleaseFast,
    .ReleaseSmall,
};
```

### Adding Dependencies

```zig
// build.zig.zon (package manifest)
.{
    .version = "0.1.0",
    .dependencies = .{
        .zmath = .{
            .url = "https://github.com/mich台上/zig-gamedev/releases/download/v0.14.0/zmath.tar.gz",
            .hash = "1220abc123...",
        },
    },
}
```

```zig
// build.zig
const zmath = b.dependency("zmath", .{});
exe.addModule("zmath", zmath.module("zmath"));
```

## Zigfmt Configuration

Create `.zigfmt.toml` in project root:

```toml
line_length = 120
tab_indentation = true
spaces = false
```

Run formatting:
```bash
zig fmt .
zig fmt --check .
```

## ZLS Configuration

ZLS settings in `.vscode/settings.json`:

```json
{
    "zig.zls.check_updates": true,
    "zig.zls.enable_autofix": true,
    "zig.zls.workspace_symbol_search_scope": "workspace_and_dependencies"
}
```

## Compiler Options

### @import

```zig
const std = @import("std");
const root = @import("root");
```

### Comptime Options

```zig
comptime {
    @setFloatMode(.Optimized);
    @setStackTraceMode(.full);
}
```

## Module System

### Importing Modules

```zig
const my_module = @import("my_module.zig");
const package = @import("package_name");
```

### Creating Modules

```zig
// src/utils.zig
pub const Utils = struct {
    pub fn helper() void {
        // ...
    }
};

// src/main.zig
const utils = @import("utils.zig");
utils.Utils.helper();
```

### Package Manager (zigmod)

```bash
# Initialize package
zigmod init

# Add dependency
zigmod add github.com/user/repo version

# Fetch dependencies
zigmod fetch
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| ZIG_VERSION | Current Zig version |
| ZIG_LOCAL_CACHE_DIR | Local cache directory |
| ZIG_GLOBAL_CACHE_DIR | Global cache directory |
| ZIG_CC | C compiler to use |
| ZIG_CPP | C++ compiler to use |