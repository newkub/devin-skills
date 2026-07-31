# Programmatic API

dprint มี CLI สำหรับ code formatting:

## CLI Commands

```bash
# Install dprint
bun install -g dprint

# Format files
dprint fmt

# Check formatting without modifying
dprint check

# List files that need formatting
dprint fmt --list-different

# Format specific file
dprint fmt path/to/file.ts
```

## Configuration (dprint.json)

```json
{
  "includes": [
    "**/*.{ts,tsx,js,jsx,json,md,toml}"
  ],
  "excludes": [
    "**/node_modules",
    "**/dist"
  ],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.93.0.wasm",
    "https://plugins.dprint.dev/json-0.19.3.wasm",
    "https://plugins.dprint.dev/markdown-0.17.2.wasm"
  ],
  "typescript": {
    "lineWidth": 100,
    "indentWidth": 2
  }
}
```

## Configuration with Editor

```bash
# Edit configuration file
dprint config
```

## Caching

dprint ใช้ cache สำหรับ incremental formatting:
- Linux: `~/.cache/dprint`
- macOS: `~/Library/Caches/dprint`
- Windows: `%LOCALAPPDATA%/dprint`

ดูรายละเอียดเพิ่มเติมที่: [dprint Documentation](https://dprint.dev)
