# How It Works

หลักการทำงานภายในของ ast-grep

## Architecture

```
Source Code
    ↓
Parser (tree-sitter)
    ↓
AST (Abstract Syntax Tree)
    ↓
Pattern Matcher
    ↓
Matched Nodes
    ↓
Fix/Rewriter
    ↓
Transformed Code
```

## Parsing Phase

1. **Language Detection**: ตรวจสอบ file extension และ content
2. **Tree-sitter Parser**: ใช้ tree-sitter สำหรับ parse code เป็น AST
3. **AST Construction**: สร้าง tree structure ที่แสดง code syntax

## Pattern Matching Phase

1. **Pattern Compilation**: แปลง pattern เป็น AST query
2. **Tree Traversal**: เดินทางผ่าน AST tree
3. **Node Comparison**: เปรียบเทียบ AST nodes กับ pattern
4. **Metavariable Capture**: เก็บค่าของ metavariables

## Rewrite Phase

1. **Fix Template**: ใช้ metavariables ใน fix pattern
2. **AST Reconstruction**: สร้าง AST ใหม่จาก fix pattern
3. **Code Generation**: แปลง AST กลับเป็น source code
4. **Formatting**: apply formatting rules

## Example

```yaml
pattern: $A && $A()
fix: $A?.()
```

**Process:**
1. Parse `foo && foo()` → AST
2. Match pattern with metavariable `$A = foo`
3. Apply fix: `foo?.()`
4. Generate code: `foo?.()`

## Performance

- **Incremental Parsing**: parse เฉพาะไฟล์ที่เปลี่ยน
- **Parallel Processing**: process multiple files พร้อมกัน
- **Caching**: cache AST สำหรับ reuse
