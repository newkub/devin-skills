# Biome CLI Reference

## Global Flags

| Flag | Description |
|------|-------------|
| `--version` | Show version |
| `--help` | Show help |
| `--config-path` | Path to config file |
| `--max-diagnostics` | Maximum diagnostics to report |

## biome init

Initialize a new Biome configuration.

```bash
biome init [directory]
```

Options:
- `--write` - Write to directory (default: current)

## biome format

Format source files.

```bash
biome format [files...]
```

Options:
| Option | Description |
|--------|-------------|
| `--write` | Write formatted files |
| `--dry-run` | Show what would be formatted |
| `--stdin-file-name` | Read from stdin with filename |
| `--indent-style` | Override indent style |
| `--line-width` | Override line width |
| `--include` | Include patterns |
| `--exclude` | Exclude patterns |
| `--error-on` | Error on specific severity |

## biome lint

Lint source files.

```bash
biome lint [files...]
```

Options:
| Option | Description |
|--------|-------------|
| `--write` | Apply safe fixes |
| `--unsafe` | Apply unsafe fixes |
| `--diagnostic-level` | Minimum diagnostic level |
| `--include` | Include patterns |
| `--exclude` | Exclude patterns |

## biome check

Run format + lint.

```bash
biome check [files...]
```

Options:
| Option | Description |
|--------|-------------|
| `--write` | Apply fixes |
| `--unsafe` | Apply unsafe fixes |
| `--staged` | Only check staged files |
| `--error-on` | Error on unresolved diagnostics |
| `--include` | Include patterns |
| `--exclude` | Exclude patterns |

## biome ci

CI mode (non-interactive).

```bash
biome ci [files...]
```

Options:
| Option | Description |
|--------|-------------|
| `--reporter` | Output format (default, json, github-annotations) |
| `--changes-if-related` | Check files related to changes |

## biome migrate

Migrate configurations from other tools.

```bash
biome migrate [tool]
```

Tools:
- `eslint` - Migrate ESLint config
- `prettier` - Migrate Prettier config

Options:
| Option | Description |
|--------|-------------|
| `--write` | Write migrated config |
| `--include` | Pattern to include |

## biome version

Show version.

```bash
biome --version
```

## biome config

Manage configuration.

```bash
biome config <subcommand>
```

Subcommands:
- `validate` - Validate configuration

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Internal error |
| 2 | Invalid command line |
| 3 | Analysis failed |
| 4 | Fix failed |

## Examples

```bash
# Format single file
biome format src/index.ts

# Format with custom config
biome format src --config-path=biome.prod.json

# Lint and apply fixes
biome lint src --write

# CI check with GitHub annotations
biome ci src --reporter=github-annotations

# Migrate ESLint config
biome migrate eslint --write

# Staged files only
biome check --staged
```