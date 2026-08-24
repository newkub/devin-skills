# Zig Build System

The Zig build system models projects as a directed acyclic graph (DAG) of
steps, which are independently and concurrently run.

## Initialize a Project

```bash
zig init
```

This creates `build.zig`, `build.zig.zon`, and `src/main.zig`.

## build.zig - Simple Executable

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "hello",
        .root_module = b.createModule(.{
            .root_source_file = b.path("hello.zig"),
            .target = b.graph.host,
        }),
    });

    b.installArtifact(exe);
}
```

## build.zig - Run Step

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const exe = b.addExecutable(.{
        .name = "hello",
        .root_module = b.createModule(.{
            .root_source_file = b.path("hello.zig"),
            .target = b.graph.host,
        }),
    });

    b.installArtifact(exe);

    const run_exe = b.addRunArtifact(exe);

    const run_step = b.step("run", "Run the application");
    run_step.dependOn(&run_exe.step);
}
```

## User-Provided Options

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const windows = b.option(bool, "windows", "Target Microsoft Windows") orelse false;

    const exe = b.addExecutable(.{
        .name = "hello",
        .root_module = b.createModule(.{
            .root_source_file = b.path("example.zig"),
            .target = b.resolveTargetQuery(.{
                .os_tag = if (windows) .windows else null,
            }),
        }),
    });

    b.installArtifact(exe);
}
```

Usage: `zig build -Dwindows=true`

## Testing

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const tests = b.addTest(.{
        .root_module = b.createModule(.{
            .root_source_file = b.path("tests.zig"),
            .target = b.graph.host,
        }),
    });

    const run_tests = b.addRunArtifact(tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_tests.step);
}
```

## Standard Configuration Options

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "hello",
        .root_module = b.createModule(.{
            .root_source_file = b.path("hello.zig"),
            .target = target,
            .optimize = optimize,
        }),
    });

    b.installArtifact(exe);
}
```

## Build Output

```
.
├── build.zig
├── build.zig.zon
├── src/
│   └── main.zig
├── .zig-cache/            # Build cache (do not commit)
└── zig-out/               # Installation prefix
    └── bin/
        └── hello
```

- `.zig-cache`: Files for faster subsequent builds. Not for version control.
- `zig-out`: Installation prefix. Controlled by `--prefix` flag.

## Build CLI Options

```
General Options:
  -h, --help                   Print help and exit
  -l, --list-steps             Print available steps
  -p, --prefix [path]          Where to install files (default: zig-out)
  --release[=mode]             Request release mode: fast, safe, small
  --verbose                    Print commands before executing
  --color [auto|off|on]        Enable or disable colored error messages
  --summary [mode]             Print build summary: all, new, failures, line
```

## build.zig.zon

```zon
.{
    .name = .hello,
    .version = "0.1.0",
    .fingerprint = 0x1234567890abcdef,
    .minimum_zig_version = "0.16.0",
    .dependencies = .{},
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src",
    },
}
```

## Source URLs

- Zig build system: `https://ziglang.org/learn/build-system/`
- Zig download: `https://ziglang.org/download/`
- 0.16.0 release notes: `https://ziglang.org/download/0.16.0/release-notes.html`
