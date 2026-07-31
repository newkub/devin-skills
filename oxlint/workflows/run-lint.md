# Run Lint

## Description

Run Oxlint สำหรับ linting code

## Steps

### 1. Run All Files

```bash
oxlint
```

### 2. Run Specific File

```bash
oxlint file.js
```

### 3. Run Directory

```bash
oxlint src/
```

### 4. Run with Pattern

```bash
oxlint "src/**/*.js"
```

## Options

### Auto-fix

```bash
oxlint --fix
```

### Check Only

```bash
oxlint --check
```

### Verbose

```bash
oxlint --verbose
```

### Show Rules

```bash
oxlint --rules
```

## Best Practices

1. **Run Before Commit**: Run lint ก่อน commit
2. **Use Auto-fix**: ใช้ --fix สำหรับ auto-fix
3. **Review Changes**: Review auto-fix changes
4. **Fix All Errors**: Fix all errors ก่อน commit
