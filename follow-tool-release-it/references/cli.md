# release-it CLI

## Install

```sh
bun add -D release-it
```

## Version

- Latest on npm
- Repository: https://github.com/release-it/release-it
- Docs: https://github.com/release-it/release-it

## Commands

| commands | description | default | options |
|---|---|---|---|
| `release-it` | Release current version | — | --ci, --dry-run, --verbose, --debug |
| `release-it minor` | Release minor version | — | --no-git, --no-github, --no-npm |
| `release-it major` | Release major version | — | --config, --only-version |
| `release-it patch` | Release patch version | — | --pre-release, --github.release |
| `release-it --dry-run` | Preview release | — | --no-increment |
## Examples

```sh
bunx release-it --dry-run
```
```sh
bunx release-it minor
```
```sh
bunx release-it --ci
```
