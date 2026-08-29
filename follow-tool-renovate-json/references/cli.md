# Renovate Config Validator CLI

## Install

```sh
bun add -D renovate
```

## Version

- Latest on npm
- Repository: https://github.com/renovatebot/renovate
- Docs: https://docs.renovatebot.com/config-validation/

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `renovate-config-validator <file>` | Validate config file | --strict |
| `renovate-config-validator` | Validate default configs | (none) |
## Examples

```sh
bunx renovate-config-validator renovate.json
```
```sh
bunx renovate-config-validator --strict
```
