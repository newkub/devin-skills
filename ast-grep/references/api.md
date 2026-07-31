# API

## Programmatic API

ast-grep provides a programmatic API for integrating into build tools, editors, and custom workflows.

### bun Package

```typescript
import {Sg} from '@ast-grep/cli';

// Create instance
const sg = new Sg({lang: 'typescript'});

// Search
const results = await sg.search({
  pattern: 'console.log($ARG)',
  path: './src',
});

// Rewrite
await sg.rewrite({
  pattern: '$A && $A()',
  rewrite: '$A?.()',
  path: './src',
});

// Run rules
const violations = await sg.run({
  rule: 'no-console-log',
  path: './src',
});
```

### API Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `sg.search()` | pattern, path, options | `Match[]` | Search for AST patterns |
| `sg.rewrite()` | pattern, rewrite, path | `RewriteResult[]` | Apply rewrite rules |
| `sg.run()` | rule, path | `Violation[]` | Run lint rules |
| `sg.lint()` | path, options | `LintResult` | Run all lint rules |

### Configuration

```typescript
const sg = new Sg({
  lang: 'typescript',
  config: 'sg.config.yml',
  ruleDirs: ['./rules'],
  include: ['src/**/*.ts'],
  exclude: ['**/*.test.ts'],
});
```

### Return Types

```typescript
// Match result
interface Match {
  file: string;
  line: number;
  column: number;
  content: string;
  range: {start: Pos, end: Pos};
}

// Rewrite result
interface RewriteResult {
  file: string;
  original: string;
  rewritten: string;
  success: boolean;
}

// Violation
interface Violation {
  rule: string;
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
  fix?: string;
}
```

### Node.js Integration

```typescript
import {run} from '@ast-grep/cli';

// CLI-style execution
run(['sg', 'run', '--rule', 'no-console'])
  .then(() => console.log('Done'))
  .catch(err => console.error(err));
```

### Rust API

```rust
use ast_grep_core::run;

// Run search
let results = run()
    .pattern("console.log($ARG)")
    .lang("typescript")
    .path("./src")
    .run()?;
```

### Python API

```python
import ast_grep as sg

# Search
result = sg.search(
    pattern="console.log($ARG)",
    lang="typescript",
    path="./src"
)

# Rewrite
sg.rewrite(
    pattern="$A && $A()",
    rewrite="$A?.()",
    path="./src"
)
```

## Language Support

| Language | Package | Status |
|----------|---------|--------|
| TypeScript/JavaScript | `@ast-grep/cli` | Stable |
| Rust | `ast-grep` crate | Stable |
| Python | `ast-grep` | Beta |

## Related

- [CLI Reference](cli.md)
- [Configuration Reference](configuration.md)