# ripgrep (`rg`)

## Options

| Flag | Effect | Example |
|---|---|---|
| `-n` | line numbers | `rg -n 'TODO' src` |
| `-F` | fixed string, no regex | `rg -F 'a.b' .` |
| `-i` | case-insensitive | `rg -i 'timeout' .` |
| `-w` | whole word | `rg -w 'fit' src` |
| `-t` | file type filter | `rg -t rust 'unwrap' .` |
| `-g` | include/exclude glob | `rg -g '*.ts' -g '!*.test.ts' .` |
| `-l` | list files only | `rg -l 'deprecated' .` |
| `-c` | match count per file | `rg -c 'import' src` |
| `-C` | context lines | `rg -C 2 'panic!' src` |
| `-A` / `-B` | after / before context | `rg -A3 'fn main' src` |
| `-U` | multi-line mode | `rg -U 'struct \w+\s*\{' .` |
| `-o` | print match only | `rg -o 'v\d+\.\d+' .` |
| `--hidden` | include dotfiles | `rg --hidden 'DB_URL' .` |
| `--no-ignore` | ignore ignore files | `rg --no-ignore 'pattern' .` |
| `--files` | list files | `rg --files -g '*.md'` |
| `--json` | structured output | `rg --json 'pattern' src` |
| `--stats` | search statistics | `rg --stats 'pattern' .` |
| `--text` | treat binary as text | `rg --text 'pattern' logs` |

## Recipes

| Target | Command |
|---|---|
| Files by name | `rg --files -g '*.test.ts'` |
| Import of a module | `rg -n "from ['\"]zod['\"]" src` |
| TODO inventory | `rg -n -e TODO -e FIXME -e HACK src` |
| Call sites by name | `rg -n '\bcalculateTax\s*\(' src` |
| Files containing a word | `rg -l -w 'legacy' src` |
| Exclude build output | `rg -n 'pattern' . -g '!dist' -g '!target' -g '!node_modules'` |
| Multi-line block | `rg -U -n 'try \{[\s\S]*?catch' src` |
| JSON for scripts | `rg --json 'TODO' src` |

## Notes

| Constraint | Detail |
|---|---|
| Ignore-aware | honors `.gitignore`; `--no-ignore` searches ignored files |
| Binary files | skipped by default; `--text` forces reading |
| Large repos | restrict path or type first; `--stats` confirms scope |
| Windows shell | use double quotes in PowerShell; single quotes work in Git Bash |
| Nested structure | regex cannot match nesting — use `ast-grep` |
| Safety | never paste secrets found by a search into a report |
