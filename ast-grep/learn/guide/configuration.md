# Configuration

การตั้งค่า ast-grep

## sgconfig.yml

สร้างไฟล์ `sgconfig.yml` ที่ root directory:

```yaml
ruleDirs:
  - rules
  - .ast-grep/rules

testDirs:
  - __tests__
  - tests

ignore:
  - node_modules
  - dist
  - build

language:
  ts:
    strictness: smart
  js:
    strictness: smart
```

## Rule File Structure

```yaml
id: no-console-log
language: ts
severity: warning
message: Avoid console.log in production
rule:
  pattern: console.log($ARG)
fix: logger.info($ARG)
```

## Configuration Options

### ruleDirs
Directories ที่เก็บ rule files:
```yaml
ruleDirs:
  - rules
  - custom-rules
```

### testDirs
Directories ที่เก็บ test cases:
```yaml
testDirs:
  - __tests__
  - tests
```

### ignore
Files และ directories ที่จะ ignore:
```yaml
ignore:
  - node_modules
  - dist
  - build
  - "*.min.js"
```

### language
Language-specific settings:
```yaml
language:
  ts:
    strictness: smart
  js:
    strictness: relaxed
```

## Rule Configuration

### id
Unique identifier สำหรับ rule:
```yaml
id: no-console-log
```

### language
Target programming language:
```yaml
language: ts
```

### severity
Severity level:
```yaml
severity: error  # error, warning, info, hint
```

### message
Description ที่แสดงเมื่อ match:
```yaml
message: Avoid console.log in production
```

### rule
Pattern matching rule:
```yaml
rule:
  pattern: console.log($ARG)
```

### fix
Automatic rewrite pattern:
```yaml
fix: logger.info($ARG)
```

### files/ignores
File filtering:
```yaml
files:
  - "src/**/*.ts"
ignores:
  - "src/**/*.test.ts"
```

## Environment Variables

```bash
export AST_GREP_CONFIG_PATH=/path/to/config
export AST_GREP_RULE_DIRS=/path/to/rules
```
