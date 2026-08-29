# oxlint CLI

## Install

```sh
bun add -D oxlint
```

## Version

- Latest: see `oxlint` on npm
- Repository: https://github.com/oxc-project/oxc
- Docs: https://oxc.rs/docs/guide/usage/linter/cli.html

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `oxlint [paths]` | Lint current directory if no paths; use recommended rules by default | `-c, --config`, `--tsconfig`, `--init`, `-A/--allow`, `-W/--warn`, `-D/--deny`, `--fix`, `--fix-suggestions`, `--fix-dangerously`, `--format`, `--max-warnings`, `--deny-warnings`, `--ignore-path`, `--ignore-pattern`, `--no-ignore`, `--print-config` |
| `oxlint --rules` | List all rules | (none) |
| `oxlint --init` | Create `.oxlintrc.json` with defaults | (none) |

## Examples

```sh
bunx oxlint
bunx oxlint ./src
bunx oxlint --fix
bunx oxlint -D correctness -W suspicious
```
