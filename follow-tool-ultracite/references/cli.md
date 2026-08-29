# Ultracite (Biome) CLI

## Install

```sh
bun add -D ultracite
```

## Version

- Latest on npm
- Repository: https://github.com/ultracite/biome
- Docs: https://github.com/ultracite/biome

## Commands

| commands | description | default | options |
|---|---|---|---|
| `biome check [paths]` | Format, lint, assist | report only | --write, --formatter-enabled, --linter-enabled, --assist-enabled, --staged |
| `biome lint [paths]` | Lint files; report only | — | --write, --unsafe, --only, --skip, --staged |
| `biome format [paths]` | Format files | report only | --write, --staged, --changed |
| `biome ci [paths]` | CI-optimized check | fails on diagnostics | --staged, --changed |

## Notes

Ultracite provides a Biome preset; use `biome` commands after installing.
