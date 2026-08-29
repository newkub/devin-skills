# ast-grep CLI

## Install

```sh
bun add -D @ast-grep/cli
```

## Version

- Latest: see `@ast-grep/cli` on npm
- Repository: https://github.com/ast-grep/ast-grep
- Docs: https://ast-grep.github.io/reference/cli

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `ast-grep [paths]` / `ast-grep run` | Run one-time search/rewrite; infer language from extension | `-p, --pattern`, `-k, --kind`, `-r, --rewrite`, `-l, --lang`, `--selector`, `--globs`, `-j, --threads`, `-i, --interactive`, `-U, --update-all`, `--json`, `--color`, `--inspect`, `--heading`, `-A/--after`, `-B/--before`, `-C/--context` |
| `ast-grep scan` | Scan files using rules in `ast-grep.yml` | `--config`, `--rule`, `--lang`, `--update-all`, `--threads` |
| `ast-grep rewrite` | Apply rewrite rules | `--config`, `--rule`, `--interactive`, `--update-all` |
| `ast-grep test` | Run rule tests | `--config` |
| `ast-grep new [rule]` | Create rule template | `--lang` |
| `ast-grep lsp` | Start LSP server | (none) |
| `ast-grep --help` | Show help | (none) |

## Examples

```sh
bunx ast-grep -p 'console.log($$$)' -r ''
bunx ast-grep scan --config ast-grep.yml
bunx ast-grep new my-rule --lang ts
```
