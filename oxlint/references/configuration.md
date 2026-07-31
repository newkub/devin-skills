# Configuration

Configuration options for oxlint

## Configuration Files

Oxlint looks for config files in this order:
1. `.oxlintrc.json`
2. `.oxlintrc` 
3. `oxlint.config.ts`
4. `oxlint.config.js`
5. `oxlint.config.mjs`

## JSON Configuration (.oxlintrc.json)

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "categories": {
    "correctness": "warn",
    "suspicious": "error",
    "perf": "off"
  },
  "rules": {
    "eslint/no-unused-vars": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "eslint/no-unused-vars": "off"
      }
    }
  ]
}
```

## TypeScript Configuration (oxlint.config.ts)

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

## Options Reference

### Categories

| Category | Description | Values |
|----------|-------------|--------|
| `correctness` | Potential bugs | `"error"`, `"warn"`, `"off"` |
| `suspicious` | Suspicious patterns | `"error"`, `"warn"`, `"off"` |
| `perf` | Performance issues | `"error"`, `"warn"`, `"off"` |

### Rules

| Rule | Type | Default | Description |
|------|------|---------|-------------|
| `eslint/no-unused-vars` | severity | `"off"` | Disallow unused variables |
| `typescript/no-floating-promises` | severity | `"off"` | Disallow floating promises |
| `react/no-unknown-property` | severity | `"off"` | Disallow unknown JSX properties |

### Severity Values

| Value | Description |
|-------|-------------|
| `"error"` | Errors will fail the build |
| `"warn"` | Warnings will be reported but won't fail |
| `"off"` | Disable the rule |

### Overrides

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

## Environment Variables

Oxlint does not require environment variables for basic usage.

## See Also

- [Installation](../guide/installation.md)
- [CLI Commands](./cli.md)