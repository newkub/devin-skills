# cli

## index.md

# CLI Reference

## Installation

```bash
# bun
bun install -g @ast-grep/cli

# homebrew
brew install ast-grep

# cargo
cargo install ast-grep --locked
```

## Main Commands

### sg run

รัน lint rules หรือ search patterns:

```bash
sg run [OPTIONS]
sg run --rule <rule-id>
sg run --pattern <pattern>
```

| Option | Short | Description |
|--------|-------|-------------|
| `--rule` | `-r` | ระบุ rule ID |
| `--pattern` | `-p` | search pattern |
| `--lang` | `-l` | programming language |
| `--interactive` | `-i` | interactive mode |
| `--fix` | `-f` | auto-fix issues |

### sg search

ค้นหา code:

```bash
sg search [OPTIONS]
sg search --pattern <pattern>
sg search -p <pattern> -l ts ./src
```

| Option | Short | Description |
|--------|-------|-------------|
| `--pattern` | `-p` | search pattern |
| `--lang` | `-l` | language |
| `--globs` | `-g` | glob patterns |
| `--limit` | | limit results |
| `--json` | | output JSON |

### sg rewrite

แก้ไข code:

```bash
sg rewrite [OPTIONS]
sg rewrite -p <pattern> -r <replacement>
```

| Option | Short | Description |
|--------|-------|-------------|
| `--pattern` | `-p` | pattern to match |
| `--rewrite` | `-r` | rewrite pattern |
| `--interactive` | `-i` | confirm each change |
| `--dry-run` | | preview only |

### sg lint

lint code:

```bash
sg lint [OPTIONS]
sg lint
sg lint --fix
```

### sg init

สร้าง config file:

```bash
sg init
sg init --dir ./rules
```

### sg completion

สร้าง shell completion:

```bash
sg completion bash
sg completion zsh
sg completion fish
```

## Global Options

| Option | Description |
|--------|-------------|
| `--help, -h` | แสดง help |
| `--version, -v` | แสดง version |
| `--config <path>` | config file path |
| `--verbose` | verbose output |
| `--quiet` | quiet output |

## Usage Examples

### Basic Search

```bash
# หา console.log
sg search -p 'console.log($ARG)' -l ts ./src

# หาทุก async function
sg search -p 'async function $NAME()' -l ts ./src
```

### Rewrite

```bash
# แก้ไข var → const
sg rewrite -p 'var $VAR = $VAL' -r 'const $VAR = $VAL' -i ./src

# แก้ไข optional chaining
sg rewrite -p '$A && $A()' -r '$A?.()' ./src
```

### Lint

```bash
# lint ทั้ง project
sg lint

# auto-fix
sg lint --fix

# lint specific rules
sg run --rule no-console
```

## Output Formats

| Format | Option | Use Case |
|--------|--------|----------|
| text | (default) | human readable |
| json | `--json` | programmatic use |
| sarif | `--format sarif` | CI/CD, GitHub |
| stylish | `--format stylish` | terminal |

## Configuration

```yaml
# sg.config.yml
language: typescript
ruleDirs:
  - rules/
include:
  - "src/**/*.ts"
exclude:
  - "**/*.test.ts"
```

---

