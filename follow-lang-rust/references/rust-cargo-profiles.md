# Cargo Profiles

Profiles alter compiler settings. Cargo only looks at profile settings in the root `Cargo.toml`.

## Default `dev` Profile

```toml
[profile.dev]
opt-level = 0
debug = true
split-debuginfo = '...'  # Platform-specific.
strip = "none"
debug-assertions = true
overflow-checks = true
lto = false
panic = 'unwind'
incremental = true
codegen-units = 256
rpath = false
```

## Default `release` Profile

```toml
[profile.release]
opt-level = 3
debug = false
split-debuginfo = '...'  # Platform-specific.
strip = "none"
debug-assertions = false
overflow-checks = false
lto = false
panic = 'unwind'
incremental = false
codegen-units = 16
rpath = false
```

## Custom Profile Example

```toml
[profile.dev]
opt-level = 1
overflow-checks = false
```

## `opt-level` Values

- `0`: no optimizations
- `1`: basic optimizations
- `2`: some optimizations
- `3`: all optimizations
- `"s"`: optimize for binary size
- `"z"`: optimize for binary size, turn off loop vectorization

## `debug` Values

- `0`, `false`, or `"none"`: no debug info (default for `release`)
- `"line-tables-only"`: minimal debug info for backtraces
- `1` or `"limited"`: debug info without type/variable info
- `2`, `true`, or `"full"`: full debug info (default for `dev`)

## `lto` Values

- `true` or `"fat"`: fat LTO across all crates
- `"thin"`: thin LTO, faster than fat
- `false`: thin local LTO only
- `"off"`: disables LTO

## `panic` Values

- `"unwind"`: unwind the stack upon panic
- `"abort"`: terminate the process upon panic
