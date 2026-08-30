# Oxlint Reference

## Overview

Oxlint is a Rust-powered linter for JavaScript and TypeScript, part of the Oxc project. It is 50-100x faster than ESLint and works with zero configuration. The `eslint-plugin-oxlint` package turns off ESLint rules that Oxlint already handles, avoiding duplicate reports.

## Install

```bash
bun add -D oxlint eslint-plugin-oxlint
```

Run without installing:

```bash
bunx oxlint@latest
```

## Version Info

- oxlint latest stable: `1.80.0`
- eslint-plugin-oxlint latest stable: `1.80.0`
- License: MIT
- Node.js: `^20.19.0 || >=22.12.0`
- Source: https://oxc.rs/docs/guide/usage/linter/quickstart.html

## Peer Dependencies

- `oxlint`: optional peer deps `vite-plus`, `oxlint-tsgolint`
- `eslint-plugin-oxlint`: peer dep `oxlint` `~1.80.0`

## Configuration

Oxlint works out of the box. To customize, create a config file.

### JSON config (`.oxlintrc.json`)

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "categories": {
    "correctness": "warn"
  },
  "rules": {
    "eslint/no-unused-vars": "error"
  }
}
```

### TypeScript config (`oxlint.config.ts`)

```typescript
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  rules: {
    "eslint/no-unused-vars": "error",
  },
});
```

### Linter options

```json
{
  "options": {
    "typeAware": true,
    "typeCheck": true,
    "maxWarnings": 10
  }
}
```

### Plugins

```json
{
  "plugins": ["unicorn", "typescript", "oxc"]
}
```

Built-in plugins: `eslint`, `typescript`, `unicorn`, `oxc`.

### Categories

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "pedantic": "off"
  }
}
```

Available categories: `correctness`, `suspicious`, `pedantic`, `perf`, `style`, `restriction`, `nursery`.

### Severity values

- `"off"` or `"allow"` - disable rule
- `"warn"` - warning
- `"error"` or `"deny"` - error

### Rule options

```json
{
  "rules": {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
  }
}
```

## ESLint Integration

### Using `flat/recommended` config

```javascript
import oxlint from "eslint-plugin-oxlint";

export default [
  oxlint.configs["flat/recommended"],
];
```

### Using `buildFromOxlintConfig`

```javascript
import oxlint from "eslint-plugin-oxlint";

export default [
  oxlint.buildFromOxlintConfig({
    plugins: ["react", "typescript", "import"],
  }),
];
```

### Available flat configs

| Config | Description |
|--------|-------------|
| `flat/recommended` | correctness category |
| `flat/all` | all rules |
| `flat/eslint` | turns off ESLint rules |
| `flat/import` | turns off import plugin rules |
| `flat/react` | turns off React plugin rules |
| `flat/typescript` | turns off TypeScript plugin rules |

Place the oxlint config last in the array to turn off rules that overlap with ESLint.

## CLI Commands

```bash
# Lint current directory
oxlint

# Auto-fix
oxlint --fix

# Apply suggestions (may change behavior)
oxlint --fix-suggestions

# Apply dangerous fixes
oxlint --fix-dangerously

# Initialize config file
oxlint --init

# Type-aware linting
oxlint --type-aware

# Only report errors (suppress warnings)
oxlint --quiet

# Fail if any warnings found
oxlint --deny-warnings

# Max warnings threshold
oxlint --max-warnings 0

# JSON output
oxlint -f json

# Print effective config for a file
oxlint --print-config path/to/file.ts

# List available rules
oxlint --rules

# Ignore patterns
oxlint --ignore-pattern "dist/**"

# Use explicit ignore file
oxlint --ignore-path .oxlintignore
```

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "oxlint --type-aware",
    "lint:fix": "oxlint --type-aware --fix"
  }
}
```

## Pre-commit with lint-staged

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "bun run lint"
  }
}
```

## Source

- https://oxc.rs/docs/guide/usage/linter/quickstart.html
- https://oxc.rs/docs/guide/usage/linter/config.html
- https://github.com/oxc-project/eslint-plugin-oxlint
