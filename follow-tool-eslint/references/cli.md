# ESLint CLI

## Install

```sh
bun add -D eslint
```

## Version

- Latest: `9.x`
- Repository: https://github.com/eslint/eslint
- Docs: https://eslint.org/docs/latest/use/command-line-interface

## Commands

| commands | description | default | options |
|---|---|---|---|
| `eslint [paths]` | Lint current working directory if no paths | uses `eslint.config.*` (flat config) | `-c, --config`, `--no-config-lookup`, `--inspect-config`, `--ext`, `--global`, `--parser`, `--no-ignore`, `--ignore-pattern`, `--stdin`, `--stdin-filename`, `--quiet`, `--max-warnings`, `-f, --format`, `-o, --output-file`, `--fix`, `--fix-type`, `--cache` |
| `eslint --help` | Show help | — | (none) |
| `eslint --version` | Print version | — | (none) |

## Examples

```sh
bunx eslint ./src
bunx eslint --fix ./src
bunx eslint --format json -o report.json ./src
bunx eslint --inspect-config
```
