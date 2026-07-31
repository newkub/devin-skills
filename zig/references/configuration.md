# Zig Configuration Reference

## build.zig

### Standard Build Structure

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    
    const exe = b.addExecutable(.{
        .name = "myapp",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    
    b.installArtifact(exe);
    
    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());
    
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}
```

### Build Options

| Option | Description |
|--------|-------------|
| `target` | Target triple for cross-compilation |
| `optimize` | Optimization level (Debug, ReleaseSafe, ReleaseFast, ReleaseSmall) |
| `root_source_file` | Entry point file |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| Zig Build System | https://ziglang.org/documentation/master/#Build-System | Zig build system documentation |
