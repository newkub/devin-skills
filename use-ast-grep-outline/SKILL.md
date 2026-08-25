---
name: use-ast-grep-outline
description: ใช้งาน ast-grep outline สำหรับ code navigation โดยไม่ต้อง build index
argument-hint: "[file]"
---

## Goal

ใช้งาน ast-grep outline เพื่อ explore code structure และ navigation อย่างรวดเร็ว โดยไม่ต้อง build index

## Scope

ครอบคลุมการใช้งาน ast-grep outline สำหรับ:
- ดู structure ของ file ก่อนอ่าน implementation
- ดู exports ของ directory/module
- ตรวจสอบ dependencies และ imports
- Expand symbols เพื่อดู members โดยไม่ต้องอ่านทั้ง file
- Filter symbols ด้วย pattern และ type

## Execute

### 1. Basic Usage
> Goal: Basic Usage

รัน ast-grep outline เพื่อ explore code structure:

```bash
# ดู structure ของ file เดียว (default: digest view)
sg outline src/parser.ts

# ดู exports ของ directory (default: exports items)
sg outline src

# ดู structure ของหลาย files
sg outline src/parser.ts src/rule.ts
```

### 2. Filter Items
> Goal: เลือก top-level items ที่ต้องการดู

```bash
# ดู imports/dependencies ของ file
sg outline src/parser.ts --items imports

# ดู exports ของ file
sg outline src/parser.ts --items exports

# ดู structure ทั้งหมด (imports + exports)
sg outline src/parser.ts --items all

# ดู local structure เท่านั้น (ไม่รวม imports)
sg outline src/parser.ts --items structure
```

### 3. Filter By Type
> Goal: กรอง symbols ตาม type

```bash
# ดูเฉพาะ classes และ enums
sg outline src --type class,enum

# ดูเฉพาะ functions
sg outline src --type function

# ดูเฉพาะ interfaces
sg outline src --type interface
```

### 4. Filter By Pattern
> Goal: Filter By Pattern

กรอง symbols ด้วย regex:

```bash
# ดู symbols ที่ match pattern
sg outline src --match Parser

# ดู imports ที่ match dependency ชื่อ ast-grep-core
sg outline src --items imports --match ast-grep-core

# ดู symbols ที่ขึ้นต้นด้วย use
sg outline src --match "^use"
```

### 5. Select View
> Goal: เลือก presentation level

```bash
# ดูเฉพาะ names (grouped by symbol type)
sg outline src --view names

# ดู signatures เท่านั้น
sg outline src --view signatures

# ดู signatures + compact member digests (default for files)
sg outline src --view digest

# ดู signatures + expanded members (ดู members ทั้งหมด)
sg outline src --view expanded
```

### 6. Expand Specific Symbol
> Goal: Expand symbol เฉพาะเจาะจง

```bash
# Expand class Parser ดู members ทั้งหมด
sg outline src/parser.ts --match Parser --type class --view expanded

# Expand function parseRule
sg outline src/parser.ts --match parseRule --type function --view expanded
```

### 7. Public Members Only
> Goal: Public Members Only

ดูเฉพาะ public members:

```bash
sg outline src --view expanded --pub-members
```

## Rules

### 1. When To Use Outline

ใช้ ast-grep outline เมื่อ:

- ต้องการดู structure ของ file ก่อนอ่าน implementation
- ต้องการดู exports ของ directory/module
- ต้องการตรวจสอบ dependencies ของ file
- ต้องการ expand symbol เพื่อดู members โดยไม่ต้องอ่านทั้ง file
- ต้องการ filter symbols ด้วย pattern หรือ type
- ต้องการ machine-readable output สำหรับ scripts

### 2. When Not To Use Outline

ไม่ใช้ outline เมื่อ:

- ต้องการ search patterns ใน code (ใช้ `ast-grep run` หรือ `ast-grep scan`)
- ต้องการ rewrite code (ใช้ `ast-grep run` หรือ `ast-grep scan` กับ fix)
- ต้องการ cross-file analysis (outline เป็น local-only)
- ต้องการ semantic relationships (outline ไม่ normalize extends/implements)
- ต้องการ full AST analysis (outline เป็น summary เท่านั้น)

### 3. Default Behavior

ค่า default ของ outline:

- File input: `--items auto` → `structure`, `--view auto` → `digest`
- Directory input: `--items auto` → `exports`, `--view auto` → `names`
- Stdin input: ต้องระบุ `--lang` เสมอ

### 4. Items Options

ค่าที่เลือกได้สำหรับ `--items`:

- `auto`: ใช้ `structure` สำหรับ file/stdin, `exports` สำหรับ directory
- `structure`: Top-level items ที่ define ใน file (ไม่รวม imports)
- `exports`: Top-level items ที่ export จาก file/module
- `imports`: Top-level items ที่ import จาก files/modules อื่น
- `all`: ทั้ง imports และ exports

### 5. View Options

ค่าที่เลือกได้สำหรับ `--view`:

- `auto`: ใช้ `digest` สำหรับ file/stdin, `names` สำหรับ directory
- `names`: Grouped name lines per symbol type per file
- `signatures`: One source/signature line per top-level item
- `digest`: Signatures + compact member name digests
- `expanded`: Signatures + one source/signature line per direct member

### 6. Symbol Types

Types ที่รองรับสำหรับ `--type` (LSP-compatible `DocumentSymbol.kind`):

- `file`, `module`, `namespace`, `package`, `class`, `method`, `property`, `field`
- `constructor`, `enum`, `interface`, `function`, `variable`, `constant`, `string`
- `number`, `boolean`, `array`, `object`, `key`, `null`, `enumMember`
- `struct`, `event`, `operator`, `typeParameter`
- ใช้ lower camel case เช่น `enumMember`, `typeParameter`
- Multiple values คั่นด้วย comma ทำงานเป็น OR filter

### 7. Design Principles

หลักการออกแบบของ outline:

- Parse on demand: ไม่ build index แต่ parse files เมื่อต้องการ
- Stay local: ไม่ analyze cross-file relationships
- Declarative extraction: ใช้ rules สำหรับ define extraction logic
- Fast and deterministic: ไม่มี global knowledge แต่เร็วและ predictable

### 8. Output Structure

Outline entry ประกอบด้วย:

- Name: ชื่อของ symbol (เช่น `Parser`, `parseRule`)
- Symbol type: class, function, struct, field, ฯลฯ
- Source range: ตำแหน่งใน file
- First-line signature: signature บรรทัดแรก
- AST kind: ประเภท AST node
- Flags: import/export/public member flags

### 9. Items vs Members

- Items: Top-level entries (class, function, interface, ฯลฯ)
- Members: Direct children ของ items (methods, fields, variants)
- Flat source ยังคง flat: Go receiver methods และ Rust impl blocks เป็น top-level entries

### 10. Outline Extraction Rules

ast-grep outline ใช้ extraction rules สำหรับแปลง source code เป็น outline entries:

- Default rules: bundled extractors สำหรับ supported languages
- Custom language rules: ลงทะเบียนใน `customLanguages.<name>.outlineRules` ใน `sgconfig.yml`
- Command-line rules: โหลดผ่าน `--outline-rules`
- ทั้งสามแหล่งรวมกันโดย default; ใช้ `--no-default-outline-rules` เพื่อแทนที่ bundled rules
- Rule file เป็น stream ของ YAML documents แยกด้วย `---`
- แต่ละ rule มี: `id`, `language`, `role` (item/member), `symbolType`, `rule`, `name`, `signature`
- `isImport`, `isExported`, `isPublic` เป็น boolean หรือ predicate rule
- Member rules ใช้ `parentRuleIds` สำหรับ attach ไปยัง item ที่ contain มัน
- ใช้ `transform` และ `rewriters` สำหรับ signature generation

### 11. Exit Codes

- `0`: command completed (รวม empty outline)
- `2`: fatal read, parse, หรือ configuration error
- Invalid CLI arguments รายงานโดย clap

## Expected Outcome

- เข้าใจวิธีใช้ ast-grep outline สำหรับ code navigation
- สามารถ explore code structure อย่างรวดเร็วโดยไม่ต้องอ่านทั้ง file
- สามารถ filter symbols ด้วย pattern, type, และ view options
- สามารถใช้ JSON output สำหรับ machine-readable consumption
- เข้าใจ design principles, extraction rules และ limitations ของ outline
- สามารถใช้ custom outline rules สำหรับ project-specific extraction
