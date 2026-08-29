# Renovate CLI

## Install

```sh
bun add -D renovate
```

## Version

- Latest on npm
- Repository: https://github.com/renovatebot/renovate
- Docs: https://docs.renovatebot.com/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `renovate` | Run Renovate on configured repos | — | --autodiscover, --dry-run, --log-level |
| `renovate --dry-run` | Simulate only | — | --autodiscover, --repositories, --token |
| `renovate-config-validator` | Validate Renovate config | — | --strict |
| `renovate --help` | Show help | — | (none) |
## Examples

```sh
bunx renovate --dry-run
```
```sh
bunx renovate-config-validator
```
