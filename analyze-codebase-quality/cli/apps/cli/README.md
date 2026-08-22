# analyze-codebase-quality

Analyze codebase quality across all dimensions - structure, foundation, runtime, UX, localization, features, errors, and missing implementation.

## Usage

```bash
# Analyze current directory
bun run dist/cli.js .

# Analyze specific project
bun run dist/cli.js /path/to/project

# Output as JSON
bun run dist/cli.js . --json

# Save report to file
bun run dist/cli.js . --output=report.md

# Run single category
bun run dist/cli.js . --category=structure

# Show help
bun run dist/cli.js --help
```

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

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--category=<name>` | all | Run single category |
| `--json` | false | Output as JSON |
| `--output=<path>` | stdout | Save report to file |
| `--help`, `-h` | - | Show help |

## Build

```bash
# Build shared package first
bun --filter @analyze-codebase-quality/shared build

# Build CLI
bun --filter analyze-codebase-quality build
```

## Development

```bash
# Watch mode
bun --filter analyze-codebase-quality dev

# Run tests
bun --filter analyze-codebase-quality test
```

## Project Structure

```text
apps/cli/
├── src/
│   ├── analyzers/           # Analysis modules
│   │   ├── structure.ts
│   │   ├── foundation.ts
│   │   ├── runtime.ts
│   │   ├── ux.ts
│   │   ├── localization.ts
│   │   ├── features.ts
│   │   ├── errors.ts
│   │   └── missing-implementation.ts
│   ├── cli/                 # CLI commands
│   │   └── commands.ts
│   ├── types/               # Type definitions
│   │   └── cli-options.ts
│   ├── utils/               # Utilities
│   │   └── reporter.ts
│   ├── cli.ts               # CLI entry point
│   ├── orchestrator.ts      # Analysis orchestrator
│   ├── config.ts            # Config creation
│   ├── file-utils.ts        # File utilities
│   └── index.ts             # Barrel export
├── bunup.config.ts          # Build config
├── tsconfig.json            # TypeScript config
└── package.json
```

## License

MIT
