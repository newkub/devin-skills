# ast-grep Reference

## Overview

ast-grep is a structural search, lint, and rewrite tool for many languages using AST patterns. It is more precise than regex because it matches syntax tree nodes, not text.

## Install

```sh
# npm (global)
bun add @ast-grep/cli -g

# bun (ad-hoc — must pin the package; bare `bunx ast-grep` fetches an unrelated abandoned package)
bunx -p @ast-grep/cli ast-grep --help

# cargo
cargo install ast-grep --locked

# homebrew
brew install ast-grep

# pip
pip install ast-grep-cli
```

## Version

- Package: `@ast-grep/cli` (bins: `ast-grep`, `sg`)
- Latest: `0.45.3 (verified 2026-09-12)`
- Programmatic: `@ast-grep/napi` `0.45.3 (verified 2026-09-12)`
- License: MIT
- Peer dependencies: none (standalone binary via npm postinstall)

## CLI Commands

```sh
ast-grep --help              # show help
ast-grep new                 # scaffold project (creates sgconfig.yml + rules/)
ast-grep new rule            # create a new rule file
ast-grep scan                # scan project using rules in sgconfig.yml
ast-grep run -p 'PATTERN'    # ad-hoc search (default subcommand)
ast-grep run -p 'PATTERN' --rewrite 'NEW'  # ad-hoc rewrite
ast-grep test                # test rules against test cases
ast-grep outline             # inspect source structure
ast-grep lsp                 # start language server
ast-grep completions <shell> # print shell completions
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-p, --pattern <PATTERN>` | AST pattern to match |
| `-r, --rewrite <REWRITE>` | String to replace matched node |
| `-l, --lang <LANG>` | Target language (inferred from extension if omitted) |
| `-k, --kind <KIND>` | AST kind to match (ESQuery-style) |
| `--config <PATH>` | Path to `sgconfig.yml` |
| `--json pretty` | Structured JSON output |
| `--filter 'REGEX'` | Filter rules by id (scan only) |
| `-i, --interactive` | Interactive edit session |
| `-U, --update-all` | Apply all rewrites without prompting |
| `--format github` | Output format: `github` or `sarif` (scan only) |
| `--inspect summary` | Show project dir and config path (`nothing`, `summary`, `entity`) |
| `--min-severity <LEVEL>` | Only report findings at/above severity (added in 0.45.3) |
| `--error/--warning/--info/--hint/--off [RULE_ID]` | Override rule severity (scan only) |
| `--report-style <STYLE>` | Report verbosity: `rich` (default), `medium`, `short` |
| `-j, --threads <NUM>` | Number of threads (default: heuristic) |
| `--strictness <LEVEL>` | Pattern strictness: `cst`, `smart`, `ast`, `relaxed`, `signature`, `template` |

## sgconfig.yml Reference

Root configuration file for project scanning. Required for `ast-grep scan`.

```yaml
# Required: directories to discover rule files (relative to sgconfig.yml)
ruleDirs:
  - rules

# Optional: test case configuration
testConfigs:
  - testDir: rule-tests
    snapshotDir: __snapshots__

# Optional: directories for utility rules
utilDirs:
  - utils

# Optional: map languages to non-standard file extensions
languageGlobs:
  html: ['*.vue', '*.svelte', '*.astro']
  json: ['.eslintrc']
  tsx: ['*.ts']
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ruleDirs` | `List<String>` | Yes | Directories to discover YAML rules |
| `testConfigs` | `List<TestConfig>` | No | Test case configuration |
| `testConfigs[].testDir` | `String` | Yes | Directory for test cases |
| `testConfigs[].snapshotDir` | `String` | No | Snapshot directory (default: `__snapshots__`) |
| `utilDirs` | `List<String>` | No | Directories for global utility rules |
| `languageGlobs` | `HashMap<String, Array<String>>` | No | Map language to file glob patterns |
| `customLanguages` | `HashMap<String, CustomLang>` | No | Custom tree-sitter language definitions (`libraryPath`, `extensions`, `outlineRules`, `expandoChar`, `languageSymbol`) |
| `languageInjections` | `List<LanguageInjection>` | No (experimental) | Embedded language support, e.g. CSS in JS (`hostLanguage`, `rule`, `injected`) |

## Pattern Syntax

Patterns are written like ordinary code. Metavariables (`$NAME`) match any single AST node.

```sh
# Search for defensive null-check pattern
ast-grep -p '$PROP && $PROP()' --lang ts src/

# Rewrite to optional chaining
ast-grep -p '$PROP && $PROP()' --rewrite '$PROP?.()' --interactive -l ts src/
```

- Use single quotes `'` around patterns to prevent shell `$` expansion
- `ast-grep` infers language from file extensions if `--lang` is omitted

## Project Structure

```text
project/
├── sgconfig.yml        # root config
├── rules/              # YAML rule files (kebab-case filenames)
│   ├── no-var.yml
│   └── no-bit-operation.yml
├── rule-tests/         # test cases (if testConfigs set)
└── utils/              # utility rules (if utilDirs set)
```

- All YAML files under `ruleDirs` are treated as rule files
- Non-rule YAML files outside `ruleDirs` are ignored
- `ast-grep scan` requires `sgconfig.yml` in project root or via `--config`

## package.json Script

```json
{
  "scripts": {
    "scan": "ast-grep scan"
  }
}
```

If `@ast-grep/cli` is in `devDependencies`, use `ast-grep scan` (or `sg scan`) directly. Otherwise use `bunx -p @ast-grep/cli ast-grep scan` — never bare `bunx ast-grep`, which resolves an unrelated abandoned npm package.

## GitHub Action Integration

```yaml
on: [push]
jobs:
  sg-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: ast-grep/action@v1.5
```

## Source

- Official docs: https://ast-grep.github.io
- CLI reference: https://ast-grep.github.io/reference/cli.html
- sgconfig reference: https://ast-grep.github.io/reference/sgconfig.html
- Quick start: https://ast-grep.github.io/guide/quick-start.html
- npm: https://www.npmjs.com/package/@ast-grep/cli
- GitHub: https://github.com/ast-grep/ast-grep
