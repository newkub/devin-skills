# Programmatic API

Knip มี CLI สำหรับ detect unused files, dependencies และ exports

## CLI Commands

```bash
# Install knip
bun install -D knip

# Analyze project (check only)
knip

# Auto-fix unused items
knip --fix

# Check specific directory
knip src

# Show statistics
knip --statistics
```

## Configuration (knip.json)

```json
{
  "entry": [
    "src/index.ts",
    "bin/cli.js"
  ],
  "project": [
    "src/**/*.ts",
    "bin/**/*.js"
  ],
  "ignore": [
    "**/node_modules/**",
    "**/dist/**"
  ],
  "ignoreDependencies": [
    "typescript"
  ]
}
```

## Configuration in package.json

```json
{
  "name": "my-project",
  "scripts": {
    "knip": "knip"
  },
  "devDependencies": {
    "knip": "^6.0.0"
  },
  "knip": {
    "entry": ["src/index.ts"],
    "project": ["src/**/*.ts"]
  }
}
```

## CI Integration

```yaml
# .github/workflows/ci.yml
- name: Check for unused dependencies
  run: npx knip
```

ดูรายละเอียดเพิ่มเติมที่: [Knip Documentation](https://knip.dev)
