# configuration

## index.md

# Configuration

Configuration options สำหรับ dprint

## Config File

สร้างไฟล์ `dprint.json` ใน root ของ project

## Basic Configuration

```json
{
  "extends": ["configs/typescript-format"],
  "typescript": {
    "quoteStyle": "alwaysDouble",
    "semicolons": true
  },
  "json": {},
  "markdown": {}
}
```

## Plugin Configuration

```json
{
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.90.wasm",
    "https://plugins.dprint.dev/json-0.19.wasm",
    "https://plugins.dprint.dev/markdown-0.17.wasm"
  ]
}
```

## Common Options

| Option | Description |
|--------|-------------|
| `indentWidth` | จำนวน spaces สำหรับ indent (default: 4) |
| `useTabs` | ใช้ tabs แทน spaces |
| `lineWidth` | ความกว้างบรรทัดสูงสุด (default: 120) |
| `includes` | glob patterns สำหรับไฟล์ที่จะ format |
| `excludes` | glob patterns สำหรับไฟล์ที่จะ ignore |

## TypeScript Options

```json
{
  "typescript": {
    "quoteStyle": "preferSingle",
    "semicolons": false,
    "useBraces": "always",
    "arrowKind": "arrow"
  }
}
```

## JSON Options

```json
{
  "json": {
    "indentWidth": 2,
    "trailingCommas": "none"
  }
}
```

## Markdown Options

```json
{
  "markdown": {
    "lineWidth": 100,
    "textWrap": "preserve"
  }
}
```

---

