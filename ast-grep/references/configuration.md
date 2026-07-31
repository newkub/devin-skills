# configuration

## index.md

# Configuration Reference

## Configuration File (sg.config.yml)

```yaml
# Required: Programming language
language: typescript

# Rule directories
ruleDirs:
  - rules/
  - custom-rules/

# File inclusion/exclusion
include:
  - "src/**/*.ts"
  - "lib/**/*.ts"
exclude:
  - "**/*.test.ts"
  - "**/node_modules/**"
```

## Rule Configuration

### Basic Rule Structure

```yaml
id: rule-id
language: typescript
rule:
  pattern: code pattern
message: "Error message"
severity: error
```

### Full Rule Example

```yaml
id: no-console-log
language: typescript
rule:
  pattern: console.log($ARG)
message: "Avoid console.log in production. Use a proper logger."
severity: warning
fix:
  rule: console.log($ARG)
  value: logger.info($ARG)
```

## Rule Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique rule identifier |
| `language` | string | Target language |
| `rule.pattern` | string | AST pattern |
| `rule.has` | object | Must have condition |
| `rule.not` | object | Must not have condition |
| `rule.inside` | object | Must be inside condition |
| `message` | string | Error message |
| `severity` | string | error, warning, info, hint |
| `fix` | object | Auto-fix configuration |

## Pattern Fields

| Field | Description |
|-------|-------------|
| `pattern` | Main pattern to match |
| `has` | Pattern must contain |
| `not` | Pattern must not contain |
| `inside` | Pattern must be inside |
| `nthChild` | Position in parent |
| `range` | Line/column range |

## Severity Levels

| Level | Exit Code | Use Case |
|-------|-----------|----------|
| error | 1 | Critical issues |
| warning | 0 | Potential problems |
| info | 0 | Informational |
| hint | 0 | Suggestions |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AST_GREP_CONFIG` | sg.config.yml | Config path |
| `AST_GREP_TIMEOUT` | 30 | Timeout (seconds) |
| `AST_GREP_CACHE` | .ast-grep-cache | Cache directory |
| `AST_GREP_FORMAT` | text | Output format |

## Language Configuration

```yaml
language: typescript
typescript:
  extensions:
    - .ts
    - .tsx
  parser: tree-sitter-typescript
```

## Glob Patterns

```yaml
include:
  - "src/**/*.ts"
  - "lib/**/*.js"
exclude:
  - "**/*.test.ts"
  - "**/dist/**"
```

## Per-Rule Override

```yaml
rules:
  - id: no-console
    severity: error
  - id: use-const
    severity: warning
```

---

