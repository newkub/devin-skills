# analyze-codebase-quality

A static analysis CLI tool that scans your codebase for quality issues across 8 dimensions: structure, foundation, runtime, UX, localization, features, errors, and missing implementation.

## Quick Start

Install and run with bun:

```bash
bun add -g analyze-codebase-quality
analyze-codebase-quality .
```

Or run locally after cloning:

```bash
bun install
bun run build
bun run dist/cli.js .
```

## Usage

```bash
# Analyze current directory
analyze-codebase-quality .

# Analyze a specific project
analyze-codebase-quality /path/to/project

# JSON output
analyze-codebase-quality . --json --output=report.json

# Single category
analyze-codebase-quality . --category=structure --severity=high

# Quiet (table only)
analyze-codebase-quality . --quiet
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `[path]` | Project path to analyze | `.` |
| `--output=<path>` | Save report to file | stdout |
| `--format=<type>` | Output format: table, json, markdown, plain | `table` |
| `--category=<name>` | Run a single category | all |
| `--severity=<level>` | Minimum severity: critical, high, medium, low | `low` |
| `--json` | Shortcut for `--format=json` | - |
| `--quiet, -q` | Summary only, no details | false |
| `--no-detail` | Table only, no issue details | false |
| `--no-color` | Disable colored output | false |
| `--list-categories` | List all analysis categories | - |
| `--help, -h` | Show help | - |

## Categories

| Category | Description |
|----------|-------------|
| `structure` | File length, imports, SRP violations, naming, barrel exports |
| `foundation` | Type safety, hard code, anti-patterns, complexity, naming |
| `runtime` | Error handling, async, concurrency, security, performance |
| `ux` | WCAG, ARIA, keyboard nav, interaction patterns (frontend only) |
| `localization` | Hardcoded strings, RTL, locale, pluralization (frontend only) |
| `features` | Feature completeness, docs, tests, dependencies |
| `errors` | Build artifacts, test failures, error patterns |
| `missing-implementation` | TODO, MOCK, placeholder, missing types, infrastructure gaps |

## SDK

```typescript
import { analyzeAll, createConfig } from "analyze-codebase-quality";

const config = createConfig("./my-project");
const report = analyzeAll(config);
```

## Project Structure

```text
src/
├── adapters/
│   └── filesystem/
│       └── file-adapter.ts    # File system utilities
├── application/
│   └── orchestrator.ts        # Analysis orchestration
├── config.ts                  # Configuration logic
├── domain/
│   └── analyzers/             # 8 quality analyzers
│       ├── index.ts
│       ├── structure.ts
│       ├── foundation.ts
│       ├── runtime.ts
│       ├── ux.ts
│       ├── localization.ts
│       ├── features.ts
│       ├── errors.ts
│       └── missing-implementation.ts
├── index.ts                   # Library barrel export
├── presentation/
│   └── cli/
│       └── cli.ts             # CLI entry point
└── shared/                    # Types, constants, utils, colors, formatter
    ├── index.ts
    ├── types.ts
    ├── constants.ts
    ├── utils.ts
    ├── colors.ts
    └── formatter.ts
```

## Scripts

```jsonc
{
  "dev": "bunx bunup --watch",
  "build": "bunx bunup",
  "typecheck": "bunx tsc --noEmit",
  "test": "bun test",
  "lint": "bunx biome lint src/",
  "format": "bunx biome format --write src/"
}
```

## Tech Stack

- Runtime: Bun
- Language: TypeScript
- Build: bunup
- Linting: Biome
- Testing: Bun Test

## License

MIT
