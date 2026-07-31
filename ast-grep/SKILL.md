---
name: ast-grep
description: "AST-based structural search, lint และ rewriting tool สำหรับ polyglot code transformation"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน ast-grep สำหรับ structural code search, linting และ rewriting ด้วย AST patterns บน multiple languages


## Scope

ใช้สำหรับค้นหา code patterns ด้วย AST-based matching, สร้าง custom lint rules, ทำ code transformation และ refactoring อัตโนมัติ, scan codebase สำหรับ code smells และ anti-patterns, และ integrate กับ editor ผ่าน LSP


## Execute

- ติดตั้ง ast-grep ตาม `workflows/update-installation.md`
- เรียนรู้ pattern syntax จาก `learn/guide/key-concept.md`
- ค้นหา patterns ด้วย `ast-grep -p '$PATTERN'` หรือ `sg -p '$PATTERN'`
- แก้ไข code ด้วย `ast-grep -p '$PATTERN' --rewrite '$REWRITE'`
- สร้าง lint rules ตาม `workflows/update-create-rule.md`
- Scan codebase ตาม `workflows/update-scan-codebase.md`
- Test rules ตาม `workflows/update-test-rule.md`
- Configure project ตาม `workflows/update-configuration.md`
- อ่าน `learn/key-concepts/` สำหรับ pattern matching, metavariables, rule types
- อ่าน `learn/principles/` สำหรับ atomic-first, compose rules, test-driven
- อ่าน `references/` สำหรับ API docs, CLI, และ configuration


## Rules

### Pattern Syntax

- ใช้ metavariables `$VAR` สำหรับ match any single AST node (เช่น `$PROP`, `$MATCH`)
- ใช้ multi-metavariables `$$$VARS` สำหรับ match zero or more AST nodes
- เขียน patterns เหมือนเขียน code ตามปกติ (pattern ต้องเป็น valid code)
- ใช้ single quotes `'` สำหรับ patterns เพื่อป้องกัน shell expansion
- Pattern ต้อง parse ได้ด้วย tree-sitter (ใช้ playground เพื่อ debug)

### Rule Configuration

- ใช้ YAML configuration สำหรับ lint rules
- Atomic rules: `pattern`, `kind`, `regex`, `nthChild`, `range`
- Relational rules: `inside`, `has`, `follows`, `precedes`
- Composite rules: `all`, `any`, `not`, `matches`
- Test rules ก่อนใช้งานจริงด้วย `ast-grep test`

### Command Line Usage

- ใช้ `--lang` หรือ `-l` สำหรับระบุภาษา (ถ้าจำเป็น)
- ใช้ `--rule` สำหรับ run rules จาก YAML files
- ใช้ `--inline-rules` สำหรับ run rules โดยตรงจาก command line
- ใช้ `--interactive` หรือ `-i` สำหรับ interactive rewriting
- ใช้ `--json` สำหรับ JSON output
- บน Linux ใช้ `ast-grep` แทน `sg` (conflict กับ setgroups command)

### Best Practices

- เริ่มจาก atomic patterns ก่อน compose rules
- Test rules ด้วย snapshot tests
- ใช้ playground สำหรับ debug patterns
- ใช้ code blocks สำหรับ examples และ patterns
- ทำตาม `learn/principles/atomic-first.md` สำหรับ rule design


## Expected Outcome

- Code search ที่ accurate ด้วย AST matching
- Custom lint rules ที่ powerful และ reusable
- Code transformation ที่ automated และ safe
- Refactoring ที่ efficient และ scalable
- Integration กับ editor ผ่าน LSP
