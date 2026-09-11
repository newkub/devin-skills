# ast-grep CLI

## Install

```sh
bun add -D @ast-grep/cli
```

## Version

- Latest: 0.45.3 (verified 2026-09-12) — package `@ast-grep/cli`, bins `ast-grep` and `sg`
- Repository: https://github.com/ast-grep/ast-grep
- Docs: https://ast-grep.github.io/reference/cli
- Ad-hoc without install: `bunx -p @ast-grep/cli ast-grep ...` (bare `bunx ast-grep` resolves an unrelated abandoned npm package)

## Commands

| commands | description | default | options |
|---|---|---|---|
| `ast-grep [paths]` / `ast-grep run` | Run one-time search/rewrite (default subcommand) | infer language from extension | `-p, --pattern`, `-k, --kind`, `-r, --rewrite`, `-l, --lang`, `--selector`, `--strictness`, `--globs`, `--no-ignore`, `--follow`, `--stdin`, `-j, --threads`, `-i, --interactive`, `-U, --update-all`, `--json pretty|stream|compact`, `--color`, `--inspect`, `-A/--after`, `-B/--before`, `-C/--context` |
| `ast-grep scan` | Scan/rewrite files using rules in `sgconfig.yml` | — | `-c, --config`, `-r, --rule`, `--inline-rules`, `--filter`, `--min-severity`, `--error/--warning/--info/--hint/--off`, `--include-metadata`, `--report-style`, `-i, --interactive`, `-U, --update-all`, `--json`, `--format github|sarif`, `--inspect`, `-j, --threads` |
| `ast-grep test` | Run rule tests (`rule-tests/`) | — | `--config`, `--test-dir`, `--interactive`, `--update-all` |
| `ast-grep new [rule]` | Scaffold project or create rule template | — | `--lang` |
| `ast-grep outline` | Inspect source structure | — | `--config` |
| `ast-grep lsp` | Start LSP server | — | (none) |
| `ast-grep completions <shell>` | Print shell completions | — | (none) |
| `ast-grep --help` | Show help | — | (none) |

Note: there is no `ast-grep rewrite` subcommand — rewrites happen via `run -r`/`scan` with `--interactive` or `--update-all`.

## Examples

```sh
ast-grep -p 'console.log($$$)' -r '' --lang ts src/
ast-grep scan --config sgconfig.yml --min-severity warning
ast-grep scan --inline-rules 'id: no-var
language: TypeScript
rule: {kind: variable_declaration, has: {kind: var_keyword}}'
ast-grep new rule my-rule --lang ts
```
