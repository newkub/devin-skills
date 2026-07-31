# Biome Linter

## Overview

Biome linter provides 200+ rules to catch common mistakes and enforce best practices.

## Key Concepts

### Rule Categories

- **a11y**: Accessibility issues
- **complexity**: Code complexity
- **correctness**: Potential bugs
- **performance**: Performance issues
- **security**: Security vulnerabilities
- **style**: Code style
- **suspicious**: Suspicious code patterns
- **nursery**: Experimental rules

### Rule Levels

- **error**: Will fail CI
- **warn**: Warning only
- **off**: Disabled

### Safe vs Unsafe Fixes

- **Safe fixes**: Guaranteed not to break code
- **Unsafe fixes**: May change behavior (requires --unsafe flag)

## Recommended Rules

Enable recommended rules for best practices:

```json
{
  "linter": {
    "rules": {
      "recommended": true
    }
  }
}
```

## Custom Rules

Override specific rules:

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "noVar": "error"
      }
    }
  }
}
```

## Usage

```bash
# Lint files
bunx biome lint ./src

# Apply safe fixes
bunx biome lint --write ./src

# Apply unsafe fixes
bunx biome lint --write --unsafe ./src

# Set minimum diagnostic level
bunx biome lint --diagnostic-level=error ./src
```

## Type-Aware Rules

Biome supports TypeScript-specific rules that use type information:

```json
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  }
}
```
