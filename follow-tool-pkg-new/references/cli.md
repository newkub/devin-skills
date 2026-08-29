# pkg-pr-new CLI

## Install

```sh
bun add -D pkg-pr-new
```

## Version

- Latest on npm
- Repository: https://github.com/stackblitz/pkg-pr-new
- Docs: https://github.com/stackblitz/pkg-pr-new

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `pkg-pr-new` | Publish preview packages for PR | --comment, --compact, --only-templates, --no-template |
| `pkg-pr-new publish` | Publish packages | --json, --yes |
| `pkg-pr-new check` | Check repository | --token |
| `pkg-pr-new --help` | Show help | (none) |
## Examples

```sh
bunx pkg-pr-new
```
```sh
bunx pkg-pr-new publish ./packages/*
```
