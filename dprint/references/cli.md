# CLI Commands

Complete CLI reference for dprint

## Commands

### `dprint init`

สร้างไฟล์ `dprint.json`:

```bash
dprint init
dprint init --js
dprint init --python
```

### `dprint fmt`

Format files:

```bash
# Format all
dprint fmt

# Format specific files
dprint fmt src/**/*.ts

# Show changed files
dprint fmt --list-different

# Parallel processing
dprint fmt --parallel

# Watch mode
dprint fmt --watch

# CI mode (รันเร็วขึ้น)
dprint fmt --ci

# Clear cache and format
dprint fmt --clear-cache
```

### `dprint check`

ตรวจสอบ formatting โดยไม่แก้ไข:

```bash
# Check all
dprint check

# Check specific
dprint check src/**/*.ts

# Exit with error if not formatted
dprint check --fail-on-only-if-changed

# List files that need formatting
dprint check --list-different
```

### `dprint add`

เพิ่ม plugin:

```bash
# Add from URL
dprint add https://plugins.dprint.dev/typescript-0.93.3.wasm

# Add latest version
dprint add typescript
dprint add json
dprint add markdown

# Add from file path
dprint add ./my-plugin.wasm

# Add to specific config path
dprint add --config ./path/to/dprint.json <url>
```

### `dprint update`

อัปเดต plugins:

```bash
# Update all
dprint update

# Update specific plugin
dprint update typescript

# Update to specific version
dprint update typescript@0.93.0
```

### `dprint cache-plugins`

Download และ cache plugins:

```bash
dprint cache-plugins

# Clear cached plugins
dprint cache-plugins --clear
```

### `dprint clear-cache`

ล้าง cache:

```bash
# Clear all cache
dprint clear-cache

# Clear specific cache type
dprint clear-cache --plugins
dprint clear-cache --format
```

### `dprint config`

จัดการ configuration:

```bash
# Validate current config
dprint config --validate

# Show resolved config
dprint config --show

# Update plugin versions
dprint config --update
```

### `dprint completions`

สร้าง shell completions:

```bash
dprint completions bash
dprint completions zsh
dprint completions fish
dprint completions powershell
```

### `dprint fmt --git-blame-ignore-revs`

สร้าง commit สำหรับ ignore ใน git blame:

```bash
# Format and create ignore rev
dprint fmt --git-blame-ignore-revs

# Add to .git-blame-ignore-revs file
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Global Options

| Option | Description |
|--------|-------------|
| `--config <path>` | Path to config file |
| `--verbose` | แสดง verbose output |
| `--quiet` | ไม่แสดง output |
| `--help, -h` | แสดง help |
| `--version, -v` | แสดง version |
| `--editor` | Output for editor integration |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Config error |
| 3 | File not formatted |
| 4 | Plugin error |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DPRINT_CONFIG` | Path to config file |
| `DPRINT_CACHE_DIR` | Cache directory path |
| `DPRINT_PLUGIN_CACHE_DIR` | Plugin cache directory |