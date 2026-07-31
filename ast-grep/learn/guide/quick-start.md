# Quick Start

เริ่มต้นใช้งาน ast-grep อย่างรวดเร็ว

## Basic Search

ค้นหา pattern ใน code:

```bash
ast-grep --pattern 'console.log($ARG)' --lang ts ./src
```

## Pattern with Metavariables

ใช้ metavariables สำหรับ capture nodes:

```bash
ast-grep --pattern '$PROP && $PROP()' --lang ts ./src
```

## Rewrite Code

แก้ไข code อัตโนมัติ:

```bash
ast-grep -p '$A && $A()' -l ts -r '$A?.()' --interactive
```

## Using Rules

สร้าง rule file และรัน scan:

```bash
ast-grep scan --config sgconfig.yml
```

## Common Patterns

- **Find double negation**: `!!$VAR`
- **Find console.log**: `console.log($ARG)`
- **Find nested ternary**: `$A ? $B ? $C : $D : $E`
