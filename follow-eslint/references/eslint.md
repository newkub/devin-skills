# ESLint Reference

## Overview

ESLint is a pluggable JavaScript/TypeScript linter. Since v9.0.0, flat config (`eslint.config.js`) is the default configuration format. The legacy eslintrc format is deprecated.

## Install

```bash
bun add -D eslint @eslint/js typescript-eslint
```

Quick start with interactive setup:

```bash
bun create @eslint/config@latest
```

## Version Info

- **eslint latest stable:** `10.9.1`
- **@eslint/js latest stable:** `10.0.1`
- **typescript-eslint latest stable:** `8.68.0`
- **License:** MIT
- **Node.js:** `^20.19.0`, `^22.13.0`, or `>=24`
- **Source:** https://eslint.org/docs/latest/use/getting-started

## Peer Dependencies

- `eslint`: peer dep `jiti` (optional, required for TypeScript config files in Node.js)
- `typescript-eslint`: peer deps `eslint` `^8.57.0 || ^9.0.0 || ^10.0.0`, `typescript` `>=4.8.4 <6.1.0`
- `@eslint/js`: peer dep `eslint` `^10.0.0` (optional)

For TypeScript config files (`eslint.config.ts`) in Node.js, install `jiti`:

```bash
bun add -D jiti
```

Bun and Deno natively support TypeScript configuration files without `jiti`.

## Configuration

### Configuration file names (precedence order)

1. `eslint.config.js`
2. `eslint.config.mjs`
3. `eslint.config.cjs`
4. `eslint.config.ts`
5. `eslint.config.mts`
6. `eslint.config.cts`

### Flat config with `defineConfig`

```typescript
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
]);
```

### Configuration object properties

- `name` - Name for the configuration object
- `files` - Array of glob patterns for files to apply
- `ignores` - Array of glob patterns for files to exclude
- `extends` - Array of configs to extend
- `languageOptions` - Settings for `ecmaVersion`, `sourceType`, `globals`, `parser`
- `plugins` - Object mapping plugin names to plugin objects
- `rules` - Object mapping rule names to severity levels

### Rule severity levels

- `"off"` or `0` - turn the rule off
- `"warn"` or `1` - turn the rule on as a warning
- `"error"` or `2` - turn the rule on as an error

### CommonJS format

If `package.json` has `"type": "commonjs"`:

```javascript
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
]);
```

## CLI Commands

```bash
# Lint all files in current directory
eslint .

# Lint specific files
eslint src/ test/

# Auto-fix issues
eslint . --fix

# Output JSON report
eslint . --format json -o eslint-report.json

# Use a specific config file
eslint -c eslint.config.ts
```

When no file arguments are passed, ESLint defaults to linting the current directory (`.`).

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:report": "eslint . --format json -o eslint-report.json"
  }
}
```

## VS Code Integration

```json
{
  "eslint.validate": ["javascript", "typescript", "vue"],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Migration from v8 to v9+

Use the codemod to migrate eslintrc to flat config:

```bash
npx @eslint/v8-to-v9-config
```

Key changes in v9+:
- `eslint.config.js` is the default config format
- `.eslintrc` is deprecated
- `.eslintignore` is removed (use `ignores` in flat config)
- `eslint .` works without explicit file patterns

## Source

- https://eslint.org/docs/latest/use/getting-started
- https://eslint.org/docs/latest/use/configure/configuration-files
- https://eslint.org/docs/latest/use/migrate-to-9.0.0
