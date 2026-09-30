| key | value |
|---|---|
| install | `bun add -D eslint` |
| version | 10.x |
| repository | https://github.com/eslint/eslint |
| docs | https://eslint.org/docs/latest/use/command-line-interface |

| commands | description | default | options |
|---|---|---|---|
| `eslint [paths]` | Lint current working directory if no paths | uses `eslint.config.*` (flat config) | `-c, --config`, `--no-config-lookup`, `--inspect-config`, `--ext`, `--global`, `--parser`, `--no-ignore`, `--ignore-pattern`, `--stdin`, `--stdin-filename`, `--quiet`, `--max-warnings`, `-f, --format`, `-o, --output-file`, `--fix`, `--fix-type`, `--cache` |
| `eslint --help` | Show help | — | (none) |
| `eslint --version` | Print version | — | (none) |
