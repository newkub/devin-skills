# Linter Tools CLI

## Install

```sh
bun add -D @biomejs/biome # or oxlint/eslint
```

## Version

- Latest
- Repository: https://github.com/biomejs/biome
- Docs: https://biomejs.dev/reference/cli/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `biome lint [paths]` | Lint files; report only by default | — | --write, --unsafe, --only, --skip, --staged |
| `oxlint [paths]` | Lint current directory | — | --fix, --config, --deny, --warn, --allow, --max-warnings |
| `eslint [paths]` | Lint with flat config | — | --fix, --config, --quiet, --max-warnings, --format |

## Notes

Choose one linter; Biome or oxlint are preferred for speed.
