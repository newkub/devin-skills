# ESLint - CLI Reference

Commands และ options สำหรับ ESLint CLI

## Basic Commands

### npx eslint

```bash
# Lint all files
npx eslint .

# Lint specific files
npx eslint src/
npx eslint "src/**/*.js"

# Lint with config
npx eslint --config ./eslint.config.js .
```

## Core Options

### --fix

Auto-fix fixable issues.

```bash
# Fix all fixable issues
npx eslint --fix .

# Fix specific files
npx eslint --fix src/

# Fix with dry run (show changes)
npx eslint --fix-dry-run .
```

### --cache

Enable caching for faster linting.

```bash
# Enable cache (default location)
npx eslint --cache .

# Specify cache location
npx eslint --cache --cache-location ./node_modules/.cache/.eslintcache .

# Clear cache
npx eslint --cache --clear .
```

### --max-warnings

Exit with non-zero if warnings exceed limit.

```bash
# Fail on any warnings
npx eslint --max-warnings 0 .

# Allow up to 10 warnings
npx eslint --max-warnings 10 .
```

## Output Options

### --format

Specify output format.

```bash
# Stylish (default)
npx eslint --format stylish .

# JSON
npx eslint --format json .

# Compact
npx eslint --format compact .

# JUnit XML (for CI)
npx eslint --format junit .

# HTML
npx eslint --format html .

# Checkstyle
npx eslint --format checkstyle .

# Visual Studio
npx eslint --format visualstudio .

# Custom formatter
npx eslint --format ./my-formatter.js .
```

### --output-file

Write output to file.

```bash
# Save to file
npx eslint --format json --output-file ./lint-results.json .

# Combine with CI
npx eslint --format junit --output-file ./test-results.xml .
```

## File Selection

### --ignore-path

Specify .gitignore style file for ignores.

```bash
npx eslint --ignore-path .gitignore .
```

### --ignore-pattern

Add to ignore patterns.

```bash
# Ignore specific patterns
npx eslint --ignore-pattern "node_modules/**" .

# Multiple patterns
npx eslint --ignore-pattern "dist/**" --ignore-pattern "build/**" .
```

### --ext

Specify file extensions (legacy config only).

```bash
# Lint .js and .ts files
npx eslint --ext .js,.ts .

# Lint .vue files
npx eslint --ext .vue .
```

## Configuration

### --config

Specify config file.

```bash
# Use specific config
npx eslint --config ./my-eslint.config.js .

# Use legacy config
npx eslint --config .eslintrc.json .
```

### --env

Specify environments.

```bash
# Enable browser and node environments
npx eslint --env browser,node .

# Enable ES2022
npx eslint --env es2022 .
```

### --global

Define global variables.

```bash
# Define globals
npx eslint --global console:readonly,Promise:readonly .

# Writable globals
npx eslint --global jQuery:writable .
```

### --rule

Pass rules on command line.

```bash
# Set rule
npx eslint --rule "quotes: ['error', 'single']" .

# Multiple rules
npx eslint --rule "quotes: error" --rule "semi: error" .
```

## Parsing Options

### --parser

Specify parser.

```bash
# Use TypeScript parser
npx eslint --parser @typescript-eslint/parser .

# Use Babel parser
npx eslint --parser @babel/eslint-parser .
```

### --parser-options

Pass parser options.

```bash
# ECMAScript version
npx eslint --parser-options ecmaVersion:2022 .

# Source type
npx eslint --parser-options sourceType:module .

# Multiple options
npx eslint --parser-options ecmaVersion:2022,sourceType:module .
```

## Plugin Options

### --plugin

Load plugin.

```bash
# Load React plugin
npx eslint --plugin react .

# Load multiple plugins
npx eslint --plugin react --plugin vue .
```

### --rulesdir

Load rules from directory.

```bash
# Custom rules directory
npx eslint --rulesdir ./my-rules .

# Multiple directories
npx eslint --rulesdir ./rules --rulesdir ./more-rules .
```

## Debugging

### --debug

Enable debug output.

```bash
npx eslint --debug .
```

### --print-config

Print resolved config for file.

```bash
npx eslint --print-config .eslint.config.js
```

### --no-cache

Disable caching.

```bash
npx eslint --no-cache .
```

## Environment Variables

```bash
# Debug mode
DEBUG=eslint:* npx eslint .

# Disable color
NO_COLOR=1 npx eslint .

# Cache path
ESLINT_CACHE_LOCATION=./cache/.eslintcache npx eslint .
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | No linting errors |
| 1 | Linting errors found |
| 2 | Configuration error |

## Common Workflows

### Pre-commit Linting

```bash
# Lint staged files
npx eslint --cache {staged_files}
```

### CI Linting

```bash
# Strict mode with JSON output
npx eslint --format json --max-warnings 0 --output-file lint-results.json .
```

### Auto-fix on Save

```bash
# Dry run fix
npx eslint --fix-dry-run . | head -20

# Apply fixes
npx eslint --fix .
```

## Configuration Example

```javascript
// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'error'
    }
  }
];
```

## Troubleshooting

```bash
# Verbose output
npx eslint --debug .

# Check config
npx eslint --print-config .

# Verify cache
npx eslint --cache-info .

# Force clean cache
npx eslint --cache --clear .
```

## Summary

```text
┌─────────────────────────────────────────────────┐
│              ESLint CLI Options                   │
├─────────────────────────────────────────────────┤
│                                                  │
│   Fixing:                                        │
│   --fix, --fix-dry-run                          │
│                                                  │
│   Caching:                                      │
│   --cache, --cache-location, --clear           │
│                                                  │
│   Output:                                        │
│   --format, --output-file, --color             │
│                                                  │
│   Files:                                        │
│   --ignore-path, --ignore-pattern, --ext        │
│                                                  │
│   Config:                                        │
│   --config, --rule, --plugin                    │
│                                                  │
│   Parsing:                                      │
│   --parser, --parser-options                    │
│                                                  │
│   Debug:                                        │
│   --debug, --print-config, --no-cache          │
│                                                  │
└─────────────────────────────────────────────────┘
```