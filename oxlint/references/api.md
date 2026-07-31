# Programmatic API

Programmatic usage of oxlint for CI/CD integration

## CLI as API

```bash
# Run and capture output
npx oxlint --format json > results.json

# CI mode (non-interactive)
CI=true npx oxlint
```

## GitHub Actions

```yaml
- name: Run oxlint
  run: npx oxlint --format json
```

## Configuration for CI

```json
{
  "categories": {
    "correctness": "error"
  },
  "rules": {
    "eslint/no-unused-vars": "error"
  }
}
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | No linting errors |
| `1` | Linting errors found |
| `2` | Configuration error |

## Programmatic Usage (Node.js)

```javascript
import { execSync } from 'child_process';

try {
  execSync('npx oxlint', { stdio: 'inherit' });
} catch (error) {
  console.error('Linting failed:', error.message);
  process.exit(1);
}
```

## Configuration Validation

```bash
# Validate configuration
oxlint --check-config
```

ดูรายละเอียดเพิ่มเติมที่: [Oxlint Documentation](https://oxc.rs/docs/guide/usage/linter)