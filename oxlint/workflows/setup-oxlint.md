# Setup Oxlint

## Description

Setup Oxlint ใน project

## Steps

### 1. Install Oxlint

```bash
bun install -D oxlint
```

### 2. Initialize Config

```bash
oxlint --init
```

### 3. Customize Config

```json
// .oxlintrc.json
{
  "categories": {
    "correctness": "warn",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn",
    "restriction": "warn",
    "nursery": "allow"
  },
  "ignore": [
    "node_modules/**",
    "dist/**"
  ]
}
```

### 4. Add Scripts

```json
// package.json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

### 5. Run Lint

```bash
bun run lint
```

## Best Practices

1. **Initialize Config**: ใช้ --init สำหรับ initial config
2. **Customize**: Customize config ตาม project needs
3. **Add Scripts**: Add scripts สำหรับ convenience
4. **Document**: Document configuration choices
