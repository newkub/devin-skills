# Quick Start

## Description

เริ่มต้นใช้งาน Oxlint อย่างรวดเร็ว

## Steps

### 1. Initialize Config

```bash
oxlint --init
```

This creates `.oxlintrc.json` with default configuration.

### 2. Run Lint

```bash
oxlint
```

### 3. Auto-fix

```bash
oxlint --fix
```

### 4. Lint Specific File

```bash
oxlint file.js
```

### 5. Lint Directory

```bash
oxlint src/
```

## Common Commands

```bash
# Run lint
oxlint

# Auto-fix
oxlint --fix

# Check without fixing
oxlint --check

# Verbose output
oxlint --verbose

# Show rules
oxlint --rules
```

## Best Practices

1. **Use --init**: Initialize config ก่อนใช้
2. **Test First**: Test lint ก่อน auto-fix
3. **Review Changes**: Review auto-fix changes
4. **Commit Config**: Commit config file
