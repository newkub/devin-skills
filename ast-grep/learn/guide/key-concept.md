# Key Concepts

แนวคิดหลักและหลักการทำงานของ ast-grep

## Pattern Matching

ast-grep ใช้ AST (Abstract Syntax Tree) แทน text matching ทำให้:
- Match code structure ไม่ใช่ text เท่านั้น
- เข้าใจ syntax และ semantics ของ code
- Handle formatting และ whitespace อัตโนมัติ

## Metavariables

ใช้ `$VAR` สำหรับ capture ทุก AST node:

```yaml
pattern: console.log($ARG)
fix: console.warn($ARG)
```

Metavariables สามารถใช้ใน fix template เพื่อ reuse captured nodes

## Rule Types

### Atomic Rules
- `pattern`: match code syntax
- `kind`: match AST node type
- `regex`: match text with regex
- `nthChild`: match by position
- `range`: match by range

### Relational Rules
- `inside`: match inside another node
- `has`: match containing another node
- `precedes`: match before another node
- `follows`: match after another node

### Composite Rules
- `all`: all conditions must match
- `any`: any condition must match
- `not`: condition must not match
- `matches`: match pattern

## Configuration

ast-grep ใช้ YAML configuration สำหรับ:
- Define rules
- Set language-specific settings
- Configure test cases
- Define rewriters

## Strictness Levels

- `smart`: default, balance precision and recall
- `ast`: strict AST matching
- `cst`: include comments and whitespace
- `relaxed`: more flexible matching
