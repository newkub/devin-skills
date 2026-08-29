# Pitchfork CLI

## Install

```sh
composer require --dev mnavarrocarter/pitchfork # PHP
```

## Version

- Latest on Packagist
- Repository: https://github.com/mnavarrocarter/pitchfork
- Docs: https://github.com/mnavarrocarter/pitchfork

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `pitchfork run` | Run configured workers | --config, --workers, --port, --host |
| `pitchfork status` | Show worker status | --json |
| `pitchfork stop` | Stop workers | --graceful |
| `pitchfork restart` | Restart workers | --config |
## Examples

```sh
vendor/bin/pitchfork run
```
```sh
vendor/bin/pitchfork status
```
