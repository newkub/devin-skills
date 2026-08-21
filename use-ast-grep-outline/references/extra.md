### 8. JSON Output

ใช้ JSON output สำหรับ machine-readable consumption:

```bash
# Pretty-printed JSON (default when --json is passed without value)
sg outline src --json

# Stream JSON (one file object per line)
sg outline src --json=stream

# Compact JSON (single-line array)
sg outline src --json=compact
```

JSON shape เป็น array ของ file objects (สำหรับ `--json` และ `--json=compact`) หรือ one file object per line (สำหรับ `--json=stream`):

```typescript
interface OutlineFile {
  path: string
  language: string
  items: OutlineItem[]
}
interface OutlineItem {
  symbolType: string  // LSP-compatible lower camel case
  name: string
  role: 'item'
  isImport: boolean
  isExported: boolean
  range: OutlineRange
  signature: string
  astKind: string
  members?: OutlineMember[]
}
interface OutlineMember {
  symbolType: string
  name: string
  role: 'member'
  isPublic: boolean
  range: OutlineRange
  signature: string
  astKind: string
}
```

### 9. Color Control

ควบคุม ANSI color ใน text output:

```bash
# Auto color (default)
sg outline src --color auto

# Always color
sg outline src --color always

# ANSI color
sg outline src --color ansi

# No color
sg outline src --color never
```

### 10. Language Specification

ระบุ language เมื่อต้องการ:

```bash
sg outline --lang TypeScript src
sg outline --lang Python src
sg outline --lang Rust src
```

สำหรับ stdin input `--lang` จำเป็นต้องระบุเสมอ:

```bash
cat src/parser.ts | sg outline --stdin --lang TypeScript
```

### 11. Config File

ระบุ path ของ ast-grep root config:

```bash
# ใช้ config เฉพาะ
sg outline src -c custom-sgconfig.yml

# default: sgconfig.yml
sg outline src
```

`outline` ใช้ project config สำหรับ custom language registration และ `customLanguages.<name>.outlineRules`

### 12. Custom Outline Rules

โหลด outline extractor definitions เพิ่มเติม:

```bash
# โหลด additional rules
sg outline src --outline-rules project-outline.yml

# แทนที่ bundled rules ทั้งหมด
sg outline src --no-default-outline-rules --outline-rules project-outline.yml
```

### 13. Advanced Options

ใช้ options เพิ่มเติม:

```bash
# Follow symbolic links
sg outline src --follow

# ไม่ respect ignore files (ค่าที่เป็นไปได้: hidden, dot, exclude, global, parent, vcs)
sg outline src --no-ignore vcs
sg outline src --no-ignore hidden

# Include/exclude files with globs (match .gitignore globs, prefix ! เพื่อ exclude)
sg outline src --globs "*.ts" --globs "!*.test.ts"

# Set thread count (default: 0 = auto)
sg outline src --threads 4
```
